
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  increment,
  arrayUnion,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { User, AuthContextType, Product, Transaction, PurchasedItem } from '../types';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper: Convert phone to virtual email for Firebase Auth
  const phoneToEmail = (phone: string) => `${phone.replace('+', '')}@grabgold.com`;

  // --- ROI CALCULATION LOGIC ---
  const syncROI = async (userData: User) => {
    const now = Date.now();
    let balanceChange = 0;
    let hasChanges = false;
    const newTransactions: Transaction[] = [];

    const updatedPurchases = userData.purchases.map(p => {
      if (p.status === 'Completed') return p;
      
      const lastRoi = p.lastRoiDate || Date.parse(p.purchaseDate);
      const diffTime = now - lastRoi;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 1) {
        const payDays = Math.min(diffDays, p.remainingDays);
        if (payDays > 0) {
          const income = p.dailyIncome * payDays;
          balanceChange += income;
          
          newTransactions.push({
            id: 'ROI' + Math.random().toString(36).substr(2, 6),
            type: 'daily_income',
            amount: income,
            date: new Date().toISOString(),
            description: `Profit: ${p.name} (${payDays}d)`,
            status: 'Success'
          });

          const newRemaining = p.remainingDays - payDays;
          hasChanges = true;
          
          return {
            ...p,
            remainingDays: newRemaining,
            lastRoiDate: lastRoi + (payDays * 24 * 60 * 60 * 1000),
            status: newRemaining <= 0 ? 'Completed' : 'Active'
          } as PurchasedItem;
        }
      }
      return p;
    });

    if (hasChanges) {
      const userRef = doc(db, 'users', userData.phoneNumber);
      await updateDoc(userRef, {
        balance: increment(balanceChange),
        purchases: updatedPurchases,
        transactions: arrayUnion(...newTransactions)
      });
      // Fetch fresh data
      const snap = await getDoc(userRef);
      if (snap.exists()) setUser(snap.data() as User);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Find phone from email or metadata? We use email as key
        const phone = fbUser.email?.split('@')[0];
        if (phone) {
          const formattedPhone = `+${phone}`;
          const userDoc = await getDoc(doc(db, 'users', formattedPhone));
          if (userDoc.exists()) {
            const data = userDoc.data() as User;
            setUser(data);
            await syncROI(data);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (phone: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, phoneToEmail(phone), pass);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const signup = async (phone: string, pass: string, refCode?: string) => {
    try {
      const email = phoneToEmail(phone);
      
      // 1. Check if user already exists in Firestore (safety)
      const existing = await getDoc(doc(db, 'users', phone));
      if (existing.exists()) return false;

      // 2. Create Auth User
      await createUserWithEmailAndPassword(auth, email, pass);

      let referrerPhone: string | undefined = undefined;
      const newUserReferralCode = Math.random().toString(36).substr(2, 6).toUpperCase();

      // 3. Handle Referral Hierarchy
      if (refCode) {
        const refQuery = query(collection(db, 'users'), where('referralCode', '==', refCode));
        const refSnap = await getDocs(refQuery);
        
        if (!refSnap.empty) {
          const l1User = refSnap.docs[0].data() as User;
          referrerPhone = l1User.phoneNumber;

          await runTransaction(db, async (transaction) => {
             // Update L1
             transaction.update(doc(db, 'users', l1User.phoneNumber), {
               'team.l1': arrayUnion(phone)
             });

             // Update L2
             if (l1User.referrerPhoneNumber) {
                transaction.update(doc(db, 'users', l1User.referrerPhoneNumber), {
                   'team.l2': arrayUnion(phone)
                });

                // Update L3
                const l2Snap = await transaction.get(doc(db, 'users', l1User.referrerPhoneNumber));
                const l2Data = l2Snap.data() as User;
                if (l2Data.referrerPhoneNumber) {
                   transaction.update(doc(db, 'users', l2Data.referrerPhoneNumber), {
                      'team.l3': arrayUnion(phone)
                   });
                }
             }
          });
        }
      }

      // 4. Create User Document
      const userData: User = {
        phoneNumber: phone,
        password: pass, // Storing for local UI display/admin purposes
        referralCode: newUserReferralCode,
        balance: 50,
        coinBalance: 0,
        referrerPhoneNumber: referrerPhone,
        team: { l1: [], l2: [], l3: [] },
        purchases: [],
        transactions: [{
          id: 'REG' + Date.now(),
          type: 'bonus',
          amount: 50,
          date: new Date().toISOString(),
          description: 'Registration Bonus',
          status: 'Success'
        }],
        lastDailyBonusDate: ''
      };

      await setDoc(doc(db, 'users', phone), userData);
      setUser(userData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => signOut(auth);

  const buyProduct = async (product: Product) => {
    if (!user) return { success: false, message: 'Auth Error' };
    
    try {
      const userRef = doc(db, 'users', user.phoneNumber);
      const snap = await getDoc(userRef);
      const current = snap.data() as User;

      if (current.balance < product.price) return { success: false, message: 'Insufficient Balance' };

      const newPurchase: PurchasedItem = {
        ...product,
        purchaseDate: new Date().toISOString(),
        lastRoiDate: Date.now(),
        remainingDays: product.days,
        status: 'Active'
      };

      const buyTx: Transaction = {
        id: 'INV' + Date.now(),
        type: 'purchase',
        amount: product.price,
        date: new Date().toISOString(),
        description: `Invested in ${product.name}`,
        status: 'Success'
      };

      await updateDoc(userRef, {
        balance: increment(-product.price),
        purchases: arrayUnion(newPurchase),
        transactions: arrayUnion(buyTx)
      });

      // Distribute Commissions via background sync or simple chain
      if (current.referrerPhoneNumber) {
          const l1Ref = doc(db, 'users', current.referrerPhoneNumber);
          await updateDoc(l1Ref, {
              balance: increment(product.price * 0.10),
              transactions: arrayUnion({
                  id: 'COM' + Date.now(),
                  type: 'commission',
                  amount: product.price * 0.10,
                  date: new Date().toISOString(),
                  description: `L1 Commission from ${user.phoneNumber}`,
                  status: 'Success'
              })
          });
      }

      const updatedSnap = await getDoc(userRef);
      setUser(updatedSnap.data() as User);
      return { success: true, message: 'Investment Active!' };
    } catch (e) {
      return { success: false, message: 'Transaction Failed' };
    }
  };

  const recharge = async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.phoneNumber);
    await updateDoc(userRef, {
      balance: increment(amount),
      transactions: arrayUnion({
        id: 'DEP' + Date.now(),
        type: 'deposit',
        amount: amount,
        date: new Date().toISOString(),
        description: 'Recharge Credit',
        status: 'Success'
      })
    });
    const snap = await getDoc(userRef);
    setUser(snap.data() as User);
  };

  const withdraw = async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.phoneNumber);
    await updateDoc(userRef, {
      balance: increment(-amount),
      transactions: arrayUnion({
        id: 'WD' + Date.now(),
        type: 'withdrawal',
        amount: amount,
        date: new Date().toISOString(),
        description: 'Withdrawal Request',
        status: 'Pending'
      })
    });
    const snap = await getDoc(userRef);
    setUser(snap.data() as User);
  };

  const updateBankDetails = async (details: any) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.phoneNumber);
    await updateDoc(userRef, { bankDetails: details });
    const snap = await getDoc(userRef);
    setUser(snap.data() as User);
  };

  const changePassword = async (oldP: string, newP: string) => {
    if (!user || !auth.currentUser) return { success: false, message: 'Error' };
    try {
       const credential = EmailAuthProvider.credential(auth.currentUser.email!, oldP);
       await reauthenticateWithCredential(auth.currentUser, credential);
       await firebaseUpdatePassword(auth.currentUser, newP);
       await updateDoc(doc(db, 'users', user.phoneNumber), { password: newP });
       return { success: true, message: 'Password Updated' };
    } catch (e: any) {
       return { success: false, message: e.message };
    }
  };

  const claimDailyBonus = async () => {
    if (!user) return { success: false, message: 'Error', amount: 0 };
    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', user.phoneNumber);
    const snap = await getDoc(userRef);
    const data = snap.data() as User;

    if (data.lastDailyBonusDate === today) return { success: false, message: 'Already claimed', amount: 0 };

    const bonus = 25;
    await updateDoc(userRef, {
      balance: increment(bonus),
      lastDailyBonusDate: today,
      transactions: arrayUnion({
        id: 'BON' + Date.now(),
        type: 'bonus',
        amount: bonus,
        date: new Date().toISOString(),
        description: 'Daily Check-in',
        status: 'Success'
      })
    });

    const finalSnap = await getDoc(userRef);
    setUser(finalSnap.data() as User);
    return { success: true, message: 'Bonus Credited!', amount: bonus };
  };

  // --- ADMIN FUNCTIONS ---
  const fetchAllUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as User);
  };

  const processWithdrawal = async (targetPhone: string, txId: string, action: 'approve' | 'reject') => {
    const userRef = doc(db, 'users', targetPhone);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data() as User;
    const txIndex = data.transactions.findIndex(t => t.id === txId);
    if (txIndex === -1) return;

    const updatedTxs = [...data.transactions];
    if (action === 'approve') {
      updatedTxs[txIndex].status = 'Success';
      await updateDoc(userRef, { transactions: updatedTxs });
    } else {
      updatedTxs[txIndex].status = 'Failed';
      await updateDoc(userRef, { 
        transactions: updatedTxs,
        balance: increment(data.transactions[txIndex].amount) 
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, signup, logout, buyProduct, recharge, withdraw, 
      updateBankDetails, changePassword, claimDailyBonus,
      fetchAllUsers, processWithdrawal
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

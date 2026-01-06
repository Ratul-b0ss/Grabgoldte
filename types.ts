
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'commission' | 'daily_income' | 'bonus';
  amount: number;
  date: string;
  description: string;
  status?: 'Pending' | 'Success' | 'Failed';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  dailyIncome: number;
  days: number;
}

export interface PurchasedItem extends Product {
  purchaseDate: string;
  lastRoiDate: number; // Timestamp of the last time daily income was credited
  remainingDays: number;
  status: 'Active' | 'Completed';
}

export interface User {
  phoneNumber: string;
  password: string;
  referralCode: string;
  balance: number;
  coinBalance: number;
  referrerPhoneNumber?: string;
  lastDailyBonusDate?: string; // Format: YYYY-MM-DD
  team: {
    l1: string[];
    l2: string[];
    l3: string[];
  };
  purchases: PurchasedItem[];
  transactions: Transaction[];
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, pass: string) => Promise<boolean>;
  signup: (phoneNumber: string, pass: string, refCode?: string) => Promise<boolean>;
  logout: () => void;
  buyProduct: (product: Product) => Promise<{ success: boolean; message: string }>;
  recharge: (amount: number) => void;
  withdraw: (amount: number) => void;
  updateBankDetails: (details: User['bankDetails']) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  claimDailyBonus: () => Promise<{ success: boolean; message: string; amount: number }>;
  // Admin Functions
  fetchAllUsers: () => Promise<User[]>;
  processWithdrawal: (targetPhone: string, txId: string, action: 'approve' | 'reject') => Promise<void>;
}

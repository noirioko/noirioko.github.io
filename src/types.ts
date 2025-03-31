export interface Task {
  id: string;
  name: string;     // Primary field name
  title?: string;   // Alternative field name for backward compatibility
  description?: string; // Description of the task
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  points: number; // Points earned when completing the task
  roomId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Room {
  id: string;
  name: string;
  tasks: Task[];
  imageUrl?: string; // Optional image URL for the room
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  description?: string; // General description for the entry
  mood?: string;
  gratitude?: string;
  achievement?: string;
  selfCare?: string;
  tomorrow?: string;
  paperStyle?: 'lined' | 'grid' | 'dot' | 'blank';
}

export interface SkinCareEntry {
  id: string;
  date: string;
  am: boolean;
  pm: boolean;
  morning: boolean;
  evening: boolean;
  cleansed: boolean;
  toner: boolean;
  serum: boolean;
  moisturizer: boolean;
  sunscreen: boolean;
  mask: boolean;
  notes: string;
  description?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  points?: number; // For backward compatibility
  createdAt: string;
  claimedAt?: string;
  claimed: boolean;
  currency: 'points' | 'credits'; // Currency type: YuyuPoints or Noah's CC
  type: 'item' | 'activity' | 'headgear' | 'currency_exchange'; // Type of reward, added currency_exchange
  itemId?: string; // Used for headgear ID
  imageUrl?: string;
  iconUrl?: string; // Optional URL for a small icon
  redeemHistory?: RedeemEvent[]; // For backward compatibility
  effect?: { // Optional effect definition
    type: 'grant_currency';
    currency: 'points' | 'credits';
    amount: number;
  };
}

export interface Headgear {
  id: string;
  name: string;
  imageUrl: string;
  cost: number;
  currency: 'points' | 'credits';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'earned' | 'spent';
}

export interface CreditsTransaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'earned' | 'spent';
}

export interface RedeemEvent {
  id: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: string; // Optional color for note styling
}

export interface UserState {
  points: number;
  credits: number;
  rooms: Room[];
  rewards: Reward[];
  diaryEntries: DiaryEntry[];
  skincareEntries: SkinCareEntry[];
  blogPosts: BlogPost[];
  notes: Note[]; // Add notes to user state
  activeHeadgear: string | null;
  ownedHeadgear: Headgear[];
  darkMode: boolean;
} 
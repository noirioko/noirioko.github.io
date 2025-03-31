export interface Task {
  id: string;
  name: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  createdAt?: string;
  roomId?: string;
  points: number;
  description: string;
}

export interface Room {
  id: string;
  name: string;
  tasks: Task[];
  imageUrl?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
}

export interface SkincareRoutineEntry {
  id: string;
  date: string;
  morning: boolean;
  evening: boolean;
  notes?: string;
}

export interface RedeemEvent {
  id: string;
  date: string;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  redeemHistory: RedeemEvent[];
}

export interface UserState {
  points: number;
  rooms: Room[];
  diaryEntries: DiaryEntry[];
  skincareEntries: SkincareRoutineEntry[];
  rewards: Reward[];
} 
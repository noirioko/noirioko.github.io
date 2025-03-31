import React, { createContext, useContext, useState, useEffect, ReactNode, useReducer, useRef } from 'react';
import { 
  UserState, 
  Task, 
  Room, 
  DiaryEntry, 
  SkinCareEntry, 
  Reward, 
  RedeemEvent,
  Headgear,
  BlogPost,
  Note
} from '../types';

// Action Types
type ActionType = 
  | { type: 'ADD_POINTS'; amount: number }
  | { type: 'ADD_CREDITS'; amount: number }
  | { type: 'SUBTRACT_POINTS'; amount: number }
  | { type: 'SUBTRACT_CREDITS'; amount: number }
  | { type: 'ADD_ROOM'; room: Room }
  | { type: 'UPDATE_ROOM'; room: Room }
  | { type: 'DELETE_ROOM'; roomId: string }
  | { type: 'ADD_TASK'; roomId: string; task: Task }
  | { type: 'UPDATE_TASK'; roomId: string; task: Task }
  | { type: 'DELETE_TASK'; roomId: string; taskId: string }
  | { type: 'COMPLETE_TASK'; roomId: string; taskId: string }
  | { type: 'RESET_TASK'; roomId: string; taskId: string }
  | { type: 'ADD_REWARD'; reward: Reward }
  | { type: 'UPDATE_REWARD'; reward: Reward }
  | { type: 'DELETE_REWARD'; rewardId: string }
  | { type: 'REDEEM_REWARD'; rewardId: string }
  | { type: 'ADD_DIARY_ENTRY'; entry: DiaryEntry }
  | { type: 'UPDATE_DIARY_ENTRY'; entry: DiaryEntry }
  | { type: 'DELETE_DIARY_ENTRY'; entryId: string }
  | { type: 'ADD_SKINCARE_ENTRY'; entry: SkinCareEntry }
  | { type: 'UPDATE_SKINCARE_ENTRY'; entry: SkinCareEntry }
  | { type: 'DELETE_SKINCARE_ENTRY'; entryId: string }
  | { type: 'ADD_BLOG_POST'; post: BlogPost }
  | { type: 'UPDATE_BLOG_POST'; post: BlogPost }
  | { type: 'DELETE_BLOG_POST'; postId: string }
  | { type: 'ADD_NOTE'; note: Note }
  | { type: 'UPDATE_NOTE'; note: Note }
  | { type: 'DELETE_NOTE'; noteId: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'RESET_ALL_DATA' }
  | { type: 'EQUIP_HEADGEAR'; headgearId: string | null }
  | { type: 'ADD_HEADGEAR'; headgear: Headgear };

// Helper function to get points by difficulty
const getDifficultyPoints = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy':
      return 5;
    case 'medium':
      return 15;
    case 'hard':
      return 25;
    default:
      return 0;
  }
};

// Initial State
const initialState: UserState = {
  points: 0,
  credits: 0,
  rooms: [],
  rewards: [],
  diaryEntries: [],
  skincareEntries: [],
  blogPosts: [],
  notes: [],
  activeHeadgear: null,
  ownedHeadgear: [],
  darkMode: false
};

// Reducer Function
const appReducer = (state: UserState, action: ActionType): UserState => {
  switch (action.type) {
    case 'ADD_POINTS':
      return { ...state, points: state.points + action.amount };
    
    case 'ADD_CREDITS':
      return { ...state, credits: state.credits + action.amount };
    
    case 'SUBTRACT_POINTS':
      return { ...state, points: state.points - action.amount };
    
    case 'SUBTRACT_CREDITS':
      return { ...state, credits: state.credits - action.amount };
    
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.room] };
    
    case 'UPDATE_ROOM':
      return { 
        ...state, 
        rooms: state.rooms.map(room => 
          room.id === action.room.id ? action.room : room
        ) 
      };
    
    case 'DELETE_ROOM':
      return { 
        ...state, 
        rooms: state.rooms.filter(room => room.id !== action.roomId) 
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.roomId) {
            return {
              ...room,
              tasks: [...room.tasks, action.task]
            };
          }
          return room;
        })
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.roomId) {
            return {
              ...room,
              tasks: room.tasks.map(task =>
                task.id === action.task.id ? action.task : task
              )
            };
          }
          return room;
        })
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.roomId) {
            return {
              ...room,
              tasks: room.tasks.filter(task => task.id !== action.taskId)
            };
          }
          return room;
        })
      };
    
    case 'COMPLETE_TASK':
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.roomId) {
            return {
              ...room,
              tasks: room.tasks.map(task => {
                if (task.id === action.taskId) {
                  return { ...task, completed: true };
                }
                return task;
              })
            };
          }
          return room;
        })
      };
    
    case 'RESET_TASK':
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.roomId) {
            return {
              ...room,
              tasks: room.tasks.map(task => {
                if (task.id === action.taskId) {
                  return { ...task, completed: false };
                }
                return task;
              })
            };
          }
          return room;
        })
      };
    
    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, action.reward] };
    
    case 'UPDATE_REWARD':
      return { 
        ...state, 
        rewards: state.rewards.map(reward => 
          reward.id === action.reward.id ? action.reward : reward
        ) 
      };
    
    case 'DELETE_REWARD':
      return { 
        ...state, 
        rewards: state.rewards.filter(reward => reward.id !== action.rewardId) 
      };
    
    case 'REDEEM_REWARD': {
      const reward = state.rewards.find(r => r.id === action.rewardId);
      if (!reward) return state;
      
      // Check if enough currency and spend it
      if (reward.currency === 'points' && state.points >= reward.cost) {
        // Create a redeem event
        const redeemEvent: RedeemEvent = {
          id: Date.now().toString(), 
          date: new Date().toISOString()
        };
        
        // Deduct points and apply effect
        let points = state.points - reward.cost;
        let credits = state.credits;
        
        // Apply reward effect if it exists
        if (reward.effect?.type === 'grant_currency') {
          if (reward.effect.currency === 'points') {
            points += reward.effect.amount;
          } else if (reward.effect.currency === 'credits') {
            credits += reward.effect.amount;
          }
        }
        
        // Update the reward with a new entry in redeemHistory
        const updatedRewards = state.rewards.map(r => 
          r.id === action.rewardId 
            ? { 
                ...r, 
                claimed: true, 
                claimedAt: new Date().toISOString(),
                redeemHistory: r.redeemHistory ? [...r.redeemHistory, redeemEvent] : [redeemEvent] 
              }
            : r
        );
        
        return { 
          ...state, 
          points,
          credits,
          rewards: updatedRewards
        };
      } else if (reward.currency === 'credits' && state.credits >= reward.cost) {
        // Create a redeem event
        const redeemEvent: RedeemEvent = {
          id: Date.now().toString(), 
          date: new Date().toISOString()
        };
        
        // Deduct credits and apply effect
        let credits = state.credits - reward.cost;
        let points = state.points;
        
        // Apply reward effect if it exists
        if (reward.effect?.type === 'grant_currency') {
          if (reward.effect.currency === 'points') {
            points += reward.effect.amount;
          } else if (reward.effect.currency === 'credits') {
            credits += reward.effect.amount;
          }
        }
        
        // Update the reward with a new entry in redeemHistory
        const updatedRewards = state.rewards.map(r => 
          r.id === action.rewardId 
            ? { 
                ...r, 
                claimed: true, 
                claimedAt: new Date().toISOString(),
                redeemHistory: r.redeemHistory ? [...r.redeemHistory, redeemEvent] : [redeemEvent] 
              }
            : r
        );
        
        return { 
          ...state, 
          points,
          credits,
          rewards: updatedRewards
        };
      }
      
      return state;
    }
    
    case 'ADD_DIARY_ENTRY':
      return { ...state, diaryEntries: [...state.diaryEntries, action.entry] };
    
    case 'UPDATE_DIARY_ENTRY':
      return { 
        ...state, 
        diaryEntries: state.diaryEntries.map(entry => 
          entry.id === action.entry.id ? action.entry : entry
        ) 
      };
    
    case 'DELETE_DIARY_ENTRY':
      return { 
        ...state, 
        diaryEntries: state.diaryEntries.filter(entry => entry.id !== action.entryId) 
      };
    
    case 'ADD_SKINCARE_ENTRY':
      return { ...state, skincareEntries: [...state.skincareEntries, action.entry] };
    
    case 'UPDATE_SKINCARE_ENTRY':
      return { 
        ...state, 
        skincareEntries: state.skincareEntries.map(entry => 
          entry.id === action.entry.id ? action.entry : entry
        ) 
      };
    
    case 'DELETE_SKINCARE_ENTRY':
      return { 
        ...state, 
        skincareEntries: state.skincareEntries.filter(entry => entry.id !== action.entryId) 
      };
    
    case 'ADD_BLOG_POST':
      return { ...state, blogPosts: [...state.blogPosts, action.post] };
    
    case 'UPDATE_BLOG_POST':
      return { 
        ...state, 
        blogPosts: state.blogPosts.map(post => 
          post.id === action.post.id ? action.post : post
        ) 
      };
    
    case 'DELETE_BLOG_POST':
      return { 
        ...state, 
        blogPosts: state.blogPosts.filter(post => post.id !== action.postId) 
      };
    
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.note] };
    
    case 'UPDATE_NOTE':
      return { 
        ...state, 
        notes: state.notes.map(note => 
          note.id === action.note.id ? action.note : note
        ) 
      };
    
    case 'DELETE_NOTE':
      return { 
        ...state, 
        notes: state.notes.filter(note => note.id !== action.noteId) 
      };
    
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode
      };
    
    case 'RESET_ALL_DATA':
      return initialState;
    
    case 'EQUIP_HEADGEAR':
      return {
        ...state,
        activeHeadgear: action.headgearId
      };
    
    case 'ADD_HEADGEAR':
      return {
        ...state,
        ownedHeadgear: [...state.ownedHeadgear, action.headgear]
      };
    
    default:
      return state;
  }
};

// Context Type
interface AppContextType extends UserState {
  dispatch: React.Dispatch<ActionType>;
  completeTask: (roomId: string, taskId: string) => void;
  resetTask: (roomId: string, taskId: string) => void;
  addTask: (roomId: string, task: Task) => void;
  updateTask: (roomId: string, task: Task) => void;
  deleteTask: (roomId: string, taskId: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  addDiaryEntry: (entry: DiaryEntry) => void;
  updateDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (entryId: string) => void;
  addSkincareEntry: (entry: SkinCareEntry) => void;
  updateSkincareEntry: (entry: SkinCareEntry) => void;
  deleteSkincareEntry: (entryId: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;
  redeemReward: (rewardId: string) => void;
  addReward: (reward: Reward) => void;
  updateReward: (reward: Reward) => void;
  deleteReward: (rewardId: string) => void;
  resetAllData: () => void;
  
  // Points and Credits functions
  addPoints: (amount: number, description?: string) => void;
  spendPoints: (amount: number, description?: string) => boolean;
  addCredits: (amount: number, description?: string) => void;
  spendCredits: (amount: number, description?: string) => boolean;
  
  // Headgear functions
  equipHeadgear: (headgearId: string | null) => void;
  addHeadgear: (headgear: Headgear) => void;
  hasHeadgear: (headgearId: string) => boolean;
  
  // Note functions
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Initialize data from localStorage or use default state
  const [loadedState, setLoadedState] = useState<UserState>(initialState);
  const isInitialRender = useRef(true);
  
  // Load state from localStorage on first render
  useEffect(() => {
    const savedData = localStorage.getItem('yuyuPlannerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setLoadedState(parsedData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialRender.current) {
      localStorage.setItem('yuyuPlannerData', JSON.stringify(loadedState));
    } else {
      isInitialRender.current = false;
    }
  }, [loadedState]);
  
  // Update loadedState when state changes from reducer
  useEffect(() => {
    setLoadedState(state);
  }, [state]);
  
  // Function to add points to user
  const addPoints = (amount: number) => {
    dispatch({ type: 'ADD_POINTS', amount });
  };
  
  // Function to add credits
  const addCredits = (amount: number, description?: string) => {
    dispatch({ type: 'ADD_CREDITS', amount });
  };
  
  // Function to spend points
  const spendPoints = (amount: number, description?: string): boolean => {
    if (loadedState.points >= amount) {
      dispatch({ type: 'SUBTRACT_POINTS', amount });
      return true;
    }
    return false;
  };
  
  // Function to spend credits
  const spendCredits = (amount: number, description?: string): boolean => {
    if (loadedState.credits >= amount) {
      dispatch({ type: 'SUBTRACT_CREDITS', amount });
      return true;
    }
    return false;
  };
  
  // Room functions
  const addRoom = (room: Room) => {
    dispatch({ type: 'ADD_ROOM', room });
  };
  
  const updateRoom = (room: Room) => {
    dispatch({ type: 'UPDATE_ROOM', room });
  };
  
  const deleteRoom = (roomId: string) => {
    dispatch({ type: 'DELETE_ROOM', roomId });
  };
  
  // Task functions
  const addTask = (roomId: string, task: Task) => {
    dispatch({ type: 'ADD_TASK', roomId, task });
  };
  
  const updateTask = (roomId: string, task: Task) => {
    dispatch({ type: 'UPDATE_TASK', roomId, task });
  };
  
  const deleteTask = (roomId: string, taskId: string) => {
    dispatch({ type: 'DELETE_TASK', roomId, taskId });
  };
  
  const completeTask = (roomId: string, taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', roomId, taskId });
    
    // Find the task to award points
    const room = loadedState.rooms.find(r => r.id === roomId);
    const task = room?.tasks.find(t => t.id === taskId);
    
    if (task && !task.completed) {
      addPoints(task.points);
      addCredits(Math.ceil(task.points / 2)); // Noah's CC is half the YP, rounded up
    }
  };
  
  const resetTask = (roomId: string, taskId: string) => {
    dispatch({ type: 'RESET_TASK', roomId, taskId });
  };
  
  // Diary functions
  const addDiaryEntry = (entry: DiaryEntry) => {
    dispatch({ type: 'ADD_DIARY_ENTRY', entry });
    // Add points for creating a diary entry
    addPoints(5);
    addCredits(2);
  };
  
  const updateDiaryEntry = (entry: DiaryEntry) => {
    dispatch({ type: 'UPDATE_DIARY_ENTRY', entry });
  };
  
  const deleteDiaryEntry = (entryId: string) => {
    dispatch({ type: 'DELETE_DIARY_ENTRY', entryId });
  };
  
  // Reward functions
  const addReward = (reward: Reward) => {
    dispatch({ type: 'ADD_REWARD', reward });
  };
  
  const updateReward = (reward: Reward) => {
    dispatch({ type: 'UPDATE_REWARD', reward });
  };
  
  const deleteReward = (rewardId: string) => {
    dispatch({ type: 'DELETE_REWARD', rewardId });
  };
  
  const redeemReward = (rewardId: string) => {
    dispatch({ type: 'REDEEM_REWARD', rewardId });
  };
  
  // Skincare functions
  const addSkincareEntry = (entry: SkinCareEntry) => {
    dispatch({ type: 'ADD_SKINCARE_ENTRY', entry });
    // Add points for creating a skincare entry
    addPoints(3);
    addCredits(1);
  };
  
  const updateSkincareEntry = (entry: SkinCareEntry) => {
    dispatch({ type: 'UPDATE_SKINCARE_ENTRY', entry });
  };
  
  const deleteSkincareEntry = (entryId: string) => {
    dispatch({ type: 'DELETE_SKINCARE_ENTRY', entryId });
  };
  
  // Headgear functions
  const equipHeadgear = (headgearId: string | null) => {
    dispatch({ type: 'EQUIP_HEADGEAR', headgearId });
  };
  
  const addHeadgear = (headgear: Headgear) => {
    if (!hasHeadgear(headgear.id)) {
      dispatch({ type: 'ADD_HEADGEAR', headgear });
    }
  };
  
  const hasHeadgear = (headgearId: string) => {
    return loadedState.ownedHeadgear.some(headgear => headgear.id === headgearId);
  };
  
  // Reset all data function
  const resetAllData = () => {
    dispatch({ type: 'RESET_ALL_DATA' });
  };

  // Blog Post operations
  const addBlogPost = (post: BlogPost) => {
    dispatch({ type: 'ADD_BLOG_POST', post });
    // Add points for creating a blog post
    addPoints(5);
  };

  const updateBlogPost = (post: BlogPost) => {
    dispatch({ type: 'UPDATE_BLOG_POST', post });
  };

  const deleteBlogPost = (postId: string) => {
    dispatch({ type: 'DELETE_BLOG_POST', postId });
  };

  // Note functions
  const addNote = (note: Note) => {
    dispatch({ type: 'ADD_NOTE', note });
  };
  
  const updateNote = (note: Note) => {
    dispatch({ type: 'UPDATE_NOTE', note });
  };
  
  const deleteNote = (noteId: string) => {
    dispatch({ type: 'DELETE_NOTE', noteId });
  };

  return (
    <AppContext.Provider value={{
      points: loadedState.points,
      credits: loadedState.credits,
      rooms: loadedState.rooms,
      rewards: loadedState.rewards,
      diaryEntries: loadedState.diaryEntries,
      skincareEntries: loadedState.skincareEntries,
      blogPosts: loadedState.blogPosts,
      notes: loadedState.notes,
      activeHeadgear: loadedState.activeHeadgear,
      ownedHeadgear: loadedState.ownedHeadgear,
      darkMode: loadedState.darkMode,
      dispatch,
      
      // Implemented functions
      addPoints,
      addCredits,
      spendPoints,
      spendCredits,
      addTask,
      updateTask,
      completeTask,
      resetTask,
      deleteTask,
      addDiaryEntry,
      updateDiaryEntry,
      deleteDiaryEntry,
      addReward,
      updateReward,
      redeemReward,
      deleteReward,
      addSkincareEntry,
      updateSkincareEntry,
      deleteSkincareEntry,
      resetAllData,
      equipHeadgear,
      addHeadgear,
      hasHeadgear,
      addRoom,
      updateRoom,
      deleteRoom,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addNote,
      updateNote,
      deleteNote
    }}>
      {children}
    </AppContext.Provider>
  );
}; 
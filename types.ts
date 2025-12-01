export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
  history: string[]; // Array of video IDs
  favorites: string[]; // Array of video IDs
  likes: string[]; // Array of video IDs
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // Using a placeholder for demo
  author: string;
  views: number;
  likes: number;
  uploadDate: string;
  category: string;
  tags: string[];
}

export interface Comment {
  id: string;
  videoId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

// Stats for Admin Dashboard
export interface DailyStats {
  date: string;
  newUsers: number;
  activeUsers: number;
}

export interface CategoryStat {
  name: string;
  count: number;
}

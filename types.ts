
export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  region: string;
  introduction: string;
  interests: string[];
  tags: string[];
  aiSummary: string;
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  region: string;
  date: string;
  time: string;
  category: string;
  maxParticipants: number;
  participants: string[];
}

export interface FriendMatch {
  userId: string;
  compatibilityScore: number;
  matchingReason: string;
  profile: UserProfile;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  FRIENDS = 'FRIENDS',
  ACTIVITIES = 'ACTIVITIES',
  PROFILE = 'PROFILE',
  CHAT = 'CHAT'
}

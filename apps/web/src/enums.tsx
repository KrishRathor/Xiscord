export enum SelectedOptionHome {
  DirectMessage = "DirectMessage",
  FindFriends = "FindFriends",
  Server = "Server"
}

export interface UserType {
  id: number;
  createdAt: string;
  username: string;
  email: string;
  emailVerified: boolean;
  password: string;
  image: string | null;
}

export interface ChatMessageProps {
  message: string;
  isCurrentUser: boolean;
  username: string;
  image?: string;
}

export interface MessageProps {
  id: number;
  createdAt: string;
  content: string;
  fromUsername: string;
  toUsername: string;
}

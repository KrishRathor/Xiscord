export enum SelectedOptionHome {
    DirectMessage = 'DirectMessage',
    FindFriends = 'FindFriends'
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
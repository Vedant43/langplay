export interface User {
    id: number;
    username: string;
    channelName: string;
    email: string;
    profilePicture?: string;
    coverPicture?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }
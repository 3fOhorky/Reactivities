export interface IProfile {
    displayName: string;
    username: string;
    image: string;
    bio: string;
    following: boolean;
    followersCount: number;
    followingCount: number;
    photos: IPhoto[]
}

export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}
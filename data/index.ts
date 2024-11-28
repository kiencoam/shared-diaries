export interface ViewTag {
  _id: string;
  name: string;
}

export interface ViewUser {
  _id: string;
  name: string;
  image: string;
}

export interface ViewPost {
  _id: string;
  content: string;
  creator: ViewUser;
  tags: ViewTag[];
  createdAt: Date;
  likes: string[];
  likeCount: number;
  haveLiked: boolean;
}

export interface CreatePost {
  content: string;
  tags: string[];
}

export interface DocumentPost {
  _id: string;
  content: string;
  creator: ViewUser;
  tags: ViewTag[];
  createdAt: string;
  likes: string[];
  likeCount: number;
}

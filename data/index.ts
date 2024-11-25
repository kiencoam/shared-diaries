export interface ViewUser {
  _id: string;
  name: string;
  image: string;
}

export interface ViewPost {
  _id: string;
  content: string;
  creator: ViewUser;
  tags: string[];
  likes: string[];
  likeCount: number;
  haveLiked: boolean;
}

import Card from "./Card";
import { fetchLikedPosts } from "@utils/server-actions";
import { ViewPost } from "@data";

const LikedFeed = async ({
  userId,
  currentPage,
  sortby,
}: {
  userId: string;
  currentPage: number;
  sortby: string;
}) => {
  const posts: ViewPost[] = await fetchLikedPosts(
    userId,
    currentPage,
    9,
    sortby
  );

  return (
    <div className="prompt_layout">
      {posts.map((post) => (
        <Card key={post._id} post={post} />
      ))}
    </div>
  );
};

export default LikedFeed;

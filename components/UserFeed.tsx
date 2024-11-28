import Card from "./Card";
import { fetchPostsByUserId } from "@utils/server-actions";
import { ViewPost } from "@data";

const UserFeed = async ({
  userId,
  currentPage,
  sortby,
}: {
  userId: string;
  currentPage: number;
  sortby: string;
}) => {
  const posts: ViewPost[] = await fetchPostsByUserId(
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

export default UserFeed;

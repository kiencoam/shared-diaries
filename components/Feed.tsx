import Card from "./Card";
import { fetchAllFilteredPosts } from "@utils/server-actions";
import { ViewPost } from "@data";

const Feed = async ({
  query,
  currentPage,
  sortby,
}: {
  query: string;
  currentPage: number;
  sortby: string;
}) => {
  const posts: ViewPost[] = await fetchAllFilteredPosts(
    query,
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

export default Feed;

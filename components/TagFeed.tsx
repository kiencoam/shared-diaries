import Card from "./Card";
import { fetchPostsByTag } from "@utils/server-actions";
import { ViewPost } from "@data";

const TagFeed = async ({
  tagId,
  currentPage,
  sortby,
}: {
  tagId: string;
  currentPage: number;
  sortby: string;
}) => {
  const posts: ViewPost[] = await fetchPostsByTag(
    tagId,
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

export default TagFeed;

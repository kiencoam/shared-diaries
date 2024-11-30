import Card from "./Card";
import Image from "next/image";
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

  if (posts.length === 0)
    return (
      <div className="my-16 w-full flex-center">
        <Image
          src={"assets/icons/data-not-found.svg"}
          alt="Data Not Found"
          width={150}
          height={150}
        />
      </div>
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

import FeedSkeleton from "@components/FeedSkeleton";
import Pagination from "@components/Pagination";
import Sort from "@components/Sort";
import TagFeed from "@components/TagFeed";
import { fetchTagById, fetchTotalPagesByTag } from "@utils/server-actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const MyDiaryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string; sortby?: string }>;
}) => {
  const tagId = (await params).id;
  const sortby = (await searchParams)?.sortby || "newest";
  const currentPage = Number((await searchParams)?.page) || 1;
  const totalPages = await fetchTotalPagesByTag(tagId, 9);

  const tag = await fetchTagById(tagId);

  if (!tag) return notFound();

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">#{tag.name}</span>
      </h1>
      <p className="desc text-left">
        Những bài viết được gắn tag{" "}
        <span className="blue_gradient">#{tag.name}</span>.
      </p>

      <Sort sortby={sortby} />
      <Suspense
        key={tagId + currentPage + sortby}
        fallback={<FeedSkeleton cards={9} />}
      >
        <TagFeed tagId={tagId} currentPage={currentPage} sortby={sortby} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </section>
  );
};

export default MyDiaryPage;

import Pagination from "@components/Pagination";
import Sort from "@components/Sort";
import LikedFeed from "@components/LikedFeed";
import { fetchTotalPagesLiked } from "@utils/server-actions";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

const MyLikedPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; sortby?: string }>;
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return <div>Unauthorized</div>;

  const sortby = (await searchParams)?.sortby || "newest";
  const currentPage = Number((await searchParams)?.page) || 1;
  const totalPages = await fetchTotalPagesLiked(userId, 9);

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="red_gradient">Bài viết yêu thích của bạn</span>
      </h1>
      <p className="desc text-left">
        Ở đây có những bài viết mà bạn đã nhấn thích.
      </p>

      <Sort sortby={sortby} />
      <Suspense
        key={userId + currentPage + sortby}
        fallback={<div>Loading...</div>}
      >
        <LikedFeed userId={userId} currentPage={currentPage} sortby={sortby} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </section>
  );
};

export default MyLikedPage;

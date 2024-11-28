import Pagination from "@components/Pagination";
import Sort from "@components/Sort";
import UserFeed from "@components/UserFeed";
import { fetchUserById, fetchTotalPagesById } from "@utils/server-actions";
import { Suspense } from "react";

const MyDiaryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string; sortby?: string }>;
}) => {
  const userId = (await params).id;
  const sortby = (await searchParams)?.sortby || "newest";
  const currentPage = Number((await searchParams)?.page) || 1;
  const totalPages = await fetchTotalPagesById(userId, 9);

  const user = await fetchUserById(userId);

  if (!user) return <div>User not found!</div>;

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{user.name}'s Diary</span>
      </h1>
      <p className="desc text-left">
        Chào mừng tới trang nhật ký của {user.name}
      </p>

      <Sort sortby={sortby} />
      <Suspense
        key={userId + currentPage + sortby}
        fallback={<div>Loading...</div>}
      >
        <UserFeed userId={userId} currentPage={currentPage} sortby={sortby} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </section>
  );
};

export default MyDiaryPage;

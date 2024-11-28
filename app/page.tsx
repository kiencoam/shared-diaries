import Pagination from "@components/Pagination";
import Search from "@components/Search";
import Feed from "@components/Feed";
import { Suspense } from "react";
import { fetchTotalPages } from "@utils/server-actions";
import Sort from "@components/Sort";

const HomePage = async (props: {
  searchParams?: Promise<{ query?: string; page?: string; sortby?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const sortby = searchParams?.sortby || "newest";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTotalPages(query, 9);

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Hãy chia sẻ
        <br className="max-md:hidden" />
        <span className="pink_green_blue_gradient text-center">
          Câu chuyện của bạn
        </span>
      </h1>
      <p className="desc text-center">
        Khám phá một không gian nơi bạn có thể chia sẻ những câu chuyện của mình
        một cách riêng tư. Shared Diaries nhiều hơn là một trang nhật ký, đó là
        nơi giúp bạn kết nối với câu chuyện của những người xung quanh.
      </p>

      <section className="feed">
        <Search />
        <Sort sortby={sortby} />
        <Suspense
          key={query + currentPage + sortby}
          fallback={<div>Loading...</div>}
        >
          <Feed query={query} currentPage={currentPage} sortby={sortby} />
        </Suspense>
        <Pagination totalPages={totalPages} />
      </section>
    </section>
  );
};

export default HomePage;

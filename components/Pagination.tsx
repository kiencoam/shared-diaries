"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { replace } = useRouter();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const PageArray = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 4); i++) {
      pages.push(i.toString());
    }

    if (totalPages > 4) {
      pages.pop();
      pages.push("...");
      pages.push(totalPages.toString());
    }

    return pages;
  }, [totalPages]);

  if (totalPages <= 1) return <div></div>;

  return (
    <>
      {/* Desktop Pagination */}
      <div className="hidden sm:flex max-w-full my-16 h-12 rounded-md border-2 border-gray-200 bg-white font-satoshi text-sm shadow-lg font-medium focus:border-black focus:outline-none focus:ring-0">
        <button
          disabled={currentPage === 1}
          onClick={() => replace(createPageURL(currentPage - 1))}
          className="h-full w-28 border-r border-gray-200 rounded-l-md hover:bg-slate-50 hover:shadow-lg"
        >
          Trang trước
        </button>
        {PageArray.map((page) => (
          <button
            key={page}
            disabled={page === "..."}
            onClick={() => replace(createPageURL(Number(page)))}
            className={`h-full w-12 flex-center border-x border-gray-200 ${
              page === currentPage.toString()
                ? "bg-slate-100"
                : "hover:bg-slate-50 hover:shadow-lg"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => replace(createPageURL(currentPage + 1))}
          className="h-full w-28 border-l border-gray-200 rounded-r-md hover:bg-slate-50 hover:shadow-lg"
        >
          Trang sau
        </button>
      </div>

      {/* Mobile Pagination */}
      <div className="sm:hidden flex max-w-full my-16 h-12 rounded-md border-2 border-gray-200 bg-white font-satoshi text-sm shadow-lg font-medium focus:border-black focus:outline-none focus:ring-0">
        <button
          disabled={currentPage === 1}
          onClick={() => replace(createPageURL(currentPage - 1))}
          className="h-full w-28 border-r border-gray-200 rounded-l-md hover:bg-slate-50 hover:shadow-lg"
        >
          Trang trước
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => replace(createPageURL(currentPage + 1))}
          className="h-full w-28 border-l border-gray-200 rounded-r-md hover:bg-slate-50 hover:shadow-lg"
        >
          Trang sau
        </button>
      </div>
    </>
  );
};

export default Pagination;

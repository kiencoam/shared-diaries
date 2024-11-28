"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <form className="relative w-full flex-center">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        required
        className="search_input peer"
      />
    </form>
  );
};

export default Search;

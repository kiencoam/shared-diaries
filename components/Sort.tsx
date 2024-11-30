"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Sort = ({ sortby }: { sortby: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const createSortURL = (sortby: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortby", sortby);
    return `${pathname}?${params.toString()}`;
  };

  const sortToggleRef = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortToggleRef.current &&
        !sortToggleRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SortOptions = [
    { name: "Mới nhất", value: "newest" },
    { name: "Yêu thích nhất", value: "likest" },
  ];

  return (
    <div className="mt-16 w-full flex-end ">
      <div ref={sortToggleRef} className="relative">
        <button
          onClick={() => setToggle((prev) => !prev)}
          className="flex-center gap-1 p-2.5"
        >
          <div className="text-[#4b5563]">Sắp xếp</div>
          <Image
            src="/assets/icons/arrow-down.svg"
            alt="arrow-down"
            width={20}
            height={20}
          />
        </button>
        {toggle && (
          <div className="dropdown py-3 shadow-sm">
            {SortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setToggle(false);
                  replace(createSortURL(option.value));
                }}
                className="dropdown_link h-10"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sort;

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
} from "next-auth/react";
import { ViewUser } from "@data";
import AvatarNavSkeleton from "./AvatarNavSkeleton";

const AvatarNav = () => {
  const { data: session, status } = useSession();

  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [user, setUser] = useState<ViewUser>({
    _id: "",
    name: "",
    image: "/assets/images/avatar-1.jpg",
  });
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const desktopToggleRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopToggleRef.current &&
        !desktopToggleRef.current.contains(event.target as Node) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(event.target as Node)
      ) {
        setToggleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    (async () => {
      const response = await getProviders();
      setProviders(response);
    })();

    if (session) {
      (async () => {
        const res = await fetch(`/api/users/${session.user.id}`);
        const data: ViewUser = await res.json();
        setUser(data);
      })();
    }
  }, [status, session]);

  if (status === "loading") return <AvatarNavSkeleton />;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden sm:flex relative">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-post" className="outline_btn">
              Tạo bài viết
            </Link>

            <div ref={desktopToggleRef} className="flex">
              <Image
                src={user.image}
                width={37}
                height={37}
                className="rounded-full cursor-pointer"
                alt="Profile"
                onClick={() => setToggleDropdown((prev) => !prev)}
              />

              {toggleDropdown && (
                <div className="dropdown py-5">
                  <Link
                    href={`/diary/${session.user.id}`}
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Diary
                  </Link>
                  <Link
                    href="/liked"
                    className=" mt-3 dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Yêu thích
                  </Link>
                  <Link
                    href="/account"
                    className=" mt-3 dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Tài khoản
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setToggleDropdown(false);
                      signOut();
                    }}
                    className="mt-5 w-full black_btn"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  <Image
                    src="/assets/icons/google.svg"
                    alt="Google icon"
                    width={20}
                    height={20}
                  />
                  <span className="ml-2">Đăng nhập với Google</span>
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div ref={mobileToggleRef} className="flex">
            <Image
              src={user.image}
              width={37}
              height={37}
              className="rounded-full cursor-pointer"
              alt="Profile"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />

            {toggleDropdown && (
              <div className="dropdown py-5">
                <Link
                  href={`/diary/${session.user.id}`}
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Diary
                </Link>
                <Link
                  href="/create-post"
                  className=" mt-2 dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Tạo bài viết
                </Link>
                <Link
                  href="/liked"
                  className=" mt-2 dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Yêu thích
                </Link>
                <Link
                  href="/account"
                  className=" mt-2 dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Tài khoản
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  <Image
                    src="/assets/icons/google.svg"
                    alt="Google icon"
                    width={20}
                    height={20}
                  />
                  <span className="ml-2">Đăng nhập với Google</span>
                </button>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default AvatarNav;

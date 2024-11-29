"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ViewUser } from "@data";
import AccountSkeleton from "@components/AccountSkeleton";

const AccountPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<ViewUser>({
    _id: "",
    name: "",
    image: "/assets/images/avatar-1.jpg",
  });
  const [toggle, setToggle] = useState<boolean>(false);
  const [avatarUrlList, setAvatarUrlList] = useState<string[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.id}`);
          const data: ViewUser = await res.json();
          setUser(data);
          setAvatarUrlList([
            session.user?.image ?? "/assets/images/avatar-1.jpg",
            "/assets/images/avatar-2.jpg",
            "/assets/images/avatar-3.jpg",
            "/assets/images/avatar-4.jpg",
            "/assets/images/avatar-5.jpg",
            "/assets/images/avatar-6.jpg",
            "/assets/images/avatar-7.jpg",
            "/assets/images/avatar-8.jpg",
            "/assets/images/avatar-9.jpg",
            "/assets/images/avatar-10.jpg",
          ]);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUser();
    }
  }, [status, session, router]);

  if (status === "loading") return <AccountSkeleton />;

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: user.name, image: user.image }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
    }
  };

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="orange_gradient">Cài đặt tài khoản</span>
      </h1>
      <p className="desc text-left">
        Thay đổi hình đại diện và nickname tùy theo sở thích của bạn
      </p>

      <div className="mt-16 flex-1 break-inside-avoid rounded-lg border border-gray-300 bg-white/20 bg-clip-padding p-6 pb-4 backdrop-blur-lg backdrop-filter md:w-[460px] w-full h-fit">
        <div className="relative w-full flex items-center justify-start gap-6">
          <Image
            src={user.image}
            alt="user_image"
            width={60}
            height={60}
            className="rounded-full object-contain shadow-sm"
          />
          <button
            onClick={() => setToggle((prev) => !prev)}
            className="outline_btn"
          >
            Thay đổi
          </button>

          {toggle && (
            <div className="dropdown flex flex-wrap p-3 gap-3 gap-y-3">
              {avatarUrlList.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt="user_image"
                  width={60}
                  height={60}
                  className="rounded-full object-contain cursor-pointer hover:shadow-lg"
                  onClick={() => {
                    setUser({ ...user, image: url });
                    setToggle(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 flex items-center gap-3">
          <span className="font-satoshi text-base text-gray-700">
            Nickname:{" "}
          </span>
          <div className="w-full flex-center gap-2 mt-2">
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Nickname của bạn..."
              className="w-full rounded-lg p-3 text-sm text-gray-500 outline-0"
            />
          </div>
        </div>

        <div className="flex-end mx-3 mb-5 mt-10">
          <button
            onClick={handleSave}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountPage;

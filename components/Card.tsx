"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { ViewPost } from "@data";
import { usePathname } from "next/navigation";
import { useState, useEffect, use } from "react";
import { calculateTimeAgo } from "@utils/time-utils";

const Card = ({ post }: { post: ViewPost }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [deleted, setDeleted] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [liked, setLiked] = useState<boolean>(post.haveLiked);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);

  useEffect(() => {
    setTimeAgo(calculateTimeAgo(post.createdAt));
  }, [post]);

  const handleLike = async () => {
    try {
      if (!session?.user?.id) {
        alert("Hãy đăng nhập để thích bài viết này!");
        return;
      }

      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "PATCH",
        body: JSON.stringify({
          userId: session?.user?.id,
          like: !liked,
        }),
      });

      if (response.ok) {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        setLiked(!liked);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const hasConfirmed = confirm(
      "Bạn có chắc chắn muốn xóa bài viết này không?"
    );
    if (!hasConfirmed) return;

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");
      setDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div key={post._id} className="prompt_card">
      {deleted ? (
        <div className="w-full orange_gradient flex-center">Đã xóa</div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-5">
            <Link
              href={`/diary/${post.creator._id}`}
              className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
            >
              <Image
                src={post.creator.image}
                alt="user_image"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />

              <div className="flex flex-col">
                <h3 className="font-satoshi font-semibold text-gray-900">
                  {post.creator.name}
                </h3>
                <p className="font-inter text-sm text-gray-500">{timeAgo}</p>
              </div>
            </Link>

            <div className="flex-center gap-1">
              <div className="font-satoshi">{likeCount}</div>
              <div onClick={handleLike} className="like_btn">
                <Image
                  src={
                    liked
                      ? "/assets/icons/unlike.svg"
                      : "/assets/icons/like.svg"
                  }
                  alt="Heart"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="max-h-[700px] overflow-hidden my-4 font-satoshi text-sm text-gray-700">
            {post.content}
          </div>
          <div className="flex-start gap-3 flex-wrap">
            {post.tags.map((tag) => (
              <div
                key={tag._id}
                onClick={() => {}}
                className="font-inter text-sm blue_gradient cursor-pointer"
              >
                #{tag.name}
              </div>
            ))}
          </div>

          {session?.user?.id === post.creator._id &&
            pathname.startsWith("/diary") && (
              <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
                <Link
                  href={`/edit-post?id=${post._id}`}
                  className="font-inter text-sm green_gradient cursor-pointer"
                >
                  Edit
                </Link>
                <p
                  className="font-inter text-sm orange_gradient cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Card;

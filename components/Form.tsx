"use client";

import TagInput from "./TagInput";

import { Dispatch, SetStateAction, MouseEventHandler } from "react";
import { CreatePost } from "@data";
import { useRouter } from "next/navigation";

const Form = ({
  type,
  post,
  setPost,
  submitting,
  handleSubmit,
}: {
  type: string;
  post: CreatePost;
  setPost: Dispatch<SetStateAction<CreatePost>>;
  submitting: boolean;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
}) => {
  const router = useRouter();

  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} bài viết</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} và chia sẻ những câu chuyện, trải nghiệm và suy ngẫm của bạn tới
        những người xung quanh.
      </p>

      <div className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Nội dung
          </span>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Viết câu chuyện của bạn ở đây..."
            required
            className="form_textarea"
          />
        </label>
        <TagInput post={post} setPost={setPost} />

        <div className="flex-end mx-3 mb-5 gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `Đang ${type}...` : type}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Form;

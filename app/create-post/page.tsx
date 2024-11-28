"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

import { CreatePost } from "@data";
import { MouseEventHandler } from "react";

const CreateNewPost = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<CreatePost>({
    content: "",
    tags: [],
  });

  const createPost: MouseEventHandler<HTMLButtonElement> = async (e) => {
    setSubmitting(true);

    try {
      const reponse = await fetch("api/posts/new", {
        method: "POST",
        body: JSON.stringify({
          content: post.content,
          tags: post.tags,
          creatorId: session?.user?.id,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      router.replace(`/diary/${session?.user.id}`);
    }
  };

  return (
    <Form
      type="Tạo"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPost}
    />
  );
};

export default CreateNewPost;

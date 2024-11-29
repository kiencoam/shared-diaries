"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

import { CreatePost } from "@data";
import { MouseEventHandler } from "react";
import FormSkeleton from "@components/FormSkeleton";

const CreateNewPost = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<CreatePost>({
    content: "",
    tags: [],
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [status, session, router]);

  const createPost: MouseEventHandler<HTMLButtonElement> = async (e) => {
    setSubmitting(true);

    try {
      await fetch("api/posts/new", {
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

  if (status === "loading") return <FormSkeleton />;

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

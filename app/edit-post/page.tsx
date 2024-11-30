"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Form from "@components/Form";

import { CreatePost, DocumentPost } from "@data";
import { Suspense } from "react";
import FormSkeleton from "@components/FormSkeleton";

const EditPostContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<CreatePost>({
    content: "",
    tags: [],
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      const fetchDetailedPost = async () => {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          router.replace(`/diary/${session.user.id}`);
          return;
        }
        const data: DocumentPost = await response.json();
        if (session.user?.id !== data.creator._id) router.push("/");
        setPost({
          content: data.content,
          tags: data.tags.map((tag) => tag.name),
        });
      };

      fetchDetailedPost();
    }
  }, [postId, status, session, router]);

  const editPrompt = async (tagInput: string) => {
    setSubmitting(true);

    if (tagInput) post.tags.push(tagInput);
    try {
      const reponse = await fetch(`api/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: post.content,
          tags: post.tags,
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
      type="Chỉnh sửa"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={editPrompt}
    />
  );
};

export default function EditPost() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditPostContent />
    </Suspense>
  );
}

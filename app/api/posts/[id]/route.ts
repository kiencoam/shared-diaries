import { connectToDB } from "@utils/database";
import Post from "@models/post";
import Tag from "@models/tag";
import { createNewTagIfNotExists } from "@utils/server-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@auth";

import { DocumentPost, ViewPost } from "@data";

interface RequestBody {
  content: string;
  tags: string[];
}

// GET /api/posts/[id]
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const postId = (await params).id;

  try {
    await connectToDB();

    const documentPost = await Post.findById(postId).populate([
      "creator",
      "tags",
    ]);
    if (!documentPost) return new Response("Post not found", { status: 404 });

    return new Response(JSON.stringify(documentPost), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

// PATCH /api/posts/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return new Response("Unauthorized", { status: 401 });

  const postId = (await params).id;
  const { content, tags }: RequestBody = await req.json();

  try {
    await connectToDB();

    const post = await Post.findById(postId);
    if (!post) return new Response("Post not found", { status: 404 });

    if (post.creator.toString() !== user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    post.content = content;

    for (const tag of tags) {
      await createNewTagIfNotExists(tag);
    }

    const tagIds = await Promise.all(
      tags.map(async (tag) => {
        const documentTag = await Tag.findOne({ name: tag });
        return documentTag ? documentTag._id : null;
      })
    );

    post.tags = tagIds;

    await post.save();

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

// DELETE /api/posts/[id]
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return new Response("Unauthorized", { status: 401 });

  const postId = (await params).id;

  try {
    await connectToDB();

    const post = await Post.findByIdAndDelete(postId);
    if (!post) return new Response("Post not found", { status: 404 });

    if (post.creator.toString() !== user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

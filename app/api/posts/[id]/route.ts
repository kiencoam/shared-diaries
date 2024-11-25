import { connectToDB } from "@utils/database";
import Post from "@models/post";
import { createNewTagIfNotExists } from "@utils/server-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

interface RequestBody {
  content: string;
  tags: string[];
}

// GET /api/posts/[id]
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const postId = (await params).id;

  try {
    await connectToDB();

    const post = await Post.findById(postId).populate("creator");
    if (!post) return new Response("Post not found", { status: 404 });

    post.haveLiked = post.likes.includes(user?.id);
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
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
    post.tags = tags;

    await post.save();

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
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
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

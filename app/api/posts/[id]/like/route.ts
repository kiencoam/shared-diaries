import { connectToDB } from "@utils/database";
import Post from "@models/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

interface RequestBody {
  userId: string;
  like: boolean;
}

// PATCH /api/posts/[id]/like
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const postId = (await params).id;
  const { userId, like }: RequestBody = await req.json();

  if (userId !== user?.id) return new Response("Unauthorized", { status: 401 });

  try {
    await connectToDB();

    const post = await Post.findById(postId);
    if (!post) return new Response("Post not found", { status: 404 });

    if (like) {
      post.likes.push(userId);
      post.likeCount++;
    } else {
      post.likes = post.likes.filter((id: string) => id !== userId);
      post.likeCount--;
    }

    await post.save();
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
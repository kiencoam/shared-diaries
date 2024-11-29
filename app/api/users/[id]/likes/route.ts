import { connectToDB } from "@utils/database";
import Post from "@models/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@auth";

// GET /api/users/[id]/likes
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userId = (await params).id;

  try {
    await connectToDB();

    const documentPosts = await Post.find({ likes: userId }).populate([
      "creator",
      "tags",
    ]);

    const viewPosts = documentPosts.map((post) => ({
      ...post.toObject(),
      haveLiked: post.likes.includes(user?.id),
    }));

    return new Response(JSON.stringify(viewPosts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

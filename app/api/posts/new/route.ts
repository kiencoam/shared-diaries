import { connectToDB } from "@utils/database";
import Post from "@models/post";
import { createNewTagIfNotExists } from "@utils/server-actions";

interface RequestBody {
  content: string;
  tags: string[];
  creatorId: string;
}

// POST /api/posts/new
export const POST = async (req: Request) => {
  const { content, tags, creatorId }: RequestBody = await req.json();

  try {
    await connectToDB();

    for (const tag of tags) {
      await createNewTagIfNotExists(tag);
    }

    const newPost = new Post({
      content: content,
      tags: tags,
      creator: creatorId,
      likes: [],
      likeCount: 0,
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

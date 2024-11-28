import { connectToDB } from "@utils/database";
import Post from "@models/post";
import Tag from "@models/tag";
import { createNewTagIfNotExists } from "@utils/server-actions";

interface RequestBody {
  content: string;
  tags: string[];
  creatorId: string;
  createdAt: string;
}

// POST /api/posts/new
export const POST = async (req: Request) => {
  const reqBody: RequestBody = await req.json();

  try {
    await connectToDB();

    for (const tag of reqBody.tags) {
      await createNewTagIfNotExists(tag);
    }

    const tagIds = await Promise.all(
      reqBody.tags.map(async (tag) => {
        const documentTag = await Tag.findOne({ name: tag });
        return documentTag ? documentTag._id : null;
      })
    );

    const newPost = new Post({
      content: reqBody.content,
      tags: tagIds,
      creator: reqBody.creatorId,
      likes: [],
      likeCount: 0,
      createdAt: new Date(reqBody.createdAt),
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

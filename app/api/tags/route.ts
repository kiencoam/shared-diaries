import { connectToDB } from "@utils/database";
import Tag from "@models/tag";

// GET /api/tags
export const GET = async () => {
  try {
    await connectToDB();

    const documentTags = await Tag.find();
    const tags = documentTags.map((tag) => tag.name);

    return new Response(JSON.stringify(tags), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

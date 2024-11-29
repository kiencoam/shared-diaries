import { connectToDB } from "@utils/database";
import User from "@models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@auth";

// GET /api/users/[id]
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const userId = (await params).id;

  try {
    await connectToDB();

    const documentUser = await User.findById(userId);
    if (!documentUser) return new Response("User not found", { status: 404 });

    const viewUser = documentUser.toObject();
    delete viewUser.email;

    return new Response(JSON.stringify(viewUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

// PATCH /api/users/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userId = (await params).id;
  const { name, image }: { name: string; image: string } = await req.json();

  if (userId !== user?.id) return new Response("Unauthorized", { status: 401 });

  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) return new Response("User not found", { status: 404 });

    user.name = name;
    user.image = image;

    await user.save();
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

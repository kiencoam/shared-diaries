"use server";

import Tag from "@models/tag";
import Post from "@models/post";
import User from "@models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectToDB } from "@utils/database";
import { DocumentPost, ViewPost, ViewUser } from "@data";

export const createNewTagIfNotExists = async (tagName: string) => {
  const tagExists = await Tag.findOne({ name: tagName });

  if (!tagExists) {
    await Tag.create({ name: tagName });
  }
};

export const fetchUserById = async (
  userId: string
): Promise<ViewUser | null> => {
  try {
    await connectToDB();

    const documentUser = await User.findById(userId);
    if (!documentUser) return null;

    const user: ViewUser = JSON.parse(JSON.stringify(documentUser));
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch all posts from the database
export const fetchAllFilteredPosts = async (
  query: string,
  currentPage: number,
  perPage: number,
  sortBy: string
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    await connectToDB();

    let sortOption: { [key: string]: 1 | -1 } = { createdAt: -1 };
    if (sortBy === "likest") {
      sortOption = { likeCount: -1 };
    }

    const documentPosts = await Post.find({
      content: { $regex: query, $options: "i" },
    })
      .skip(perPage * (currentPage - 1))
      .limit(perPage)
      .populate(["creator", "tags"])
      .sort(sortOption);

    const posts: DocumentPost[] = JSON.parse(JSON.stringify(documentPosts));

    const viewPosts: ViewPost[] = posts.map((post: DocumentPost) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      haveLiked: post.likes.includes(user?.id || ""),
    }));

    return viewPosts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchTotalPages = async (query: string, perPage: number) => {
  try {
    await connectToDB();

    const totalPosts = await Post.countDocuments({
      content: { $regex: query, $options: "i" },
    });

    return Math.ceil(totalPosts / perPage);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// Fetch all posts for personal diary
export const fetchPostsByUserId = async (
  userId: string,
  currentPage: number,
  perPage: number,
  sortBy: string
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    await connectToDB();

    let sortOption: { [key: string]: 1 | -1 } = { createdAt: -1 };
    if (sortBy === "likest") {
      sortOption = { likeCount: -1 };
    }

    const documentPosts = await Post.find({
      creator: userId,
    })
      .skip(perPage * (currentPage - 1))
      .limit(perPage)
      .populate(["creator", "tags"])
      .sort(sortOption);

    const posts: DocumentPost[] = JSON.parse(JSON.stringify(documentPosts));

    const viewPosts: ViewPost[] = posts.map((post: DocumentPost) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      haveLiked: post.likes.includes(user?.id || ""),
    }));

    return viewPosts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchTotalPagesById = async (userId: string, perPage: number) => {
  try {
    await connectToDB();

    const totalPosts = await Post.countDocuments({
      creator: userId,
    });

    return Math.ceil(totalPosts / perPage);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// Fetch all posts user have liked
export const fetchLikedPosts = async (
  userId: string,
  currentPage: number,
  perPage: number,
  sortBy: string
) => {
  try {
    await connectToDB();

    const documentPosts = await Post.find({
      likes: userId,
    })
      .skip(perPage * (currentPage - 1))
      .limit(perPage)
      .populate(["creator", "tags"])
      .sort({ createdAt: -1 });

    const posts: DocumentPost[] = JSON.parse(JSON.stringify(documentPosts));

    const viewPosts: ViewPost[] = posts.map((post: DocumentPost) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      haveLiked: true,
    }));

    return viewPosts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchTotalPagesLiked = async (userId: string, perPage: number) => {
  try {
    await connectToDB();

    const totalPosts = await Post.countDocuments({
      likes: userId,
    });

    return Math.ceil(totalPosts / perPage);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

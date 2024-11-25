"use server";

import Tag from "@models/tag";

export const createNewTagIfNotExists = async (tag: string) => {
  if (await Tag.findById(tag)) return;
  const newTag = new Tag({ _id: tag });
  await newTag.save();
};

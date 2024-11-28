"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { CreatePost } from "@data";
import { Dispatch, SetStateAction } from "react";

const TagInput = ({
  post,
  setPost,
}: {
  post: CreatePost;
  setPost: Dispatch<SetStateAction<CreatePost>>;
}) => {
  const [input, setInput] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const reponse = await fetch("/api/tags");
      const data = await reponse.json();
      setAllTags(data);
    };
    fetchTags();
  }, []);

  const removeTag = (tag: string) => {
    setPost((prevPost) => ({
      ...prevPost,
      tags: prevPost.tags.filter((t) => t !== tag),
    }));
  };

  const addTag = (tag: string) => {
    setPost((prevPost) => ({ ...prevPost, tags: [...prevPost.tags, tag] }));
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      addTag(input);
    }
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const regex = new RegExp(term, "i");
    const newSuggestions = allTags.filter((tag) => regex.test(tag));
    setSuggestions(newSuggestions);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(" ", "").toLowerCase();
    setInput(value);
    handleSearch(value);
  };

  return (
    <div>
      <span className="font-satoshi font-semibold text-base text-gray-700">
        Tag{" "}
        {/* <span className="font-normal">
          (#product, #webdevelopment, #idea, etc.)
        </span> */}
      </span>
      <div className="w-full flex-center gap-2 mt-2">
        {post.tags.map((tag, index) => (
          <div
            key={index}
            className="h-10 flex-center gap-1 p-1 font-inter text-sm blue_gradient"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="bg-slate-100 rounded-md h-4 w-4 flex-center text-gray-500 hover:bg-slate-200"
            >
              x
            </button>
          </div>
        ))}
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Hashtag cho bài viết của bạn..."
            className="w-full rounded-lg p-3 text-sm text-gray-500 outline-0"
          />
          {input && suggestions.length > 0 && (
            <div className="dropdown max-h-20 overflow-auto">
              {suggestions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="h-10 dropdown_link"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagInput;

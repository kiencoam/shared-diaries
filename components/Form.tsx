"use client";

import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { CreatePost } from "@data";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Form = ({
  type,
  post,
  setPost,
  submitting,
  handleSubmit,
}: {
  type: string;
  post: CreatePost;
  setPost: Dispatch<SetStateAction<CreatePost>>;
  submitting: boolean;
  handleSubmit: (tagInput: string) => Promise<void>;
}) => {
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (e.key === " " && input) {
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
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} bài viết</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} và chia sẻ những câu chuyện, trải nghiệm và suy ngẫm của bạn tới
        những người xung quanh.
      </p>

      <div className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Nội dung
          </span>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Viết câu chuyện của bạn ở đây..."
            required
            className="form_textarea"
          />
        </label>

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
                <span className="text-nowrap">#{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="bg-slate-100 rounded-md h-4 w-4 flex-center text-gray-500 hover:bg-slate-200"
                >
                  x
                </button>
              </div>
            ))}
            <div ref={suggestionsRef} className="relative w-full">
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

        <div className="flex-end mx-3 mb-5 gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => {
              handleSubmit(input);
            }}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `Đang ${type}...` : type}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Form;

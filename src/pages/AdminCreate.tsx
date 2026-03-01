import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ImagePlus, Upload, Check } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { CATEGORIES } from "@/components/CategoryTabs";
import { useApp } from "@/context/AppContext";
import { createArticle } from "@/lib/api";
import type { NewsItem } from "@/components/NewsCard";
import aiImg from "@/assets/news-ai.jpg";

const EDITOR_CATEGORIES = CATEGORIES.filter((c) => c !== "Top News");

export default function AdminCreate() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(EDITOR_CATEGORIES[0]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: "<p>Start writing your article here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[240px] outline-none px-4 py-3 text-foreground",
      },
    },
  });

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setCoverPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setCoverPreview(URL.createObjectURL(file));
    }
  }, []);

  const handlePublish = async () => {
    if (!title.trim() || isPublishing) return;
    setIsPublishing(true);

    try {
      await createArticle({
        title: title.trim(),
        description: editor?.getText().slice(0, 160) ?? "",
        category,
        image: coverPreview ?? aiImg,
        imageAlt: title.trim(),
        content: editor?.getHTML() ?? "",
      });

      setPublished(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error("Failed to publish", err);
      alert("Failed to publish post.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[60vh]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-6"
        >
          <Check size={36} className="text-emerald-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Published!</h2>
        <p className="text-muted-foreground text-sm">Redirecting to posts...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl"
    >
      <h1 className="text-2xl font-bold text-foreground mb-8" style={{ fontFamily: "Georgia, serif" }}>
        Create New Post
      </h1>

      <div className="space-y-6">
        {/* Headline */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Headline
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your headline..."
            rows={2}
            className="w-full text-2xl font-bold text-foreground bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40"
            style={{ fontFamily: "Georgia, serif" }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass border border-white/20 dark:border-white/10 text-foreground text-sm outline-none appearance-none cursor-pointer bg-transparent"
            >
              {EDITOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Cover Photo
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
            className="glass rounded-2xl border-2 border-dashed border-white/20 dark:border-white/10 p-8 text-center cursor-pointer hover:border-primary/40 transition-colors relative overflow-hidden"
          >
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={() => setCoverPreview(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/70 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImagePlus size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drag & drop your cover image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Rich text editor */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Content
          </label>
          <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-white/10">
            {/* Toolbar */}
            {editor && (
              <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 dark:border-white/5 flex-wrap">
                <ToolbarBtn
                  active={editor.isActive("bold")}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  label="B"
                  className="font-bold"
                />
                <ToolbarBtn
                  active={editor.isActive("italic")}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  label="I"
                  className="italic"
                />
                <div className="w-px h-5 bg-white/15 mx-1" />
                <ToolbarBtn
                  active={editor.isActive("heading", { level: 2 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  label="H2"
                />
                <ToolbarBtn
                  active={editor.isActive("heading", { level: 3 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  label="H3"
                />
                <div className="w-px h-5 bg-white/15 mx-1" />
                <ToolbarBtn
                  active={editor.isActive("bulletList")}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  label="• List"
                />
                <ToolbarBtn
                  active={editor.isActive("orderedList")}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  label="1. List"
                />
                <div className="w-px h-5 bg-white/15 mx-1" />
                <ToolbarBtn
                  active={editor.isActive("link")}
                  onClick={() => {
                    const url = window.prompt("Enter URL:");
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  label="Link"
                />
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Publish */}
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePublish}
            disabled={!title.trim() || isPublishing}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPublishing ? "Publishing..." : (
              <>
                <Upload size={16} />
                Publish Now
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ToolbarBtn({
  active,
  onClick,
  label,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${active
        ? "bg-primary/15 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-white/15 dark:hover:bg-white/5"
        } ${className}`}
    >
      {label}
    </button>
  );
}

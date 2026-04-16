"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, 
  Link as LinkIcon, Image as ImageIcon,
  AlignCenter, AlignLeft, AlignRight,
  Undo, Redo, Eraser, Link2Off
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { MediaPickerModal } from "../media/MediaPickerModal";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 md:p-2 border-b border-sage/10 bg-white/50 backdrop-blur-md sticky top-0 z-10 w-full overflow-hidden">
      <div className="flex items-center gap-0.5 md:gap-1 pr-1 md:pr-2 border-r border-sage/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-sage/10 text-sage")}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-sage/10 text-sage")}
        >
          <Italic size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("underline") && "bg-sage/10 text-sage")}
        >
          <UnderlineIcon size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-sage/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) && "bg-sage/10 text-sage")}
        >
          <Heading1 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-sage/10 text-sage")}
        >
          <Heading2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 3 }) && "bg-sage/10 text-sage")}
        >
          <Heading3 size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-sage/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: "left" }) && "bg-sage/10 text-sage")}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: "center" }) && "bg-sage/10 text-sage")}
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: "right" }) && "bg-sage/10 text-sage")}
        >
          <AlignRight size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-sage/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-sage/10 text-sage")}
        >
          <List size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-sage/10 text-sage")}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-sage/10 text-sage")}
        >
          <Quote size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-sage/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-sage/10 text-sage")}
        >
          <LinkIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="h-8 w-8 p-0"
        >
          <Link2Off size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMediaPicker(true)}
          className="h-8 w-8 p-0"
        >
          <ImageIcon size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 pl-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="h-8 w-8 p-0"
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="h-8 w-8 p-0"
        >
          <Redo size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="h-8 w-8 p-0"
        >
          <Eraser size={16} />
        </Button>
      </div>

      <MediaPickerModal 
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={(url) => addImage(url)}
        title="Insert Story Visual"
      />
    </div>
  );
};

export const TiptapEditor = ({ 
  content, 
  onChange, 
  placeholder = "Once upon a time in the digital ether...",
  minHeight = "300px" 
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-sage underline font-bold hover:text-sage/80 transition-colors cursor-pointer"
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-[2rem] border border-sage/10 shadow-2xl my-8 max-h-[600px] object-cover"
        }
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm md:prose-base lg:prose-lg prose-sage max-w-none focus:outline-none",
          "prose-h1:font-serif prose-h1:text-4xl prose-h1:text-heading prose-h1:mb-8",
          "prose-h2:font-serif prose-h2:text-2xl prose-h2:text-heading prose-h2:mt-12 prose-h2:mb-4",
          "prose-h3:font-serif prose-h3:text-xl prose-h3:text-heading prose-h3:mt-8 prose-h3:mb-4",
          "prose-p:text-base prose-p:leading-relaxed prose-p:text-muted-foreground",
          "prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:font-serif",
          "prose-img:mx-auto"
        ),
      },
    },
  });

  // Keep editor content in sync with prop changes (for Magic Sync/Auto-translate)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-sage/20 rounded-[2.5rem] bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm transition-all focus-within:border-sage/40 focus-within:shadow-md">
      <Toolbar editor={editor} />
      <div 
        className="p-6 md:p-10 overflow-y-auto" 
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

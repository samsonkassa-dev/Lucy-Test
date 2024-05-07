import { Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  LinkIcon,
} from "lucide-react";
import { Toggle } from "./Toggle";

function ToolBar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex border-input bg-transparent rounded-br">
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-5 w-5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleMark("bold").run()}
      >
        <Bold className="h-5 w-5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={() => {
          const url = window.prompt("Enter the URL");
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      >
        <LinkIcon className="h-5 w-5" />{" "}
   
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleMark("italic").run()}
      >
        <Italic className="h-5 w-5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleMark("strike").run()}
      >
        <Strikethrough className="h-5 w-5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletlist")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-5 w-5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-5 w-5" />
      </Toggle>
    </div>
  );
}

export default ToolBar;

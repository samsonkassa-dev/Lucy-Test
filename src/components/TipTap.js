import { useEditor,EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import  ToolBar  from "./ToolBar.jsx";
import Heading from "@tiptap/extension-heading" 
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList  from "@tiptap/extension-ordered-list";




const TipTap = ({ description, onChange, onEditorReady }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading,
      BulletList,
      OrderedList,
      Link,
      Heading.configure({
        HTMLAttributes: {
          style: "text-align: center;",
        },
        heading: {
          options: {
            level: 2,
            placeholder: "Word",
          },
        },
      }),
    ],

    content: description,
    editorProps: {
      attributes: {
        class: "rounded-md border min-h-[200px] border-input px-5 py-5 bg-white",
        autofocus: true,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      console.log(html);
      onEditorReady(editor);
    },
  });

  return (
    <div className="flex flex-col justify-strech ">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};



  export default TipTap
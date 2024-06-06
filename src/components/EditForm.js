import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { storage } from '../helper/firebase.js'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import TipTap from '../components/TipTap.js';
import { useRef } from 'react';
import axios from 'axios'
import Image from 'next/image'
import { useUpdateForm } from '../hooks/useUpdateBlogs.jsx'
import LoadingSpinner from '../components/Spinner';



const schema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  author: z.string().nonempty({ message: "Author is required" }),
  priority: z.string().nonempty({ message: "priority is required" }),
  image: z.any(),
});



export default function EditForm({ blog, onEditSuccess, setIsEditing }) {
  const [file, setFile] = useState();
  const [editorContent, setEditorContent] = useState(blog.description);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: blog, // edit form's values
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    // Reset the form values when `blog` changes
    reset(blog);
    // Update the state variable when `blog` changes
    setEditorContent(blog.description);
  }, [blog, reset]);

  useEffect(() => {
    // Reset the form values when `blog` changes
    reset(blog);
    // Update the state variable when `blog` changes
    setEditorContent(blog.description);
  }, [blog, reset]);

  useEffect(() => {
    if (!loading) {
      for (const [key, value] of Object.entries(blog)) {
        setValue(key, value);
      }
      if (editorRef.current) {
        editorRef.current.commands.setContent(blog.content);
      }
    }
  }, [blog, setValue, loading]);

  useEffect(() => {
    if (editorRef.current && !loading) {
      editorRef.current.commands.setContent(blog.content);
    }
  }, [blog, loading]);

  const { updateForm } = useUpdateForm();

  const onSubmit = async (data) => {
    // console.log(data)
    setSubmitting(true)
    let formData = {
      ...data,
      date: new Date().toISOString(),
      title: data.title,
      content: data.description,
      author: data.author,
      priority: data.priority,
    };

    console.log(formData)

    if (file) {
      const storageRef = ref(storage, "images/" + file.name);
      await uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      // Await the URL of the uploaded image
      const url = await getDownloadURL(storageRef); // Await the URL of the uploaded image
      formData.image = url;
      // console.log(formData);
      // console.log(blog.id)
      updateForm(blog.id, formData).then(() => {
        reset({
          title: "",
          description: "",
          author: "",
          priority: "",
          image: "",
        });
        if (editorRef.current) {
          editorRef.current.commands.setContent(""); // clear the TipTap editor content
        }
      });
      onEditSuccess();
      setIsEditing(false);
      setSubmitting(false)
    } else {
      console.error("Error: Image field is empty");
      alert("Please select an image before submitting the form.");
      return;
    }
  };


  return (
    <div className=" relative">
      {submitting && <LoadingSpinner />}
      <div
        className={`transition-opacity duration-300 ${
          submitting ? "opacity-10 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex mx-5 items-center  justify-center rounded py-7 transition-all duration-500">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-[70%] space-y-4 max-w-3xl  bg-white p-8 rounded shadow-lg"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-md font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                {...register("title")}
                className="flex h-10 w-full md:w-[60%] rounded-md border border-input  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-md font-semibold text-gray-700"
              >
                Author
              </label>
              <input
                id="author"
                {...register("author")}
                className="flex h-10 w-full md:w-[60%] rounded-md border border-input  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.author.message}
                </p>
              )}
            </div>
            <input
              id="image"
              type="file"
              onChange={handleFileChange}
              className="flex h-10 w-full md:w-[60%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div>
              <label
                htmlFor="description"
                className="block text-md font-semibold text-gray-700"
              >
                Description
              </label>
              <div id="description" {...register("description")} className="">
                <TipTap
                  description={" "}
                  onChange={(html) => {
                    setValue("description", html);
                    setEditorContent(html);
                  }}
                  onEditorReady={(editor) => {
                    editorRef.current = editor;
                    setLoading(false); // set loading to false when the editor is ready
                  }}
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-md font-semibold text-gray-700"
              >
                Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="flex h-10 w-full md:w-[60%] rounded-md border border-input  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option>Choose a priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="select-none rounded-lg bg-amber-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
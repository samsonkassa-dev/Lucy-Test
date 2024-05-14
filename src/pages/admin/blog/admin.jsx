import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePostForm } from '../../../hooks/useBlogFormSubmit';
import { useState, useEffect } from 'react';
import { storage } from '../../../helper/firebase.js';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import TipTap from '../../../components/TipTap.js';
import { useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios'




const schema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  author: z.string().nonempty({ message: "Author is required" }),
  priority: z.string().nonempty({ message: "priority is required" }),
  image: z.any(),
});


const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://lucy-test.vercel.app";

export async function getStaticProps() {
  let blogs = [];

  const res = await axios.get(`${server}/api/getPost`);
  blogs = res.data;

  return {
    props: {
      blogs,
    },
    revalidate: 60,
  };
}



export default function Form() {
  const { data: session, status } = useSession();
  const [isFormVisible, setIsFormVisible] = useState(false);


  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      signIn();
    }
  }, [session, status]);

  const [file, setFile] = useState();
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
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { postForm } = usePostForm();

  const onSubmit = async (data) => {
    // console.log(data);

    let formData = {
      ...data,
      date: new Date().toISOString(),
      title: data.title,
      content: data.description,
      author: data.author,
      priority: data.priority,
    };

    if (file) {
      const storageRef = ref(storage, "images/" + file.name);
      await uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      // Await the URL of the uploaded image
      const url = await getDownloadURL(storageRef);
      formData.image = url;
      console.log(formData);
      postForm(JSON.stringify(formData)).then(() => {
        reset();
        if (editorRef.current) {
          editorRef.current.commands.setContent(""); // clear the TipTap editor content
        }
      });
    } else {
      console.error("Error: Image field is empty");
      alert("Please select an image before submitting the form.");
      return;
    }
  };


  

  return (
    <>
      <div className="flex flex-col items-center justify-center max-w-max mx-auto mt-36 sm:flex-row sm:justify-center">
        <h1 class="text-5xl font-indie font-semibold text-yellow text-center sm:text-6xl">
          {isFormVisible ? "Post Blogs" : "Edit Blogs"}
        </h1>

        <div className="mt-5 sm:mt-0 sm:absolute sm:right-10">
          <button
            type="button"
            onClick={() => {
              setIsFormVisible(!isFormVisible);
            }}
            className="focus:outline-none text-white bg-purple hover:bg-purple focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
          >
            {isFormVisible ? "Edit Blog" : "Add Blog"}
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="flex mx-5 items-center justify-center rounded py-7 transition-all duration-500">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-[70%] space-y-4 max-w-3xl mt-24 bg-white p-8 rounded shadow-lg"
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
                  }}
                  onEditorReady={(editor) => (editorRef.current = editor)}
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
              Submit
            </button>
          </form>
        </div>
      )}



    </>
  );
}


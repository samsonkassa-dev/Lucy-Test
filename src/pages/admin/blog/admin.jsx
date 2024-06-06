import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePostForm } from '../../../hooks/useBlogFormSubmit';
import { useState, useEffect } from 'react';
import { storage } from '../../../helper/firebase.js';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import TipTap from '../../../components/TipTap.js';
import { useRef } from 'react';
import axios from 'axios'
import Image from 'next/image'
import EditForm from '../../../components/EditForm.js';
import { useDeleteForm } from '../../../hooks/useDeleteBlogs.jsx';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import LoadingSpinner from '../../../components/Spinner';
import { useRouter } from 'next/router';









// export async function getStaticProps() {
//   const res = await axios.get('http://localhost:3000/api/getPost');
//   const blogs = res.data;

//   return {
//     props: {
//       blogs,
//     },
//     revalidate: 60, 
//   };
// }



const schema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  author: z.string().nonempty({ message: "Author is required" }),
  priority: z.string().nonempty({ message: "priority is required" }),
  image: z.any(),
});


function Admin({blogs}) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState();
  const editFormRef = useRef(null);
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
  const { deleteForm } = useDeleteForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
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
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        formData.image = url;
        await postForm(JSON.stringify(formData));
        reset();
        if (editorRef.current) {
          editorRef.current.commands.setContent(""); // clear the TipTap editor content
        }
      } else {
        alert("Please select an image before submitting the form.");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blogId) => {
    // Find the blog with the given ID
    const blog = blogs.find((blog) => blog.id === blogId);
    setSelectedBlog(blog);
    setIsEditing(true);

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEditSuccess = () => {
    // Update the UI after a successful edit operation
    setIsEditing(false);
    setSelectedBlog(null);
    // Fetch all blogs again to get the updated data
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteForm(id);
      router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen relative">
      {isLoading && <LoadingSpinner />}
      <div
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-10 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center justify-center max-w-max mx-auto mt-36 sm:flex-row sm:justify-center">
          <h1 class="text-5xl font-indie font-semibold text-yellow text-center sm:text-6xl">
            {isFormVisible ? "Post Blogs" : "Edit Blogs"}
          </h1>

          <div className="mt-5 sm:mt-0 sm:absolute sm:right-10">
            <button
              type="button"
              onClick={() => {
                setIsFormVisible(!isFormVisible);
                setIsEditing(false);
              }}
              className="focus:outline-none text-white bg-purple hover:bg-purple focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              {isFormVisible ? "Edit Blog" : "Add Blog"}
            </button>
          </div>
        </div>

        {isFormVisible && (
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
              <label
                htmlFor="Image"
                className="block text-md font-semibold text-gray-700"
              >
                Image
              </label>
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

        {!isFormVisible && blogs && (
          <section className="md:mx-[95px] mb-10 mx-[34px] mt-12 rounded-3xl grid lg:grid-cols-3 md:gap-10 ">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="overflow-hidden rounded-lg shadow transition"
              >
                <div className="w-full h-56 relative">
                  <Image
                    src={blog.image}
                    alt="Blog One"
                    layout="fill"
                    objectFit="cover"
                    className=""
                  />
                </div>

                <div className="bg-white p-4 sm:p-6">
                  <time
                    datetime={new Date(blog.date).toISOString()}
                    className="block text-xs text-gray-500"
                  >
                    {new Date(blog.date).toLocaleDateString()}
                  </time>

                  <h3 className="mt-0.5 text-lg text-gray-900">{blog.title}</h3>
                  <div className="flex mt-5 gap-10">
                    <button
                      className="focus:outline-none text-white bg-yellow hover:bg-yellow focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                      onClick={() => handleEdit(blog.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="focus:outline-none text-white bg-purple hover:bg-purple focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {isEditing && (
          <div ref={editFormRef}>
            <EditForm
              blog={selectedBlog}
              setIsEditing={setIsEditing}
              onEditSuccess={handleEditSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
}


export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const res = await axios.get('https://lucy-test.vercel.app/api/getPost');
    const blogs = res.data;

    return {
      props: {
        blogs,
      },
    };
  },
});

export default Admin;



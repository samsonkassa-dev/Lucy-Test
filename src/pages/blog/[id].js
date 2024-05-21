import { useState, useEffect } from "react";

import axios from "axios";
import parse, { domToReact } from "html-react-parser";

const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://lucycoding.com";

export async function getStaticPaths() {
  let blogs = [];

    const res = await axios.get(`${server}/api/getPost`);
    blogs = res.data;
  

  const paths = blogs.map((blog) => ({
    params: { id: blog.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  let blog = {};

  const res = await axios.get(`${server}/api/getPost/${params.id}`);
  blog = res.data;

  return { props: { blog }, revalidate: 60 };
}

const FullPage = ({ blog }) => {
  const [parsedContent, setParsedContent] = useState("");

  useEffect(() => {
    if (blog) {
      const options = {
        replace: ({ name, attribs, children }) => {
          if (name === "a") {
            return (
              <a href={attribs.href} className="text-blue-500 underline">
                {domToReact(children, options)}
              </a>
            );
          }
        },
      };

      setParsedContent(parse(blog.content, options));
    }
  }, [blog]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section
        className="md:mx-[95px] mt-36 h-[322px] mx-[34px] rounded-3xl overflow-hidden "
        style={{
          backgroundImage: `url('${blog.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="md:mx-[95px] mx-[34px] rounded-3xl  flex items-center justify-center md:py-[15px] py-5 ">
        <h1 className="text-[34px] text-left pt-3 font-semibold">
          {blog.title}
        </h1>
      </div>
      <div className="md:mx-[95px] pb-10 text-left mx-[34px] rounded-3xl">
        <div className="text-[18px] inline font-normal text-[#1E1E1E] opacity-90">
          {Array.isArray(parsedContent)
            ? parsedContent.map((element, index) => (
                <div key={index} className="mb-5">
                  {element}
                </div>
              ))
            : parsedContent}
        </div>

        <div className="pt-5 flex justify-center">
          <p className="text-[#000000] text-[10px] md:text-[15px] opacity-50">
            Written By: {blog.author} |{" "}
            {new Date(blog.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default FullPage;

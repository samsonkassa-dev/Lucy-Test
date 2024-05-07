import Image from "next/image";
import Blog from "../components/Blog";
import axios from 'axios'
import parse, { domToReact } from 'html-react-parser';
import { useState, useEffect } from "react";


const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://lucy-test.vercel.app";

export async function getStaticProps() {
  let blogs = [];
  if (dev) {
    const res = await axios.get(`${server}/api/getPost`);
    blogs = res.data;
  }

  return {
    props: {
      blogs,
    },
    revalidate: 60, 
  };
}


const BlogPage = ({ blogs }) => {
  const [blogOverviews, setBlogOverviews] = useState([]);

  useEffect(() => {
    if (blogs) {
      const overviews = blogs.map((blog) => {
        const options = {
          replace: ({ attribs, children }) => {
            if (!attribs) {
              return;
            }

            // Check if the element is a paragraph
            if (attribs && attribs.class === "paragraph") {
              // Convert the children (which are in DOM format) back into React elements
              const reactChildren = domToReact(children, options);

              // Return a new React element
              return <p>{reactChildren}</p>;
            }
          },
        };

        const parsedContent = parse(blog.content, options);
        const firstParagraph = parsedContent.find(
          (element) => element.type === "p"
        );

        return {
          ...blog,
          content: firstParagraph ? firstParagraph.props.children : "",
        };
      });

      setBlogOverviews(overviews);
    }
  }, [blogs]);

  if (!blogs) {
    return <div>Loading...</div>;
  }

  return <Blog blogs={blogOverviews} />;
};

export default BlogPage;

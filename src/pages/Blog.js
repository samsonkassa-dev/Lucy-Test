import Image from "next/image";
import Blog from "../components/Blog";
import axios from 'axios'
import parse, { domToReact } from 'html-react-parser';
import { useState, useEffect } from "react";




const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://lucycoding.com";




export async function getStaticProps() {
  const res = await axios.get(`${server}/api/getPost`);
  const blogs = res.data;

  return {
    props: {
      blogs,
    },
    revalidate: 60, 
  };
}


const BlogPage = ({ blogs }) => {
  const [blogOverviews, setBlogOverviews] = useState([]);
  // const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get('api/getPost'); // Replace with your actual API endpoint
  //       setBlogs(res.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
        const contentArray = Array.isArray(parsedContent)
          ? parsedContent
          : [parsedContent];
        const firstParagraph = contentArray.find(
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

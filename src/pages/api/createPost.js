// api/createPost.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'POST') {
    const { title, content, date, author, priority, image } = req.body;
    if (priority === "High") {

      await prisma.blog.updateMany({
        where: { priority: "High" },
        data: { priority: "Medium" },
      });
    }

    const newBlogPost = {
      title,
      content,
      date,
      author,
      image, // this thing is a url now
      priority 
    };

    const createdBlogPost = await prisma.blog.create({
      data: newBlogPost
    });

    res.status(200).json(createdBlogPost);
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
};

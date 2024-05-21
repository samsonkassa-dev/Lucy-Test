// api/updatePost.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'PUT') {
    const { id, title, content, date, author, priority, image } = req.body;

    const updatedBlogPost = await prisma.blog.update({
      where: { id },
      data: { title, content, date, author, image, priority },
    });

    res.status(200).json(updatedBlogPost);
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
};

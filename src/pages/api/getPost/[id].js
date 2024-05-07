import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query;

    // Fetch a single blog post by its ID
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

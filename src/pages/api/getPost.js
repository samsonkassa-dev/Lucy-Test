
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'GET') {
    const blogs = await prisma.blog.findMany();
    res.status(200).json(blogs);
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
};

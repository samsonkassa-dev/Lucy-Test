import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    console.log(id)

    const deletedBlogPost = await prisma.blog.delete({
      where: { id },
    });

    res.status(200).json(deletedBlogPost);
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
};

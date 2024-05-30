  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();

  export default async (req, res) => {
    console.log(`Received ${req.method} request`);  // Log the request method

    if (req.method === 'DELETE') {
      const { id } = req.body;
      console.log(`Deleting post with id: ${id}`);  // Log the id to be deleted

      try {
        const deletedBlogPost = await prisma.blog.delete({
          where: { id },
        });
        console.log(`Deleted post: ${deletedBlogPost}`);  // Log the deleted post

        res.status(200).json(deletedBlogPost);
      } catch (error) {
        console.error(`Error deleting post: ${error.message}`);  // Log the error
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      console.log(`Method not allowed: ${req.method}`);  // Log disallowed methods
      res.status(405).json({ message: "Method not allowed" });
    }
  };

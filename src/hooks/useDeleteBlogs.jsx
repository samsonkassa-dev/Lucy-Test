// useUpdateBlogs.jsx
import axios from 'axios'; // Import your custom axios instance
import { toast } from 'react-toastify'; // Import the toast function


export const useDeleteForm = () => {
  const deleteForm = async (id) => {
    try{
      const response = await axios.delete(`/api/deletePost`, { data: { id } }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Blog post deleted successfully:', response.data);
      toast.success('Blog post deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Something went wrong');
      return Promise.reject(error);
    }
  };

  return { deleteForm };
};




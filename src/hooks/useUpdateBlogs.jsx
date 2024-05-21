// useUpdateBlogs.jsx
import axios from 'axios'; // Import your custom axios instance
import { toast } from 'react-toastify'; // Import the toast function

export const useUpdateForm = () => {
  const updateForm = async (id, formData) => {
    try{
      const response = await axios.put(`/api/updatePost`, { id, ...formData }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Blog post updated successfully:', response.data);
      toast.success('Blog post updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Something went wrong');
      return Promise.reject(error);
    }
  };

  return { updateForm };
};

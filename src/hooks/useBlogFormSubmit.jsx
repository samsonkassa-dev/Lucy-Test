import axios from 'axios'; // Import your custom axios instance
import { toast } from 'react-toastify'; // Import the toast function



export const usePostForm = () => {
  const postForm = async (formData) => {
    try{
      const response = await axios.post('/api/createPost', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }); // Use your custom axios instance
      console.log('Blog post sent successfully:', response.data);
      toast.success('Blog post sent successfully!');
      return response.data;
    } catch (error) {
      toast.error('Something went wrong');
      return Promise.reject(error);
    }
  };

  return { postForm };
};


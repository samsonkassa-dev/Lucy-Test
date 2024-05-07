import axios from "../api/axios";

export const usePostBook = () => {
  const postBook = async (bookingData) => {
    try {
      const response = await axios.post("v1/user/book", bookingData);
      return response.data;
    } catch (error) {
      //   console.error(error);
      return Promise.reject(error);
    }
  };

  return { postBook };
};

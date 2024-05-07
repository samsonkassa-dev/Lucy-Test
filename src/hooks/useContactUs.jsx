import axios from "../api/axios";

export const useContactUs = () => {
  const contactUs = async (contactData) => {
    try {
      const response = await axios.post("v1/user/contact", contactData);
      return response.data;
    } catch (error) {
      //   console.error(error);
      return Promise.reject(error);
    }
  };

  return { contactUs };
};

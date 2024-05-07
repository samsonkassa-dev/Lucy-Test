import axios from "../api/axios";

export const useLogin = () => {
  const login = async (phoneNumber) => {
    try {
      const response = await axios.post("v1/user/login", {
        phoneNumber,
      });

      return response.data;
    } catch (error) {
      // console.error(error);
      return Promise.reject(error);
    }
  };

  return { login };
};

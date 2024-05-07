import axios from "../api/axios";

export const usePostSuggestion = () => {
  const postSuggestion = async (suggestion) => {
    try {
      const response = await axios.post("/v1/suggestion", suggestion);
      return response.data;
    } catch (error) {
      //   console.error(error);
      return Promise.reject(error);
    }
  };

  return { postSuggestion };
};

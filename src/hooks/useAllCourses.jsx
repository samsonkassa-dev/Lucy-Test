import axios from "../api/axios";
import state from "../feature/studentRegistration/store";

export const useAllCourses = () => {
  const actions = state.getState().actions;

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get("/v1/course");
      if (Array.isArray(response.data.products)) {
        actions.setAllCourses(response.data.products);
      } else {
        console.error('Invalid value for products:', response.data.products);
      }
      
      return response.data.products;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const fetchCourseById = async (props) => {
    try {
      const response = await axios.get(`/v1/course` + `/${props}`);
       console.log(response.data)
        return response.data
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return { fetchAllCourses,fetchCourseById };
};

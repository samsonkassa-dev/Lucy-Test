import axios from "../api/axios";
import state from "../feature/studentRegistration/store";

// setStudents
export const usePostParentInformation = async (parentData) => {
 // console.log("parent data" + JSON.stringify(parentData));
  const actions = state.getState().actions;
  try {
    const getRecommendationData = await axios.post("/v1/user", parentData);
    console.log("Response from server:", getRecommendationData.data);
    return getRecommendationData.data;
    // actions.setStudents(getRecommendationData.data.Data);
  } catch (err) {
    // console.log(err);
    return Promise.reject(err);
  }
};

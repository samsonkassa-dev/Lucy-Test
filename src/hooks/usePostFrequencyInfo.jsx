import axios from "../api/axios";
import state from "../feature/studentRegistration/store";

export const usePostFrequencyInfo = async (studentFrequency) => {
  const actions = state.getState().actions;
  try {
    const getFrequencyInfo = await axios.post(
      "/v1/user/enroll",
      studentFrequency
    );
  } catch (err) {
    return Promise.reject(err);
  }
};

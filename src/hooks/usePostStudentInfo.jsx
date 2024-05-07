  import axios from "../api/axios";
  import state from "../feature/studentRegistration/store";

  export const usePostStudentInfo = async (studentData) => {
    const actions = state.getState().actions;
    const userId = state.getState().userId;
    try {
      const studentDataWithUserId = {
        studentsData: studentData.Students,
        userId,
      };
      const getRecommendationData = await axios.post(
        "/v1/student",
        studentDataWithUserId,
        
      );
      // console.log(state.getState().studentRecommendation)
      // console.log(state.getState().students)


      actions.setStudents(getRecommendationData.data.data);
    } catch (error) {
      console.error('Something went wrong:', error);
      console.log(error)
      console.log(error.response)
      console.log(error.header)
      return Promise.reject(err);
    }
  };

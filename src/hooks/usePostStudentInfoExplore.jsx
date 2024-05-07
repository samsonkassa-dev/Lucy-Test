import axios from "../api/axios";
import state from "../feature/studentRegistration/store";

export const usePostStudentInfo = async (studentData) => {
  const actions = state.getState().actions;
  const userId = state.getState().userId;
  console.log(state.getState().students);
  try {
    const studentDataWithUserId = {
      studentsData: studentData.Students,
      userId,
    };
    const getRecommendationData = await axios.post(
      "/v1/student",
      studentDataWithUserId,
      
    );
    console.log(studentDataWithUserId);

    // Extract student ID
    const studentId = getRecommendationData.data.data.studentIds[0].id;
    const RecommendedFor = getRecommendationData.data.data.studentIds[0].firstname;

    // Get the current state
    const currentStudents = state.getState().students;

    // Add userId and studentId to each student object in the array
    const updatedStudents = currentStudents.map((student) => ({
      ...student,
      _id: studentId,
      RecommendedFor: RecommendedFor// Set `_id` to extracted student ID
    }));

    // Update the students array in the global state
    actions.setStudents(updatedStudents);
    console.log(state.getState().students);
  } catch (error) {
    console.error("Something went wrong:", error);
    console.log(error);
    console.log(error.response);
    console.log(error.header);
    return Promise.reject(err);
  }
};

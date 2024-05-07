import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

const useStudentStore = create(
  devtools(
    persist(
      (set, get) => ({
        students: [],
        studentRecommendation: [],
        studentTrainingFrequency: [],
        checkoutSession:[],
        recommendationArray: [],
        allCourses: [], 
        exploreCourses: [],
        trainingFrequency: [],
        selectedTap: 1,
        chosenCourse: false,
        userId: "",
        adjustPrice:"",
        selectedSession: 'Session1', // Default value
        actions: {
          setAdjustPrice:(adjustPrice)=>set({adjustPrice}),
          setChosenCourse: (chosenCourse) => set({chosenCourse}),
          setCheckoutSession:(checkoutSession) => set({checkoutSession}),
          setSelectedTap: (selectedTap) => set({ selectedTap }),
          setUserId: (userId) => set({ userId }),
          setStudents: (students) => set({ students }),
          setSelectedSession: (session) => set({ selectedSession: session }),
          addStudent: (student) =>
            set((state) => ({ students: [...state.students, student] })),
          removeStudent: (student) =>
            set((state) => ({
              students: state.students.filter((s) => s.id !== student.id),
            })),
          setStudentTrainingFrequency: (studentTrainingFrequency) => set((state) => ({ studentTrainingFrequency })),
          updateStudent: (student) =>
            set((state) => ({
              students: state.students.map((s) =>
                s.id === student.id ? student : s
              ),
            })),
          clearStudents: () => set({ students: [] }),
          setStudentRecommendation: (studentRecommendation) => set((state) => ({ studentRecommendation })),
          resetSelectedCourse: () => set({ studentRecommendation: [] }),
          setRecommendationArray: (newArray) => set({ recommendationArray: newArray }),
          setAllCourses: (allCourses) => set({ allCourses }), 
          setExploreCourses: (exploreCourses) => set((state) =>({exploreCourses})),
          setCoursePrice: (courseId, newPrice) => set((state) => {
            const updatedCourses = state.recommendationArray.map((course) => {
              if (course._id === courseId) {
                return { ...course, prices: [{ unitAmount: newPrice * 100 }] };
              }
              return course;
            });
            return { recommendationArray: updatedCourses };
          }),
          
        },
      }), {
      name: "student-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => key !== 'actions')),
    }))
);
export default useStudentStore;
export const useStudentStoreSelector = () => useStudentStore((state) => state.actions)




import { useState, useEffect, Fragment } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { usePostStudentInfo } from "../../hooks/usePostStudentInfo";
import { usePostStudentRecommendation } from "../../hooks/usePostStudentRecommendation";
import { useLocalStorage } from "@mantine/hooks";
import countries from "countries-list";
import { useGetUserCountryCallingCode } from "../../hooks/useGetUserCountryCallingCode";
import state from "../../feature/studentRegistration/store";

export default function NamePage(props) {
  const [loading, setLoading] = useState(false);
  const countryCodes = Object.keys(countries.countries);
  const courseChosen = state.getState().chosenCourse;
  const chosenCourse = state.getState().studentRecommendation;
  const actions = state.getState().actions;
  const countryNames = countryCodes
    .map((code) => {
      return {
        country: countries.countries[code].name,
        code: countries.countries[code].phone.split(",")[0],
        emoji: countries.countries[code].emoji,
      };
    })
    .sort((c) => c.country);
  const { code, country } = useGetUserCountryCallingCode();
  const [selectedAreaCode, setSelectedAreaCode] = useState(
    countryNames.filter((c) => c.code === "1")[0]
  );

  const [userInfo, setUserInfo, removeValue] = useLocalStorage({
    key: "userInfo",
    defaultValue: {
      Students: [
        {
          FirstName: "",
          LastName: "",
          GradeLevel: "",
          CodingExperiance: "",
        },
      ],
    },
  });
  const {
    control,
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...userInfo,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "Students",
    keyName: "Students",
  });

  useEffect(() => {
    handleAreaCodeChange({ code, country });
  }, [country]);

  useEffect(() => {
    localStorage.removeItem("userInfo");
  }, []);

  useEffect(() => {
    reset(userInfo);
  }, [userInfo]);

  const handleAreaCodeChange = (userCountry) => {
    if (userCountry?.code === undefined)
      return setSelectedAreaCode(countryNames.filter((c) => c.code === "1")[0]);
    if (
      userCountry.hasOwnProperty("code") &&
      !userCountry.hasOwnProperty("emoji")
    ) {
      const selected = countryNames.find(
        (c) => c.code === userCountry.code && c.country === userCountry.country
      );
      return setSelectedAreaCode(selected);
    }
    return setSelectedAreaCode(userCountry);
  };
  const handleAddStudent = () => {
    append({
      FirstName: "",
      LastName: "",
      GradeLevel: "",
      CodingExperiance: "",
      // StartDate: "",
    });
  };

  const handleStudentDeletion = (index) => {
    remove(index);
  };
  const handleNext = async (data) => {
    // setLoading(true)
    setUserInfo(data);
    toast
      .promise(
        usePostStudentInfo(data),
        // new Promise((resolve, reject) => setTimeout(() => resolve({ data: { message: "success" } }), 10000)),
        {
          loading: "Registering user",
          success: "Success",
          error: {
            render({ data }) {
              return `${
                data?.response?.data?.message ?? "something went wrong "
              }`;
            },
          },
        }
      )
      .then((res) => {
        const filteredData = data.Students.map((Student) => {
          return {
            FirstName: Student.FirstName,
            CodingExperiance: Student.CodingExperiance,
            GradeLevel: Student.GradeLevel,
          };
        });
        toast
          .promise(usePostStudentRecommendation(filteredData, true), {
            loading: "Loading",
            success: "Success",
            error: {
              render({ data }) {
                return `${
                  data?.response?.data?.message ?? "something went wrong "
                }`;
              },
            },
          })
          .then((res) => {
            props.next();
            setLoading(false);
          })
          .catch((err) => setLoading(false));
      })
      .catch(async (err) => {
        setLoading(false);
      });
    
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit(handleNext)}
      >
        <h2 className="text-lg pt-16 md:text-2xl pb-7 font-bold ">
          {props.selectedLocale.registerPage.studentComponent.title}
        </h2>

        {fields.map((item, index) => (
          <div
            key={index}
            className="flex lg:flex-row md:px-10 flex-col w-full "
          >
            <div className="flex flex-col items-start mx-2 pb-2">
              <label className="font-bold ">
                {props.selectedLocale.registerPage.studentComponent.name}
              </label>
              <div className="flex w-full lg:w-auto  flex-col">
                <input
                  className="border border-black/10 rounded p-2"
                  type="text"
                  placeholder={
                    props.selectedLocale.registerPage.studentComponent.name
                  }
                  {...register(`Students.${index}.FirstName`, {
                    required: "First name is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`Students.${index}.FirstName`}
                  render={({ message }) => (
                    <p className="text-xs italic text-red-600">{message} </p>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col items-start mx-2 pb-2">
              <label className="font-bold">
                {props.selectedLocale.registerPage.studentComponent.lastName}
              </label>
              <div className="flex flex-col w-full lg:w-auto">
                <input
                  className="border border-black/10 rounded p-2"
                  type="text"
                  placeholder={
                    props.selectedLocale.registerPage.studentComponent.lastName
                  }
                  {...register(`Students.${index}.LastName`, {
                    required: "Last name is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`Students.${index}.LastName`}
                  render={({ message }) => (
                    <p className="text-xs italic text-red-600">{message} </p>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col items-start mx-2 pb-2">
              <label className="font-bold">
                {props.selectedLocale.registerPage.studentComponent.grade}
              </label>
              <div className="flex flex-col w-full lg:w-auto">
                <select
                  className="border text-[#667085] bg-white h-11 border-black/10 rounded p-2"
                  {...register(`Students.${index}.GradeLevel`, {
                    required: "Grade level is required",
                  })}
                >
                  <option className="bg-black/10" disabled selected>
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .grades[0]
                    }
                  </option>
                  <option className="bg-white" value="Grade 2-4">
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .grades[1]
                    }
                  </option>
                  <option className="bg-white" value="Grade 5-8">
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .grades[2]
                    }
                  </option>
                  <option className="bg-white" value="Grade 9-12">
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .grades[3]
                    }
                  </option>
                  {/* Add more options here */}
                </select>
                <ErrorMessage
                  errors={errors}
                  name={`Students.${index}.GradeLevel`}
                  render={({ message }) => (
                    <p className="text-xs italic text-red-600">{message} </p>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col items-start mx-2 pb-2">
              <label className="font-bold">
                {props.selectedLocale.registerPage.studentComponent.codingXP}
              </label>
              <div className="flex flex-col w-full lg:w-auto">
                <select
                  className="border text-[#667085] bg-white h-11 border-black/10 rounded p-2"
                  {...register(`Students.${index}.CodingExperiance`, {
                    required: "Coding experience is required",
                  })}
                >
                  <option className="bg-black/10" disabled selected>
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .codingXPs[0]
                    }
                  </option>
                  <option className="bg-white" value="No-Experiance">
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .codingXPs[1]
                    }
                  </option>
                  <option className="bg-white" value="Beginner-Level">
                    {
                      props.selectedLocale.registerPage.studentComponent
                        .codingXPs[2]
                    }
                  </option>
                  {/* <option className="bg-white" value="Intermediate-Level">Intermediate</option> */}
                  {/* <option className="bg-white" value="Experience">Advanced</option> */}
                </select>
                <ErrorMessage
                  errors={errors}
                  name={`Students.${index}.CodingExperiance`}
                  render={({ message }) => (
                    <p className="text-xs italic text-red-600">{message} </p>
                  )}
                />
              </div>
            </div>
            {/* todo style the date picker  */}
            {/* <div className="flex flex-col items-start mx-2 pb-2">
            <label className="font-bold">Start Date</label>
            <input
              type="date"
              className="border border-black/10 w-full lg:w-auto rounded p-3"
              {...register(`Students.${index}.StartDate`, { required: "Start date is required" })}
            />
            <ErrorMessage errors={errors} name={`Students.${index}.StartDate`} render={({ message }) => <p className="text-xs italic text-red-600">{message} </p>} />
          </div> */}
            {getValues().Students.length !== 1 && (
              <button
                className="ml-3  flex items-center justify-center"
                onClick={() => handleStudentDeletion(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M6.71 6.71a1 1 0 0 1 1.42 0L12 10.59l3.88-3.88a1 1 0 1 1 1.42 1.42L13.41 12l3.88 3.88a1 1 0 1 1-1.42 1.42L12 13.41l-3.88 3.88a1 1 0 0 1-1.42-1.42L10.59 12 6.71 8.12a1 1 0 0 1 0-1.41z" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {/* <button
          onClick={handleAddStudent}
          className="text-blue-500 underline mt-11"
          style={{
            color: "#0052B4",
            alignItems: "flex-end",
            textDecorationLine: "underline",
            fontWeight: 500,
          }}
        >
          {props.selectedLocale.registerPage.studentComponent.add}
        </button> */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-32  my-4 w-full">
          <button
            onClick={props.prev}
            className="py-2 w-245 h-11 my-10 text-center font-bold bg-yellow rounded-md focus:outline-none"
            style={{
              backgroundColor: "#EFC35A",
              width: "230px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              borderRadius: "8px",
            }}
          >
            {props.selectedLocale.registerPage.back}
          </button>
          <button
            type="submit"
            className="py-2 w-245 h-11  text-center font-bold bg-yellow rounded-md focus:outline-none"
            style={{
              backgroundColor: "#EFC35A",
              width: "230px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              borderRadius: "8px",
            }}
            disabled={loading}
          >
            {props.selectedLocale.registerPage.next}
          </button>
        </div>
      </form>
      <Toaster/>
    </div>
  );
}

import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import Modal from "./UI/dialog";
import { useRouter } from "next/router";
import Navbar from "../components/NavBar";
import Footer from "./Footer";
import state from "../feature/studentRegistration/store";
import localeData from "../i18n/index.json";
import FeaturedCourseCard from "./UI/FeaturedCourseCard";
import { useAllCourses } from "../hooks/useAllCourses";

export default function Landing() {
  const [active, setActive] = useState(null);
  let [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocale, setselectedLocale] = useState(localeData.labels[0]);
  const router = useRouter();

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  useEffect(() => {
    // console.log("working");
    if (router.asPath.includes("discount")) {
      setActive(9);
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      setActive(null);
    }
  }, [router.asPath]);

  useEffect(() => {
    setselectedLocale(
      localeData.labels.filter((l) => l.locale === router.locale)[0]
    );
  }, [router.locale]);

  //course fetching

  const { fetchAllCourses } = useAllCourses();
  const [exploreCoursesArray, setExploreCoursesArray] = useState([]);
  const resetSelectedCourse = state.getState().actions.resetSelectedCourse;

  useEffect(() => {
    // Reset the studentRecommendation array in the global state
    resetSelectedCourse();

    fetchAllCourses().then((courses) => {
      if (Array.isArray(courses)) {
        setExploreCoursesArray(courses);
      } else {
        console.error("Invalid value for courses:", courses);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>
          Lucy: Coding Education for Ethiopian Diaspora | After-School Programs.
        </title>
        <meta
          name="description"
          content="Lucy Coding is a robust online coding platform that offers a wide range of coding courses and tutorials for Kids between the age of 8-18."
        />
      </Head>
      <Navbar setActive={() => setActive(9)} />
      <div className=" max-w-max overflow-hidden">
        <section className="flex justify-center min-h-screen mt-24 mx-6 sm:mx-8 md:mx-12 lg:mx-18">
          <div className=" h-full flex flex-col lg:flex-row justify-between items-center w-full">
            <div className="w-full lg:h-full lg:mb-0  ">
              <div className="flex flex-wrap ">
                <div className=" ">
                  <div className=" lg:mb-5 w-full h-40  lg:h-32">
                    <div className=" md:w-3/5 w-full -z-10 h-full relative left-0">
                      <Image
                        className=""
                        fill
                        style={{ objectFit: "contain" }}
                        alt=""
                        src="/Vector (5).png"
                      />
                    </div>
                    <h1
                      className={`lg:-mt-[5rem] -mt-24 ml-4 font-indie z-10 font-bold ${
                        router.locale === "am-ET"
                          ? "lg:text-4xl text-xl"
                          : "lg:text-5xl text-2xl"
                      }  w-full`}
                    >
                      {selectedLocale.headerTitle}
                    </h1>
                  </div>

                  <h2 className="lg:text-2xl  text-[#333333] leading-tight">
                    {selectedLocale.headerSubtitle}
                  </h2>
                </div>
              </div>
              <div className="flex w-full justify-center mb-2 md:justify-start mt-7">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/form");
                  }}
                  className="sm:py-4 py-2 px-10 sm:w-auto w-full font-semibold rounded bg-purple text-white cursor-pointer mr-2"
                >
                  {selectedLocale.register}
                </button>
              </div>

              <div className="flex items-center mt-7 flex-wrap">
                <Image
                  src="images/calendar-stats.svg"
                  alt=""
                  width={30}
                  height={30}
                  className="inline-block mr-2"
                  style={{
                    color: "#FFC000",
                  }}
                />
                {selectedLocale.help} &nbsp;
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="lg:text-md  text-[#FFC000] leading-tight  cursor-pointer"
                >
                  {selectedLocale.click}
                </span>
                &nbsp; {selectedLocale.toregister}
              </div>
            </div>
            <Modal isModalOpen={isModalOpen} closeModal={closeModal} />

            <div className="lg:block -ml-40 -mr-40 relative h-[50vh] lg:h-screen w-full">
              <Image
                fill
                style={{ objectFit: `contain` }}
                alt=""
                src="/Hero Image.webp"
                priority
              />
            </div>
          </div>
        </section>

        <section className="flex justify-center py-5 md:mt-10 mx-6 sm:mx-8 md:mx-12 lg:mx-18">
          <div className="flex flex-col mx-auto text-center items-end w-full">
            {/* <h3 className='font-indie font-extrabold text-5xl self-center '>Start their journey with Lucy</h3>
                        <div className="relative h-10 w-10 -mr-4 justify-self-end">
                            <Image fill
                                style={{ objectFit: "contain" }} alt="" src="/Vector (1).png" />
                        </div> */}
            <div className="flex mx-auto text-center items-end ">
              <h2 className="font-indie font-extrabold text-3xl lg:text-5xl self-center z-10 ">
                {selectedLocale.sectionTwoTitle}
              </h2>
              <div className="relative lg:h-10 lg:w-10 w-6 h-6 lg:-bottom-10 -bottom-5">
                <Image
                  fill
                  style={{ objectFit: "contain" }}
                  alt=""
                  src="/Vector (1).png"
                />
              </div>
            </div>

            <div className="lg:px-16 px-5 mt-8 lg:w-1/2 self-center ">
              <p className="">{selectedLocale.sectionTwoDesc}</p>
            </div>
            <div className="flex w-full justify-center mb-2  mt-7">
              <button
                type="button"
                onClick={() => {
                  router.push("/form");
                }}
                className="sm:py-3 py-2 px-9 sm:w-auto w-full font-semibold rounded bg-purple text-white cursor-pointer mr-2"
              >
                {selectedLocale.register}
              </button>
            </div>
          </div>
        </section>

        <section className=" max-w-screen-2xl mt-16 mx-auto max-[1600px]:px-16">
          <div className="flex md:flex-row-reverse md:justify-between flex-col w-full my-10 md:h-96 items-center">
            <div className="mb-5 md:mb-0 md:w-1/2 w-full">
              <div className="flex flex-col justify-center">
                <h3 className="font-indie font-extrabold text-4xl md:w-1/2 z-10">
                  {selectedLocale.sectionTwoComponents.pl.title}
                </h3>
                <div className="relative h-5 md:w-1/2 w-1/2 -mt-2">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
                <p className="text-lg text-[#333333] mt-10">
                  {selectedLocale.sectionTwoComponents.pl.desc}
                </p>
                <div className="flex w-full justify-center mb-2  mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/form");
                    }}
                    className="sm:py-3 py-2 px-9 sm:w-auto w-full font-semibold rounded bg-purple text-white cursor-pointer mr-2"
                  >
                    {selectedLocale.getStarted}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex">
              <img
                fill
                className="w-full max-h-96 object-contain self-start"
                alt=""
                src="/Group 108.png"
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:justify-between w-full my-10 md:h-96 items-center ">
            <div className="mb-5 md:mb-0 md:w-1/2">
              <div className="flex flex-col justify-center">
                <h3 className="font-indie font-extrabold text-4xl md:w-1/2 z-10">
                  {selectedLocale.sectionTwoComponents.sc.title}
                </h3>
                <div className="relative h-5 md:w-1/2 w-1/2 -mt-2">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
                <p className="text-lg text-[#333333] mt-10">
                  {selectedLocale.sectionTwoComponents.sc.desc}
                </p>
              </div>
            </div>
            <div className="flex">
              <img
                className="w-full max-h-96 object-contain self-end"
                alt=""
                src="/Group 159.png"
              />
            </div>
          </div>
          <div className="flex md:flex-row-reverse flex-col md:justify-between w-full my-10 md:h-96 items-center">
            <div className="mb-5 md:mb-0 md:w-1/2 w-full">
              <div className="flex flex-col justify-center">
                <h3 className="font-indie font-extrabold text-4xl md:w-1/2 z-10">
                  {selectedLocale.sectionTwoComponents.cr.title}
                </h3>
                <div className="relative h-5 md:w-1/2 w-1/2 -mt-2">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
                <p className="text-lg text-[#333333] mt-10">
                  {selectedLocale.sectionTwoComponents.cr.desc}
                </p>
                <div className="flex w-full justify-center mb-2  mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/form");
                    }}
                    className="sm:py-3 py-2 px-9 sm:w-auto w-full font-semibold rounded bg-purple text-white cursor-pointer mr-2"
                  >
                    {selectedLocale.register}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex">
              <img
                className="w-full max-h-96 self-end"
                alt=""
                src="/Group 126.png"
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:justify-between w-full my-10 md:h-96 items-center ">
            <div className=" mb-5 md:mb-0 md:w-1/2">
              <div className="flex flex-col justify-center">
                <h3 className="font-indie font-extrabold text-4xl md:w-1/2 z-10">
                  {selectedLocale.sectionTwoComponents.lmc.title}
                </h3>
                <div className="relative h-5 md:w-1/2 w-1/2 -mt-2">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
                <p className="text-lg text-[#333333] mt-10">
                  {selectedLocale.sectionTwoComponents.lmc.desc}
                </p>
              </div>
            </div>
            <div className="flex">
              <img
                className="w-full max-h-96 object-contain self-end"
                alt=""
                src="/Group 130.png"
              />
            </div>
          </div>
          <div className="flex md:flex-row-reverse flex-col md:justify-between w-full my-10 md:h-96 items-center">
            <div className="mb-5 md:mb-0 md:w-1/2 w-full">
              <div className="flex flex-col justify-center">
                <h3 className="font-indie font-extrabold text-4xl md:w-1/2 z-10">
                  {selectedLocale.sectionTwoComponents.ps.title}
                </h3>
                <div className="relative h-5 md:w-1/2 w-1/2 -mt-2">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
                <p className="text-lg text-[#333333] mt-10">
                  {selectedLocale.sectionTwoComponents.ps.desc}
                </p>
              </div>
            </div>
            <div className=" flex ">
              <img
                className="w-full max-h-96 self-end"
                alt=""
                src="/Group 113.png"
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:justify-between w-full my-10 md:h-96 items-center ">
            <div className="mb-5 md:mb-0 md:w-1/2">
              <div className="flex flex-col justify-center">
                <h3 className="font-indie font-extrabold text-4xl md:w-1/2 z-10">
                  {selectedLocale.sectionTwoComponents.vclt.title}
                </h3>
                <div className="relative h-5 md:w-1/2 w-1/2 -mt-2">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
                <p className="text-lg text-[#333333] mt-10">
                  {selectedLocale.sectionTwoComponents.vclt.desc}
                </p>
                <div className="flex w-full justify-center mb-2  mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/form");
                    }}
                    className="sm:py-3 py-2 px-9 sm:w-auto w-full font-semibold rounded bg-purple text-white cursor-pointer mr-2"
                  >
                    {selectedLocale.getStarted}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex">
              <img
                className="w-full max-h-96 self-end"
                alt=""
                src="/Group 1.png"
              />
            </div>
          </div>
        </section>
        {/* Cards Section - 3 cards  */}
        <section class="flex justify-center items-center max-2xl:px-10 sm:mt-16 lg:mt-16">
          <div class="flex flex-wrap -mx-2 justify-center items-center">
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
              <div class="bg-[#F5C143] h-56 flex flex-col justify-center items-center">
                <h1 class="text-center font-indie text-2xl relative mt-[-14px] ">
                  {selectedLocale.sectionSix.cardOneTitle}
                </h1>
                <div className="relative h-4 md:w-1/2 w-3/4 mb-4 mt-[-6px]  ">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/vector-purple.png"
                  />
                </div>
                <p class="text-center px-4 text-monasans mt-2">
                  {selectedLocale.sectionSix.cardOneDesc}
                </p>
              </div>
            </div>

            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 lg:mt-12">
              <div class="bg-[#9D88EE] h-56 flex flex-col py-4 justify-center items-center overflow-auto">
                <h1 class="text-center font-indie text-2xl relative">
                  {selectedLocale.sectionSix.cardThreeTitle}
                </h1>
                <div className="relative h-4 md:w-1-2 w-3/4 mb-4 mt-[-6px] ">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (11).png"
                  />
                </div>
                <p class="text-center px-6 text-white text-sm">
                  {selectedLocale.sectionSix.cardThreeDesc}
                </p>
              </div>
            </div>

            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
              <div class="bg-[#F5C143] h-56 flex flex-col justify-center items-center">
                <h1 class="text-center font-indie text-2xl relative mt-[-20px] ">
                  {selectedLocale.sectionSix.cardTwoTitle}
                </h1>
                <div className="relative h-4 md:w-1-2 w-3/4 mb-4 mt-[-6px] ">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/vector-purple.png"
                  />
                </div>
                <p class="text-center overflow-auto px-4 text-monasans">
                  {selectedLocale.sectionSix.cardTwoDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center py-5 max-2xl:px-10">
          <div className="flex mx-auto text-center items-end ">
            <h3 className="font-indie font-extrabold lg:text-5xl md:text-4xl text-3xl self-center z-10 ">
              {selectedLocale.sectionThreeTitle}
            </h3>
            <div className="relative h-36 w-36 -ml-36 justify-self-end">
              <Image
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/Vector (4).png"
              />
            </div>
          </div>
        </section>

        <section className="flex lg:pl-20 justify-between mx-auto">
          <div className="w-full flex flex-col max-lg:mb-32 max-lg:gap-y-10 lg:grid-cols-2 lg:grid">
            <div className="">
              <div className="w-full lg:block flex justify-center items-center">
                <div className=" flex flex-col sm:w-1/2  justify-center text-center my-10">
                  <div className=" flex justify-center w-auto  h-20">
                    <div className=" w-full h-full relative">
                      <Image
                        className=""
                        fill
                        style={{ objectFit: "contain" }}
                        alt=""
                        src="/Group 53.png"
                      />
                    </div>
                  </div>

                  <h3 className="text-[24px] text-[#333333] font-semibold leading-tight mb-5 mt-2">
                    {selectedLocale.sectionThreeComponents.ess.title}
                  </h3>
                  <p className="">
                    {selectedLocale.sectionThreeComponents.ess.desc}
                  </p>
                </div>
              </div>
              <div className="w-full lg:block flex justify-center items-center">
                <div className=" flex flex-col sm:w-1/2 justify-center text-center my-10">
                  <div className=" flex justify-center w-auto  h-20">
                    <div className=" w-full h-full relative">
                      <Image
                        className=""
                        fill
                        style={{ objectFit: "contain" }}
                        alt=""
                        src="/Group 54.png"
                      />
                    </div>
                  </div>

                  <h3 className="text-[24px] text-[#333333] font-semibold leading-tight mb-5 mt-2">
                    {selectedLocale.sectionThreeComponents.at.title}
                  </h3>
                  <p className="">
                    {selectedLocale.sectionThreeComponents.at.desc}
                  </p>
                </div>
              </div>
              <div className="w-full lg:block flex justify-center items-center">
                <div className=" flex flex-col sm:w-1/2 justify-center text-center my-10">
                  <div className=" flex justify-center w-auto  h-20">
                    <div className=" w-full h-full relative">
                      <Image
                        className=""
                        fill
                        style={{ objectFit: "contain" }}
                        alt=""
                        src="/Group 55.png"
                      />
                    </div>
                  </div>

                  <h3 className="text-[24px] text-[#333333] font-semibold leading-tight mb-5 mt-2">
                    {selectedLocale.sectionThreeComponents.nco.title}
                  </h3>
                  <p className="">
                    {selectedLocale.sectionThreeComponents.nco.desc}
                  </p>
                </div>
              </div>
            </div>

            <div className=" relative flex justify-end">
              <img
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/Group 60.png"
              />
            </div>
          </div>
        </section>
        
        <section className="flex justify-center py-5 lg:py-10 max-w-screen-2xl mx-auto">
          <div className="sm:rounded-[5rem] rounded-2xl bg-[#6743EE] w-full sm:flex justify-between overflow-hidden mx-5 md:mx-12 lg:mx-32">
            <div className="sm:w-56 w-32 -mt-10  sm:h-1/2 h-32 relative self-start justify-self-start">
              <Image
                className=""
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/Group (1).png"
              />
            </div>
            <div className="sm:self-center sm:justify-self-center sm:-mt-0 flex flex-col items-center justify-center text-center mx-10">
              <h3 className="font-indie mt-10 lg:text-6xl text-4xl font-extrabold text-white z-10">
                {selectedLocale.sectionFourTitle}
              </h3>
              <div className="relative h-7 w-3/4 lg:-mt-7 -mt-5">
                <Image
                  fill
                  style={{ objectFit: "fill" }}
                  alt=""
                  src="/Vector (3).png"
                />
              </div>
              <p className="text-white my-5">
                {selectedLocale.sectionFourDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  router.push("/form");
                }}
                className="py-2 px-10 mb-10 rounded bg-white text-[#6743EE] cursor-pointer text-sm font-semibold"
              >
                {selectedLocale.register}
              </button>
            </div>
            <div className=" w-32 sm:w-72 float-right -mr-10 -mb-10 sm:h-1/2  h-32 relative self-end justify-self-end">
              <Image
                className=""
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/Group.png"
              />
            </div>
            {/* <div className='self-end'>
              
            </div> */}
          </div>
        </section>
        {/* Testimonials */}
        <section className="flex flex-col justify-center md:py-10 py-5 max-lg:px-10 ">
          <div className="sm:self-center sm:justify-self-center sm:-mt-0 flex flex-col items-center justify-center text-center md:mx-10">
            <h3 className="font-indie mt-10 lg:text-6xl text-4xl font-extrabold text-black">
              {selectedLocale.testimonials.title}
            </h3>
            <div className="container mx-auto mt-20">
              <section className="flex justify-center items-center mb-10">
                {/* <div className="w-32 h-24 ">
                  <img
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=pexels-simon-robben-614810.jpg&fm=jpg"
                    alt=""
                    className="w-full h-full "
                    style={{ borderRadius: "50%" }}
                  />
                </div> */}
              </section>
              <section className="flex flex-col gap-y-2 mb-8 justify-center items-center">
                <div className="text-3xl font-indie">
                  {selectedLocale.testimonials.testimonyOne}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="127"
                  height="18"
                  viewBox="0 0 127 18"
                  fill="none"
                >
                  <path
                    d="M15.121 11.3176C14.8749 11.5484 14.7619 11.8823 14.8179 12.2097L15.6624 16.7344C15.7336 17.1179 15.5664 17.506 15.2349 17.7276C14.9101 17.9575 14.4779 17.9851 14.1236 17.8012L9.91659 15.6768C9.7703 15.6014 9.60788 15.5609 9.44165 15.5563H9.18423C9.09494 15.5692 9.00756 15.5968 8.92777 15.6391L4.71982 17.7736C4.51179 17.8748 4.27622 17.9106 4.0454 17.8748C3.48308 17.7718 3.10788 17.2531 3.20001 16.7059L4.0454 12.1812C4.10145 11.851 3.98841 11.5153 3.74239 11.2808L0.312391 8.06203C0.0255287 7.79257 -0.0742083 7.38792 0.0568746 7.02282C0.184158 6.65863 0.509016 6.39285 0.901314 6.33307L5.6222 5.67C5.98125 5.63413 6.29661 5.42261 6.45809 5.10993L8.53832 0.980667C8.58771 0.888701 8.65135 0.804093 8.72829 0.732359L8.81378 0.667983C8.85842 0.620161 8.90972 0.580616 8.96671 0.548428L9.07025 0.511642L9.23173 0.447266H9.63162C9.98878 0.483132 10.3032 0.690055 10.4675 0.99906L12.5753 5.10993C12.7273 5.41066 13.0227 5.61942 13.3637 5.67L18.0846 6.33307C18.4835 6.38825 18.8169 6.65495 18.949 7.02282C19.0734 7.3916 18.9661 7.79625 18.6735 8.06203L15.121 11.3176Z"
                    fill="#F5C143"
                  />
                  <path
                    d="M42.121 11.3176C41.8749 11.5484 41.7619 11.8823 41.8179 12.2097L42.6624 16.7344C42.7336 17.1179 42.5664 17.506 42.2349 17.7276C41.9101 17.9575 41.4779 17.9851 41.1236 17.8012L36.9166 15.6768C36.7703 15.6014 36.6079 15.5609 36.4416 15.5563H36.1842C36.0949 15.5692 36.0076 15.5968 35.9278 15.6391L31.7198 17.7736C31.5118 17.8748 31.2762 17.9106 31.0454 17.8748C30.4831 17.7718 30.1079 17.2531 30.2 16.7059L31.0454 12.1812C31.1014 11.851 30.9884 11.5153 30.7424 11.2808L27.3124 8.06203C27.0255 7.79257 26.9258 7.38792 27.0569 7.02282C27.1842 6.65863 27.509 6.39285 27.9013 6.33307L32.6222 5.67C32.9813 5.63413 33.2966 5.42261 33.4581 5.10993L35.5383 0.980667C35.5877 0.888701 35.6514 0.804093 35.7283 0.732359L35.8138 0.667983C35.8584 0.620161 35.9097 0.580616 35.9667 0.548428L36.0702 0.511642L36.2317 0.447266H36.6316C36.9888 0.483132 37.3032 0.690055 37.4675 0.99906L39.5753 5.10993C39.7273 5.41066 40.0227 5.61942 40.3637 5.67L45.0846 6.33307C45.4835 6.38825 45.8169 6.65495 45.949 7.02282C46.0734 7.3916 45.9661 7.79625 45.6735 8.06203L42.121 11.3176Z"
                    fill="#F5C143"
                  />
                  <path
                    d="M69.121 11.3176C68.8749 11.5484 68.7619 11.8823 68.8179 12.2097L69.6624 16.7344C69.7336 17.1179 69.5664 17.506 69.2349 17.7276C68.9101 17.9575 68.4779 17.9851 68.1236 17.8012L63.9166 15.6768C63.7703 15.6014 63.6079 15.5609 63.4416 15.5563H63.1842C63.0949 15.5692 63.0076 15.5968 62.9278 15.6391L58.7198 17.7736C58.5118 17.8748 58.2762 17.9106 58.0454 17.8748C57.4831 17.7718 57.1079 17.2531 57.2 16.7059L58.0454 12.1812C58.1014 11.851 57.9884 11.5153 57.7424 11.2808L54.3124 8.06203C54.0255 7.79257 53.9258 7.38792 54.0569 7.02282C54.1842 6.65863 54.509 6.39285 54.9013 6.33307L59.6222 5.67C59.9813 5.63413 60.2966 5.42261 60.4581 5.10993L62.5383 0.980667C62.5877 0.888701 62.6514 0.804093 62.7283 0.732359L62.8138 0.667983C62.8584 0.620161 62.9097 0.580616 62.9667 0.548428L63.0702 0.511642L63.2317 0.447266H63.6316C63.9888 0.483132 64.3032 0.690055 64.4675 0.99906L66.5753 5.10993C66.7273 5.41066 67.0227 5.61942 67.3637 5.67L72.0846 6.33307C72.4835 6.38825 72.8169 6.65495 72.949 7.02282C73.0734 7.3916 72.9661 7.79625 72.6735 8.06203L69.121 11.3176Z"
                    fill="#F5C143"
                  />
                  <path
                    d="M96.121 11.3176C95.8749 11.5484 95.7619 11.8823 95.8179 12.2097L96.6624 16.7344C96.7336 17.1179 96.5664 17.506 96.2349 17.7276C95.9101 17.9575 95.4779 17.9851 95.1236 17.8012L90.9166 15.6768C90.7703 15.6014 90.6079 15.5609 90.4416 15.5563H90.1842C90.0949 15.5692 90.0076 15.5968 89.9278 15.6391L85.7198 17.7736C85.5118 17.8748 85.2762 17.9106 85.0454 17.8748C84.4831 17.7718 84.1079 17.2531 84.2 16.7059L85.0454 12.1812C85.1014 11.851 84.9884 11.5153 84.7424 11.2808L81.3124 8.06203C81.0255 7.79257 80.9258 7.38792 81.0569 7.02282C81.1842 6.65863 81.509 6.39285 81.9013 6.33307L86.6222 5.67C86.9813 5.63413 87.2966 5.42261 87.4581 5.10993L89.5383 0.980667C89.5877 0.888701 89.6514 0.804093 89.7283 0.732359L89.8138 0.667983C89.8584 0.620161 89.9097 0.580616 89.9667 0.548428L90.0702 0.511642L90.2317 0.447266H90.6316C90.9888 0.483132 91.3032 0.690055 91.4675 0.99906L93.5753 5.10993C93.7273 5.41066 94.0227 5.61942 94.3637 5.67L99.0846 6.33307C99.4835 6.38825 99.8169 6.65495 99.949 7.02282C100.073 7.3916 99.9661 7.79625 99.6735 8.06203L96.121 11.3176Z"
                    fill="#F5C143"
                  />
                  <path
                    d="M123.121 11.3176C122.875 11.5484 122.762 11.8823 122.818 12.2097L123.662 16.7344C123.734 17.1179 123.566 17.506 123.235 17.7276C122.91 17.9575 122.478 17.9851 122.124 17.8012L117.917 15.6768C117.77 15.6014 117.608 15.5609 117.442 15.5563H117.184C117.095 15.5692 117.008 15.5968 116.928 15.6391L112.72 17.7736C112.512 17.8748 112.276 17.9106 112.045 17.8748C111.483 17.7718 111.108 17.2531 111.2 16.7059L112.045 12.1812C112.101 11.851 111.988 11.5153 111.742 11.2808L108.312 8.06203C108.026 7.79257 107.926 7.38792 108.057 7.02282C108.184 6.65863 108.509 6.39285 108.901 6.33307L113.622 5.67C113.981 5.63413 114.297 5.42261 114.458 5.10993L116.538 0.980667C116.588 0.888701 116.651 0.804093 116.728 0.732359L116.814 0.667983C116.858 0.620161 116.91 0.580616 116.967 0.548428L117.07 0.511642L117.232 0.447266H117.632C117.989 0.483132 118.303 0.690055 118.468 0.99906L120.575 5.10993C120.727 5.41066 121.023 5.61942 121.364 5.67L126.085 6.33307C126.484 6.38825 126.817 6.65495 126.949 7.02282C127.073 7.3916 126.966 7.79625 126.673 8.06203L123.121 11.3176Z"
                    fill="#F5C143"
                  />
                </svg>
              </section>
              <section className="flex justify-center items-center relative ">
                <p className="text-[#1E1E1E] text-lg text-center sm:text-left smmd:text-xl md:text-xl w-full sm:w-1/2">
                  {selectedLocale.testimonials.testimony}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="113"
                  height="108"
                  viewBox="0 0 113 108"
                  fill="none"
                  className="absolute  -top-28 hidden sm:block sm:left-0 md:left-10 lg:left-28 xl:left-32 2xl:left-60 "
                >
                  <path
                    d="M84.2218 93.6622C76.5903 81.2435 72.5502 66.9527 72.5502 52.3765C72.5502 37.8004 76.5903 23.5095 84.2218 11.0908"
                    stroke="#9D88EE"
                    strokeWidth="20.6429"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M91.8555 97.1722C97.5559 97.1722 102.177 92.5511 102.177 86.8507C102.177 81.1504 97.5559 76.5293 91.8555 76.5293C86.1551 76.5293 81.5341 81.1504 81.5341 86.8507C81.5341 92.5511 86.1551 97.1722 91.8555 97.1722Z"
                    stroke="#9D88EE"
                    strokeWidth="20.6429"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.0846 93.6613C14.4531 81.2426 10.413 66.9517 10.413 52.3756C10.413 37.7994 14.4531 23.5085 22.0846 11.0898"
                    stroke="#9D88EE"
                    strokeWidth="20.6429"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M29.725 97.1722C35.4254 97.1722 40.0464 92.5511 40.0464 86.8507C40.0464 81.1504 35.4254 76.5293 29.725 76.5293C24.0246 76.5293 19.4036 81.1504 19.4036 86.8507C19.4036 92.5511 24.0246 97.1722 29.725 97.1722Z"
                    stroke="#9D88EE"
                    strokeWidth="20.6429"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="130"
                  height="123"
                  viewBox="0 0 130 123"
                  fill="none"
                  className="absolute  -bottom-24 hidden sm:block sm:right-0 md:right-10 lg:right-36 xl:right-36 2xl:right-60"
                >
                  <path
                    d="M33.0099 16.2202C41.7219 30.3972 46.334 46.7115 46.334 63.3514C46.334 79.9912 41.7219 96.3055 33.0099 110.483"
                    stroke="#9D88EE"
                    strokeWidth="23.5656"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24.2914 35.779C30.7988 35.779 36.0742 30.5036 36.0742 23.9962C36.0742 17.4887 30.7988 12.2134 24.2914 12.2134C17.7839 12.2134 12.5086 17.4887 12.5086 23.9962C12.5086 30.5036 17.7839 35.779 24.2914 35.779Z"
                    stroke="#9D88EE"
                    strokeWidth="23.5656"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M103.942 16.2202C112.654 30.3972 117.266 46.7115 117.266 63.3514C117.266 79.9912 112.654 96.3055 103.942 110.483"
                    stroke="#9D88EE"
                    strokeWidth="23.5656"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M95.2263 35.779C101.734 35.779 107.009 30.5036 107.009 23.9962C107.009 17.4887 101.734 12.2134 95.2263 12.2134C88.7189 12.2134 83.4435 17.4887 83.4435 23.9962C83.4435 30.5036 88.7189 35.779 95.2263 35.779Z"
                    stroke="#9D88EE"
                    strokeWidth="23.5656"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </section>
              <section className="flex justify-center items-center relative mt-10 gap-2 mb-16 sm:mt-40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="85"
                  height="89"
                  viewBox="0 0 85 89"
                  fill="none"
                  className="absolute left-16 hidden lg:block"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.3049 39.7647C14.2813 38.3354 18.4658 36.4359 21.6927 33.6857C25.5252 30.4192 27.0838 26.2122 28.1305 21.7838C29.4743 16.0945 30.0112 10.0339 31.6407 4.33533C32.244 2.21911 33.405 1.41918 33.9032 1.06417C35.1625 0.16743 36.4353 -0.0722685 37.6328 0.0176361C39.052 0.121372 41.0014 0.663067 42.2835 3.06283C42.4663 3.40631 42.7039 3.92963 42.8639 4.64656C42.9805 5.17215 43.0559 6.81576 43.1793 7.4935C43.4878 9.1625 43.7461 10.8316 43.9883 12.5098C44.795 18.0954 45.259 22.8395 47.8071 27.971C51.2648 34.9374 54.7294 39.1998 59.428 41.0878C63.9713 42.9136 69.4034 42.5702 76.344 41.1386C77.0044 40.9773 77.658 40.8389 78.3047 40.726C81.3648 40.1865 84.29 42.2128 84.8911 45.288C85.4921 48.3609 83.5473 51.3554 80.5147 52.0309C79.8817 52.1715 79.2578 52.3052 78.6407 52.4274C69.2617 54.7695 58.4041 63.1283 52.0943 70.4475C50.1495 72.7043 47.3021 79.0137 44.3974 83.0387C42.2538 86.0078 39.845 87.965 37.8225 88.6566C36.4673 89.1223 35.3247 89.0509 34.3808 88.8157C33.0097 88.4746 31.8716 87.7252 30.9986 86.5334C30.5233 85.881 30.0821 85.0073 29.8718 83.8916C29.7713 83.3545 29.7599 81.9899 29.7622 81.3721C29.1703 79.3181 28.4459 77.3125 27.9179 75.2401C26.6587 70.2953 24.1883 67.1648 21.2539 63.0292C18.5092 59.1587 15.5613 56.7267 11.2397 54.7856C10.6775 54.6473 6.14113 53.5269 4.53912 52.8838C2.19895 51.9409 1.08365 50.3618 0.679149 49.5112C-0.00873395 48.0681 -0.0795165 46.8072 0.0576029 45.756C0.260997 44.2046 0.951169 42.8768 2.1761 41.8048C2.93483 41.1386 4.06836 40.4908 5.58582 40.175C6.75819 39.9283 9.86838 39.7854 10.3049 39.7647ZM36.9175 31.7055C37.1278 32.178 37.3517 32.653 37.5894 33.1325C42.6537 43.3355 48.3167 49.0318 55.2001 51.7957L55.431 51.8857C50.826 55.3343 46.6575 59.1887 43.4718 62.884C42.16 64.4054 40.4232 67.5659 38.547 70.8071C36.8421 65.2169 34.054 61.2657 30.5484 56.321C27.87 52.5473 25.0636 49.7073 21.615 47.3928C24.2911 46.0073 26.8438 44.3844 29.0674 42.4895C32.7697 39.3336 35.2172 35.6774 36.9175 31.7055Z"
                    fill="#E47146"
                  />
                </svg>

                {/* <div></div>
                <div className="w-8 smmd:w-12 bg-[#6743EE] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div>
                <div className="w-3 smmd:w-6 bg-[#C6C4C4] h-1"></div> */}
              </section>
            </div>
          </div>
        </section>
        {/* Featured Courses*/}
        {exploreCoursesArray.length > 0 && (
          <section className="h-auto featured-courses xl:py-16 py-24">
            <div className="">
              <div className="absolute xl:h-24 xl:w-24 w-16 h-16 lg:right-32 right-2 md:mt-[4rem] mt-40">
                <Image
                  fill
                  style={{ objectFit: "contain" }}
                  alt=""
                  src="/featured vector2.png"
                />
              </div>
              <div className="sm:self-center sm:justify-self-center max-lg:mt-8 flex flex-col items-center justify-center text-center ml-10 max-lg:ml-16">
                <div className="flex">
                  <div className="relative lg:h-20 lg:w-20 w-16 h-16">
                    <Image
                      fill
                      style={{ objectFit: "contain" }}
                      alt=""
                      src="/featured vector.png"
                    />
                  </div>
                  <h3 className="font-indie mt-10 lg:text-6xl text-5xl font-extrabold text-white z-10 text-left">
                    {selectedLocale.featuredCourses.title}
                  </h3>
                </div>
                <div className="relative h-7 w-1/3 ml-10 -mt-3">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (3).png"
                  />
                </div>
              </div>
              <div className="flex justify-center lg:my-24 my-12 max-lg:mx-8 items-center gap-10 flex-wrap">
                <FeaturedCourseCard
                  course={exploreCoursesArray[0]}
                  selectedLocale={router}
                  titleColor="blue"
                />
                <FeaturedCourseCard
                  course={exploreCoursesArray[1]}
                  selectedLocale={router}
                  titleColor="orange"
                />
                <FeaturedCourseCard
                  course={exploreCoursesArray[2]}
                  selectedLocale={router}
                  titleColor="blue"
                />
              </div>
            </div>
          </section>
        )}
        {/* FAQ */}
        <section className="flex flex-col justify-center py-10 max-w-screen-2xl mx-auto px-10">
          <div className="flex flex-col sm:flex-row sm:mx-auto text-center ">
            <h3 className="font-indie font-extrabold text-5xl self-center z-10  ">
              {selectedLocale.sectionFiveTitle}
            </h3>
            <div className="relative h-56 w-56 sm:-ml-56 -mt-32 sm:-mt-0 self-center justify-self-center">
              <Image
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/Vector5.png"
              />
            </div>
          </div>
          {selectedLocale.sectionFiveComponents.map((faq, index) => (
            <div className="w-full sm:px-20">
              <div
                className="border-b border-black/25 p-4 cursor-pointer"
                onClick={() => {
                  setActive(active === index ? null : index);
                }}
              >
                <div className="flex justify-between w-full items-center">
                  <h3 className="text-xl w-11/12">{faq.question}</h3>
                  <svg
                    className={`w-6 h-6 fill-current text-yellow transform ${
                      active !== index ? "" : "rotate-180"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.32 2.929a1 1 0 0 1 1.414 1.414L10 12.586 2.293 4.883a1 1 0 1 1 1.414-1.414l6.293 6.293 6.293-6.293a1 1 0 0 1 1.414 0z"
                    />
                  </svg>
                </div>
                {index === 4 && (
                  <div
                    className={`transition-all duration-500 ease-in-out font-extralight mt-5 mr-20 ${
                      active === 4 ? "block" : "hidden"
                    }`}
                  >
                    <p>{selectedLocale.sectionFiveComponents[4].answer}</p>
                    <ul className="list-disc ml-10 my-3">
                      {selectedLocale.sectionFiveComponents[4].lists.map(
                        (v, i) => (
                          <li key={i}>{v}</li>
                        )
                      )}
                    </ul>
                    <p>{selectedLocale.sectionFiveComponents[4].answer2}</p>
                  </div>
                )}
                {index !== 4 && (
                  <p
                    className={`transition-all duration-500 ease-in-out font-extralight mt-5 mr-20 ${
                      active === index ? "block" : "hidden"
                    }`}
                  >
                    {faq.answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col justify-center md:py-10 py-0 max-w-screen-2xl mx-auto">
          <div className="mx-12 lg:mx-24">
            <div className="bg-purple flex flex-col rounded-lg items-center justify-center my-10 py-10 px-4 md:px-8 lg:px-24 text-center text-md lg:text-lg text-white relative">
              <div className="absolute md:w-20 md:h-20 w-10 h-10 top-0 left-0 transform -translate-x-1/3 -translate-y-1/2">
                <Image
                  fill
                  style={{ objectFit: "contain" }}
                  alt=""
                  src="/Vector (8).png"
                />
              </div>
              <div className="absolute md:w-20 md:h-20 w-10 h-10  bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
                <Image
                  fill
                  style={{ objectFit: "contain" }}
                  alt=""
                  src="/Vector (8).png"
                />
              </div>
              <p class="font-semibold">
                {selectedLocale.sectionSix.cardFourDesc}
              </p>{" "}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

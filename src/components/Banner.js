import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { usePostSuggestion } from "../hooks/usePostSuggestion";
import { useForm, Controller } from "react-hook-form";
import localeData from "../i18n/index.json";
export default function Banner() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocale, setselectedLocale] = useState(localeData.labels[0]);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { control, handleSubmit, reset } = useForm();
  const { postSuggestion } = usePostSuggestion();

  const submitSuggestion = async (data) => {
    // data now comes from the argument of this function
    console.log("Suggestion submitted:", data.suggestion);

    // Use postSuggestion to send the suggestion to the server
    const result = await postSuggestion({ suggestion: data.suggestion }); // make sure to send an object with a suggestion property

    toast("Suggestion submitted");
    reset();
    closeModal();

    // Check if the request was successful
    if (result.success) {
      // If successful, show a toast notification and close the modal
      toast.success("Suggestion sent successfully");
      reset();
      closeModal();
    } else {
      // If there was an error, show a toast notification with the error message
      toast.error(result.message);
    }
  };

  useEffect(() => {
    setselectedLocale(
      localeData.labels.filter((l) => l.locale === router.locale)[0]
    );
  }, [router.locale]);

  return (
    <>
      {bannerOpen && (
        <div className="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50">
          <div className="bg-yellow text-slate-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
            <div className="text-slate-500 inline-flex">
              <button
                className="font-medium cursor-pointer hover:underline text-black"
                onClick={openModal}
                target="_blank"
                rel="noreferrer"
              >
                {selectedLocale.banner.banner}
              </button>{" "}
            </div>
            <button
              className="text-slate-500 hover:text-slate-400 pl-2 ml-3 border-l border-gray-700"
              onClick={() => setBannerOpen(false)}
            >
              <span className="sr-only">
                {selectedLocale.banner.bannerClose}
              </span>
              <svg
                className="w-4 h-5 shrink-0 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="modal bg-white  p-6 rounded">
              <h2 className="text-lg font-bold mb-4 text-center">
                {selectedLocale.banner.suggestion}
              </h2>
              <p>{selectedLocale.banner.message}</p>
              <form onSubmit={handleSubmit(submitSuggestion)}>
                {/* handle form submission with handleSubmit */}
                <Controller
                  control={control}
                  name="suggestion"
                  render={({ field }) => (
                    <textarea
                      className="border border-gray-300 rounded p-2 mt-2 mb-4 w-full"
                      rows="4"
                      {...field} // spread field properties into textarea
                    />
                  )}
                />
                <div className="flex justify-center px-4">
                  <button
                    type="submit" // set type to "submit" to submit the form when this button is clicked
                    className="bg-yellow text-black font-bold py-2 px-4 rounded mx-auto block"
                  >
                    {selectedLocale.banner.send}
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-yellow text-black font-bold py-2 px-4 rounded mx-auto block"
                  >
                    {selectedLocale.banner.bannerClose}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

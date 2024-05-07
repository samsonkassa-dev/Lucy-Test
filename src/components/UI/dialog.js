import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePostBook } from "../../hooks/usePostBook";
import localFont from "next/font/local";

const MonoSans = localFont({
  src: "../../../public/font/MonoSans/Mona-Sans-Regular.woff2",
});
export default function Modal({ closeModal, isModalOpen }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { postBook } = usePostBook();
  const onSubmit = (data) => {
    toast
      .promise(postBook(data), {
        pending: "Sending...",
        success: "Success! We will contact you soon",
        error: "Something went wrong",
      })
      .then(() => {
        closeModal();
      });
  };

  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className={`text-md leading-6 text-gray-900 text-center
                                        text-lg md:text-2xl font-bold my-5
                                        ${MonoSans.className}
                                        `}
                  >
                    Book an orientation
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      className={`${MonoSans.className} mt-2 max-w-screen-md m-auto`}
                    >
                      <div className="flex flex-col items-start">
                        <label className="font-bold">Full Name</label>
                        <div className="flex flex-col w-full ">
                          <input
                            className=" border border-black/10 rounded p-2"
                            type="text"
                            placeholder="Full name"
                            {...register("FirstName", { required: true })}
                          />
                        </div>
                        <label className="font-bold mt-7">Email</label>
                        <div className="flex flex-col w-full ">
                          <input
                            className="border border-black/10 rounded p-2 w-full"
                            type="email"
                            placeholder="Email"
                            {...register("Email", { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button
                        type="submit"
                        className="mt-7 inline-flex justify-center rounded-md border border-transparent  bg-yellow px-5 py-3 text-sm font-bold text-black  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Book Now
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

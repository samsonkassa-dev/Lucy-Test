
import Image from "next/image";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";

export default function Canceled(props) {
    const router = useRouter();
    return (
        <>

            <div className="flex flex-col items-center pb-20 w-full h-[calc(100%_-_16rem)] justify-center ">

                <h3 className='font-indie font-extrabold text-4xl z-10 pt-20'>Canceled</h3>
                <div className="relative sm:w-1/6 w-1/3 h-5 -mt-4">
                    <Image fill
                        style={{ objectFit: "fill" }} alt="" src="/Vector (11).png" />
                </div>
                <p className="pt-10 pb-32 mx-10 text-center">
                    You have canceled the purchase. Please try again!
                </p>

                <div className='flex mx-auto  justify-center gap-x-32'>

                    <button type="button" onClick={() => { router.push('/') }}
                        className={`py-2 w-245 h-11 text-center font-bold   bg-yellow rounded-md focus:outline-none `}>
                        Retry
                    </button>
                </div>

            </div>
        </>

    );
}

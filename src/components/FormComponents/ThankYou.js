
import Image from "next/image";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";

export default function ThankYou(props) {
    const router = useRouter();
    const handleToken = (token) => {
        console.log(token);
    };
    return (
        <>
            <img src="/Group 38.png" alt="List icon" className="absolute w-0 h-0 -z-10 sm:w-2/5 sm:h-auto bottom-0 right-0 mt-1" />

            <div className="flex flex-col items-center  w-full h-[calc(100%_-_16rem)] justify-center ">
                {/* <StripeCheckout
                    stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                    token={handleToken}
                    amount={1000}
                    name="My Store"
                    description="Test Payment"
                    billingAddress={true}
                    zipCode={true}
                /> */}
                <img src="/Icon (3).png" alt="List icon" className="sm:my-10 my-5 pt-10" />
                <h3 className='font-indie font-extrabold text-4xl z-10'>Thank You</h3>
                <div className="relative sm:w-1/6 w-1/3 h-5 -mt-4">
                    <Image fill
                        style={{ objectFit: "fill" }} alt="" src="/Vector (11).png" />
                </div>
                <p className="py-5 mx-10 text-center">
                    Your receipt and confirmation details are waiting in your inbox.
                </p>
                <a className="pb-12 underline cursor-pointer"></a>

                <div className='flex mx-auto  justify-center gap-x-32'>

                    <button onClick={() => router.push("https://chat.whatsapp.com/LMUQpNewhYKL5El6LrLqAU")}
                        className={`py-2 w-245 h-11 text-center font-bold   bg-yellow rounded-md focus:outline-none disabled:cursor-not-allowed disabled:bg-yellow/40 `}>
                        Join our community
                    </button>
                </div>

            </div>
        </>

    );
}

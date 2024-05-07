

export default function Footer() {
    return (
        <>
            <section className='py-2 flex bg-black px-10 md:px-20 justify-between items-center'>
                <div className="flex sm:flex-row flex-col text-white uppercase sm:text-xs text-[0.5rem]">
                    <p className=''>© 2024 Lucy  &nbsp; - &nbsp;</p>
                    <span className="sm:mt-0 mt-1"><a target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:underline" href="https://app.termly.io/document/terms-of-service/0785e265-ff92-4227-894a-b00f7deb2b6b">Terms and Conditions</a> &nbsp; | &nbsp;</span>
                    <span className="sm:mt-0 mt-1"><a target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:underline" href="https://app.termly.io/document/privacy-policy/b71ad4f9-b77e-482c-a1e8-f060e0645f9f">Privacy Policy</a> &nbsp; | &nbsp;</span>
                    <span className="sm:mt-0 mt-1"><a target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:underline" href="https://drive.google.com/file/d/11tVg7KL4jXpWnFpIPbGvY2hSRv1jluoV/view?usp=sharing">Refund Policy</a></span>
                </div>
                <ul className="flex ">

                    <li className=" flex items-start ">
                        <a target="_blank" rel="noopener noreferrer" href='https://instagram.com/lucy__coding?igshid=ZGUzMzM3NWJiOQ=='>
                            <img src="/instagram (1).png" alt="Instagram" className="sm:mr-3 mr-1 w-6 sm:w-8" />

                        </a>
                    </li>

                    <li className=" flex items-start ">
                        <a target="_blank" rel="noopener noreferrer" href='https://www.facebook.com/lucycoding'>
                            <img src="/facebook (4).png" alt="Facebook" className="sm:mr-3 mr-1 w-6 sm:w-8" />

                        </a>
                    </li>
                    {/* <li className=" flex items-start ">
                        <a href='#'>
                            <img src="/twitter (1).png" alt="Twitter" className="sm:mr-3 mr-1 w-6 sm:w-8" />

                        </a>
                    </li> */}
                    <li className=" flex items-start ">
                        <a href='https://www.linkedin.com/company/lucycoding/'>
                            <img src="/linkedin (1).png" alt="LinkedIn" className="sm:mr-3 mr-1 w-6 sm:w-8" />

                        </a>
                    </li>
                </ul>
            </section>
        </>
    );
}

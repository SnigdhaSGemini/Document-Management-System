import {GiTeapotLeaves } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const PageNotFound = () =>{
    const navigate = useNavigate();

    return(<>
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50 px-2">

        {/* Icon */}
        <div className="mb-1">
            <GiTeapotLeaves className="h-16 w-16 text-gray-500 scale-x-[-1]" />
        </div>
        <h1 className="text-7xl font-semibold text-gray-800 tracking-tight">
            404
        </h1>
        <p className="text-xl font-medium text-gray-700 mt-2">
            Page Not Found
        </p>
        <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
            The page you are looking for does not exist or has been moved.
        </p>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-gray-300 my-5" />
        <button className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm 
            hover:bg-slate-700 transition cursor-pointer" onClick={() => {navigate("/dashboard")}}>
            Go to Dashboard
        </button>

    </div>

    </>);
};
export default PageNotFound;
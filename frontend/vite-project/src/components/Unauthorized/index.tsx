import { FiLock } from "react-icons/fi";

const Unauthorized = () => {
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50 px-2">

        {/* Icon */}
        <div className="mb-1">
          <FiLock className="h-16 w-16 text-gray-500" />
        </div>

        {/* Title */}
        <h1 className="text-7xl font-semibold text-gray-800 tracking-tight">
          403
        </h1>

        <p className="text-xl font-medium text-gray-700 mt-2">
          Unauthorized Access
        </p>

        <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
          You are not authorized to view this page. Please log in or contact the administrator.
        </p>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-gray-300 my-5" />

        <div className="flex gap-3">
          <a
            href="/sign-in"
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm 
            hover:bg-slate-700 transition"
          >
            Go to Login
          </a>
        </div>

      </div>
    </>
  );
};

export default Unauthorized;
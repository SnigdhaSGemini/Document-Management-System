import { Outlet } from "react-router-dom";
import { useLoader } from "../context/loaderContext";
import Loader from "../components/Loader";

const PublicRoutes = () =>{
    const {loading} = useLoader();

    if(loading) return <Loader/>
    return(<>
     <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[linear-gradient(to_bottom,#949498_0%,#74747a_35%,#55555c_60%,#30323a_85%,#1b1d22_100%)]">
        <div className="col-span-1 h-screen lg:col-span-2 w-full hidden md:flex justify-center items-center">
            <img alt="login_logo" src="./images/login.avif" className="h-[90%]"/>
        </div>
        <div className="col-span-1 md:rounded-l-4xl h-screen !bg-gray-100 p-4 flex items-center justify-center w-full">

            <div className="w-3/4 p-8 space-y-6">
               <Outlet />
            </div>
        </div>
    </div>
    </>);
};
export default PublicRoutes;
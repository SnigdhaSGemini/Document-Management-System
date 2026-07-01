import { MdOutlineArrowCircleRight, MdOutlinePostAdd, MdPending } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { FaFileCirclePlus, FaRegCircleCheck } from "react-icons/fa6";
import { HiDocumentCheck } from "react-icons/hi2";
import StatusChart from './../../components/Charts/StatusChart';
import DocumentsOverTime from './../../components/Charts/DocumentOverTimeChart';
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../context/loaderContext";
import { useEffect, useState } from "react";
import { getAllDocuments } from "../../api/services/documentService";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoader();
  const [documentDetails, setDocumentDetails] = useState<{ totalDocuments: number, approved: number, assignedDrafts: number, pendingReviews: number, recentlyAdded: number, rejected: number, reviewedDocuments: number, statusChart, documentsTimeGraph: []}>();
  const role = localStorage.getItem("role");

  const { startDate, endDate } = useSelector(
    (state: RootState) => state.dateRange
  );

  useEffect( () => {
    startLoading();
    const fetchDocuments = async () => {
        const response = await getAllDocuments({ startDate, endDate, type: "dashboard"}, false);

        if (response.success) {
          setDocumentDetails(response.data.data);
        }
        stopLoading();
      };

      fetchDocuments();

  },[startDate, endDate]);

  return (
    <>
      <div className="h-full w-full">
        <div className="mx-5 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* CARDS */}
          {role !== "reviewer" && (<>
          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-blue-100 hover:bg-blue-200 cursor-pointer transition`}
          onClick={()=> role === "user" ? navigate("/my-drafts") : navigate("/all-documents")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50">
              <IoDocumentText className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Total Documents</h1>
              <p className="text-slate-600">{documentDetails?.totalDocuments || 0}</p>
            </div>
          </div>

          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-violet-100 hover:bg-violet-200 ${role !== "admin" && "cursor-pointer"} transition`}
          onClick={()=> role === "user"  && navigate("/my-drafts")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-violet-50">
              <MdOutlinePostAdd className="h-6 w-6 text-violet-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Recently Added</h1>
              <p className="text-slate-600">{documentDetails?.recentlyAdded || 0}</p>
            </div>
          </div>
          </>)}

          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-green-100 hover:bg-green-200 ${role !== "admin" && "cursor-pointer"} transition`}
          onClick={()=> role !== "admin" && navigate(role === "user" ? "/review-outcomes" : "/reviewed-documents")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-50">
              <FaRegCircleCheck className="h-6 w-6 text-green-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Approved Documents</h1>
              <p className="text-slate-600">{documentDetails?.approved || 0}</p>
            </div>
          </div>

          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-red-100 hover:bg-red-200 ${role !== "admin" && "cursor-pointer"} transition`}
          onClick={()=>  role !== "admin" && navigate(role === "user" ? "/review-outcomes" : "/reviewed-documents")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50">
              <RxCrossCircled className="h-6 w-6 text-red-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Rejected Documents</h1>
              <p className="text-slate-600">{documentDetails?.rejected || 0}</p>
            </div>
          </div>

          {role !== "reviewer" && (<>
          
          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-amber-100 hover:bg-amber-200 ${role !== "admin" && "cursor-pointer"} transition`}
          onClick={()=>  role !== "admin" && navigate("/pending-reviews")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50">
              <MdPending className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Pending Reviews</h1>
              <p className="text-slate-600">{documentDetails?.pendingReviews || 0}</p>
            </div>
          </div></>)}

         {role !== "user" && (<>
          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-teal-100 hover:bg-teal-200 ${role !== "admin" && "cursor-pointer"} transition`}
          onClick={()=>  role !== "admin" && navigate("/assigned-drafts")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-50">
              <FaFileCirclePlus className="h-6 w-6 text-teal-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Assigned Drafts</h1>
              <p className="text-slate-600">{documentDetails?.assignedDrafts || 0}</p>
            </div>
          </div>

          <div className={`col-span-1 flex items-center gap-4 rounded-xl p-4 h-20 bg-pink-100 hover:bg-pink-200 ${role !== "admin" && "cursor-pointer"} transition`}
          onClick={()=>  role !== "admin" && navigate("/reviewed-documents")}>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-50">
              <HiDocumentCheck className="h-6 w-6 text-pink-800" />
            </div>
            <div>
              <h1 className="text-slate-800 font-semibold">Reviewed Documents</h1>
              <p className="text-slate-600">{documentDetails?.reviewedDocuments || 0}</p>
            </div>
          </div>
         </>)}
          </div>
          {/* CHARTS SECTION */}
        <div className="mx-5 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2 md:mt-4">
            <StatusChart values={documentDetails?.statusChart}/>
          </div>

          <div className="col-span-1 md:col-span-2 md:mt-4">
            <DocumentsOverTime data={documentDetails?.documentsTimeGraph}/>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;

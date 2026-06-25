import CreateDocumentForm from "./CreateDocumentForm";
import UploadDocument from "./UploadDocument";

const CreateDocument = () =>{
    return(<>
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 border-r-gray-300">
            <CreateDocumentForm/>
        </div>
        <div className="col-span-1 md:col-span-2">
            <UploadDocument/>
        </div>
    </div>
    </>);
};
export default CreateDocument;
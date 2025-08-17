import { useState } from "react"
import CollaborateModal from "./CollaborateModal";
import { HiUserGroup } from "react-icons/hi2";

const Collaborate = () => {

    const [showModal, setShowModal] = useState(false);

    return (

       <div className="flex items-center  justify-center bg-gray-400 rounded hover:bg-gray-300">
       <button className="p-2" onClick={() => setShowModal(true)}>
        <HiUserGroup />
       </button>
       {showModal && <CollaborateModal trigger={showModal} handleClose={() => setShowModal(false)} />}
       
       </div>   
    )
   
}


export default Collaborate
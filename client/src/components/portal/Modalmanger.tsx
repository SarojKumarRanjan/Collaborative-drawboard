import { useModalStore } from "@/store/Modal.store"
import { useEffect,useState } from "react";
import Portal from "./portal";
import { AnimatePresence, motion } from "motion/react";
import { bgAnimation, modalAnimation } from "@/animation";





const ModalManager = () => {

    const { modal, opened,closeModal } = useModalStore();

    const [portalNode,setPortalNode] = useState<HTMLElement>();


    useEffect(() => {
    if (!portalNode) {
        const portalElement = document.getElementById("portal");
        if (portalElement) {
            setPortalNode(portalElement);
        }
        return;
    }

   if(opened){
    portalNode.style.pointerEvents = "all";

   } else{
    portalNode.style.pointerEvents = "none";
   }



   
}
, [opened, portalNode]);

   return(
    <Portal>
    <motion.div
        className=" min-h-full w-full z-50 flex items-center justify-center bg-black/80"
        onClick={closeModal}
        variants={bgAnimation}
        initial="closed"
        animate={opened ? "opened" : "closed"}
    >
        <AnimatePresence>
      {
        opened && (
            <motion.div
                className="p-6"
                onClick={(e) => e.stopPropagation()}
                variants={modalAnimation}
                initial="closed"
                animate="opened"
                exit="exited"
            >
                {modal}
            </motion.div>
        )
      }
      </AnimatePresence>
    </motion.div>
    </Portal>
   )
}

export default ModalManager;
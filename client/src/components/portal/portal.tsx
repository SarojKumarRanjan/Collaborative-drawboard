import { useEffect, useState, type JSX } from "react";
import { createPortal } from "react-dom";



const Portal = ({children}: {children: JSX.Element | JSX.Element[]}) => {

    const [portal,setPortal] = useState<HTMLElement | null>(null);


    useEffect(() => {
        const portalElement = document.getElementById("portal");
        if (portalElement) {
            setPortal(portalElement);
        } else {
            const newPortal = document.createElement("div");
            newPortal.id = "portal";
            document.body.appendChild(newPortal);
            setPortal(newPortal);
        }

        return () => {
            if (portal) {
                portal.remove();
            }
        };
    }, [portal]);

    if (!portal) return null;

    return createPortal(children, portal);
}


export default Portal;
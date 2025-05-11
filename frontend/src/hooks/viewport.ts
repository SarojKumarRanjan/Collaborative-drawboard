

import { useState ,useEffect} from "react"

export const useViewportSize = () =>{

    const [height,setHeight] = useState(0);
    const [width,setwidth] = useState(0);


    useEffect(() =>{

        const sizeHandler = () =>{
             setHeight(window.innerHeight);
             setwidth(window.innerWidth)
        }

        window.addEventListener("resize",sizeHandler);
        sizeHandler();



        
      return() =>{
        window.removeEventListener("resize",sizeHandler)
      }




    },[])


    return {
        height,width
    }

}
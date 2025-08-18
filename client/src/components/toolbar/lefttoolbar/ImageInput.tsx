import Resizer from "react-image-file-resizer"
import refStore from "@/store/Refs.store";
import { BsImageFill } from "react-icons/bs";

const ImageInput = () => {

    const setMoveImage = refStore((state) => state.setMoveImage);
    const handleInput = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
           fileInput.accept = "image/*";
           fileInput.click()

           fileInput.addEventListener("change", (event) => {
               const file = (event.target as HTMLInputElement).files?.[0];
               if (file) {
                     Resizer.imageFileResizer(
                          file,
                          800,
                          800,
                          "WEBP",
                          100,
                          0,
                          (uri) => {
                            
                            setMoveImage(uri.toString())
                          },
                          "base64"
                     );
               }
           });
    }

    return (
        <button className="text-xl" onClick={handleInput}>
            <BsImageFill />
        </button>
    )
}

export default ImageInput;
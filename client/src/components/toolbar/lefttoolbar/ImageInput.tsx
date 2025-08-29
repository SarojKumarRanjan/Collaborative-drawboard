
import refStore from "@/store/Refs.store";
import { BsImageFill } from "react-icons/bs";
import { OptimizeImage } from "@/helpers/OptimizeImage";
import { useEffect } from "react";

const ImageInput = () => {
  const setMoveImage = refStore((state) => state.setMoveImage);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            if (file) {
              OptimizeImage(file, (uri) => {
                setMoveImage({base64: uri});
              });
            }
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  },[setMoveImage]);


  const handleInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        OptimizeImage(file, (uri) => {
          setMoveImage({base64: uri});
        });
      }
    });
  };

  return (
    <button className="text-xl" onClick={handleInput}>
      <BsImageFill />
    </button>
  );
};

export default ImageInput;

import FileResizer from "react-image-file-resizer"

export const OptimizeImage = (file:File,callback:(uri:string) => void) => {

FileResizer.imageFileResizer(
    file,
    700,
    700,
    "WEBP",
    100,
    0,
    (uri) => {
        callback(uri.toString());
    },
    "base64"
)
 
}
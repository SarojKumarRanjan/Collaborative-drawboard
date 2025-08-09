


import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";



 const  Toolbar = () => {




    return(
        <div>
            <div className="absolute top-20 left-4 z-50 flex flex-col gap-2">
                <ColorPicker />
                <LineWidthPicker />
            </div>
        </div>
    )
}

export default Toolbar;
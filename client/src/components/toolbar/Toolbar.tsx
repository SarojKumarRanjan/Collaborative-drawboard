


import ColorPicker from "./ColorPicker";



 const  Toolbar = () => {




    return(
        <div>
            <div className="absolute top-20 left-4 z-50 flex flex-col gap-2">
                <ColorPicker />
            </div>
        </div>
    )
}

export default Toolbar;
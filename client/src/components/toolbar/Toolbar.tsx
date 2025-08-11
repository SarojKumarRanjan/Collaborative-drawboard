


import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import UserList from "./UserList";



 const  Toolbar = () => {




    return(
        <div>
            <UserList />
            <div className="absolute top-40 left-4 z-50 flex flex-col gap-2  ">
                <ColorPicker />
                <LineWidthPicker />
            </div>
        </div>
    )
}

export default Toolbar;
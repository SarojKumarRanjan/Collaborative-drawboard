import { useOptions } from "@/store/Options";



 const  Toolbar = () => {

const setOptions = useOptions((state) => state.setOptions);



    return(
        <div className="absolute top-0 left-0 z-50 flex gap-5  bg-black text-white">
            <button
                className="p-2 hover:bg-gray-700"
                onClick={() => setOptions({ lineColor: '#171717' })}
            >
                Black
            </button>
            <button
                className="p-2 hover:bg-gray-700"
                onClick={() => setOptions({ lineColor: '#FF0000' })}
            >
                Red
            </button>
            <button
                className="p-2 hover:bg-gray-700"
                onClick={() => setOptions({ lineColor: '#00FF00' })}
            >
                Green
            </button>
            <button
                className="p-2 hover:bg-gray-700"
                onClick={() => setOptions({ lineColor: '#0000FF' })}
            >
                Blue
            </button>
            
        </div>
    )
}

export default Toolbar;
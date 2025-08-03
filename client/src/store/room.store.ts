
import { create } from 'zustand';

interface RoomStore {
    roomId: string;
    setRoomId: (roomId: string) => void;
    resetRoomId: () => void;
}

const roomStore = create<RoomStore>((set) => {
    return(
        {
            roomId: "",
            
            setRoomId: (roomId: string) => set({ roomId }),
            resetRoomId: () => set({ roomId: "" }),
        }
    )

})

export default roomStore;




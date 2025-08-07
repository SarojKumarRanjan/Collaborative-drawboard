
import { create } from 'zustand';

interface RoomStore {
    roomId: string;
    setRoomId: (roomId: string) => void;
    resetRoomId: () => void;
    users?: Map<string, Move[]>;
    movesWithoutUser?: Move[];
    myMoves?: Move[];
    setRoomUsers?:(userId:string) => void;
    removeRoomUser?: (userId: string) => void;
    setMovesWithoutUser?: (moves: Move[]) => void;
    setMyMoves?: (moves: Move[]) => void;
}

const roomStore = create<RoomStore>((set) => {
    return(
        {
            roomId: "",
            setRoomId: (roomId: string) => set({ roomId }),
            resetRoomId: () => set({ roomId: "" }),
            users: new Map<string, Move[]>(),
            movesWithoutUser: [],
            myMoves: [], 
            setRoomUsers: (userId: string) => set((state) => {
                const users = new Map(state.users);
                if (!users.has(userId)) {
                    users.set(userId, []);
                }
                return { users };
            }),
            removeRoomUser: (userId: string) => set((state) => {
                const users = new Map(state.users);
                users.delete(userId);
                const userMoves = users.get(userId);

                return { users,movesWithoutUser: userMoves ? [...(state.movesWithoutUser || []), ...userMoves] : state.movesWithoutUser };
            }),
            handleAddMoveTOUser: (userId: string, move: Move) => set((state) => {
                const users = new Map(state.users);
                if (users.has(userId)) {
                    const userMoves = users.get(userId) || [];
                    userMoves.push(move);
                    users.set(userId, userMoves);
                } else {
                    users.set(userId, [move]);
                }
                return { users };
            }),
           
            handleRemoveMoveFromUser: (userId: string) => set((state) => {
                const users = new Map(state.users);
                if (users.has(userId)) {
                    const userMoves = users.get(userId) || [];
                    if (userMoves.length > 0) {
                        userMoves.pop(); 
                        users.set(userId, userMoves);
                    }
                }
                return { users };
            }),

            handleMyMoves: (moves: Move) => set((state) => {
                const myMoves = state.myMoves ? [...state.myMoves, moves] : [moves];
                return { myMoves };
            }),

            handleRemoveMyMove: () => set((state) => {
                const myMoves = state.myMoves ? [...state.myMoves] : [];
                if (myMoves.length > 0) {
                    myMoves.pop(); 
                }
                return { myMoves };
            })
        }
    )

})

export default roomStore;




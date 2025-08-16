import { create } from "zustand";

export interface RoomStore {
  roomId: string;
  setRoomId: (roomId: string) => void;
  resetRoomId: () => void;
  usersMoves: Map<string, Move[]>;
  users: Map<string, string>;
  movesWithoutUser: Move[];
  myMoves: Move[];
  setRoomUsers: (userId: string, username: string) => void;
  removeRoomUser: (userId: string) => void;
  handleAddMoveToUser: (userId: string, move: Move) => void;
  handleRemoveMoveFromUser: (userId: string) => void;
  handleMyMoves: (moves: Move) => void;
  handleRemoveMyMove: () => void;
  handleSetMovesWithoutUser: (moves: Move[]) => void;
}

const roomStore = create<RoomStore>((set) => {
  return {
    roomId: "",
    setRoomId: (roomId: string) => set({ roomId }),
    resetRoomId: () => set({ roomId: "" }),
    usersMoves: new Map<string, Move[]>(),
    users:new Map<string,string>(),
    movesWithoutUser: [],
    myMoves: [],
    setRoomUsers: (userId: string, username: string) =>
      set((state) => {
        const usersMoves = new Map(state.usersMoves);
        const users = new Map(state.users);
        users.set(userId, username);
        if (!usersMoves.has(userId)) {
          usersMoves.set(userId, []);
        }
        return { usersMoves, users };
      }),
    removeRoomUser: (userId: string) =>
      set((state) => {
        const usersMoves = new Map(state.usersMoves);
        const users = new Map(state.users);
        users.delete(userId);
        const userMoves = usersMoves.get(userId);
        usersMoves.delete(userId);

        return {
          usersMoves,
          users,
          movesWithoutUser: userMoves
            ? [...(state.movesWithoutUser || []), ...userMoves]
            : state.movesWithoutUser,
        };
      }),
    handleAddMoveToUser: (userId: string, move: Move) =>
      set((state) => {
        const users = new Map(state.usersMoves);
        if (users.has(userId)) {
          const oldMoves = users.get(userId) || [];
          users.set(userId, [...oldMoves, move]);
        } else {
          users.set(userId, [move]);
        }
        return { usersMoves: users };
      }),

    handleRemoveMoveFromUser: (userId: string) =>
      set((state) => {
        const users = new Map(state.usersMoves);
        if (users.has(userId)) {
          const oldMoves = users.get(userId) || [];
            users.set(userId, oldMoves.slice(0, -1));
        }
        return { usersMoves: users };
      }),

    handleMyMoves: (moves: Move) =>
      set((state) => {
        const myMoves = state.myMoves ? [...state.myMoves, moves] : [moves];
         //console.log("My moves", myMoves);
        return { myMoves };
      }),

    handleRemoveMyMove: () =>
      set((state) => {
        const myMoves = state.myMoves ? [...state.myMoves] : [];
        //console.log(myMoves);
        
        if (myMoves.length > 0) {
          myMoves.pop();
        }
        return { myMoves };
      }),

    handleSetMovesWithoutUser: (moves: Move[]) =>
      set({ movesWithoutUser: moves }),

  };
});

export default roomStore;

import { create } from "zustand";

interface RoomStore {
  roomId: string;
  setRoomId: (roomId: string) => void;
  resetRoomId: () => void;
  users: Map<string, Move[]>;
  movesWithoutUser: Move[];
  myMoves: Move[];
  setRoomUsers: (userId: string) => void;
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
    users: new Map<string, Move[]>(),
    movesWithoutUser: [],
    myMoves: [],
    setRoomUsers: (userId: string) =>
      set((state) => {
        const users = new Map(state.users);
        if (!users.has(userId)) {
          users.set(userId, []);
        }
        return { users };
      }),
    removeRoomUser: (userId: string) =>
      set((state) => {
        const users = new Map(state.users);
        const userMoves = users.get(userId);
        users.delete(userId);

        return {
          users,
          movesWithoutUser: userMoves
            ? [...(state.movesWithoutUser || []), ...userMoves]
            : state.movesWithoutUser,
        };
      }),
    handleAddMoveToUser: (userId: string, move: Move) =>
      set((state) => {
        const users = new Map(state.users);
        if (users.has(userId)) {
          const oldMoves = users.get(userId) || [];
          users.set(userId, [...oldMoves, move]);
        } else {
          users.set(userId, [move]);
        }
        return { users };
      }),

    handleRemoveMoveFromUser: (userId: string) =>
      set((state) => {
        const users = new Map(state.users);
        if (users.has(userId)) {
          const oldMoves = users.get(userId) || [];
            users.set(userId, oldMoves.slice(0, -1));
        }
        return { users };
      }),

    handleMyMoves: (moves: Move) =>
      set((state) => {
        const myMoves = state.myMoves ? [...state.myMoves, moves] : [moves];
        return { myMoves };
      }),

    handleRemoveMyMove: () =>
      set((state) => {
        const myMoves = state.myMoves ? [...state.myMoves] : [];
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

import {create} from 'zustand';


interface SavedStore  {
    savedMoves: Move[];
    addSavedMove: (move: Move) => void;
    clearSavedMoves: () => void;
    removeSavedMoves : () => Move | undefined;
}

const useSavedMovesStore = create<SavedStore>((set) => ({   
  savedMoves: [],
  addSavedMove: (move:Move) => {
    if(move.options.mode==="select"){
      return;
    }

    return set((state) => ({
      savedMoves: [...state.savedMoves, move],
    }));
  },
  clearSavedMoves: () => set({ savedMoves: [] }),
  removeSavedMoves: () => {
    let move: Move | undefined;
    set((state) => {
        if(state.savedMoves.length === 0) return state;
      move = state.savedMoves[state.savedMoves.length - 1];
      return {
        savedMoves: state.savedMoves.slice(0, -1),
      };
    });
    return move;
  },
}));

export default useSavedMovesStore;

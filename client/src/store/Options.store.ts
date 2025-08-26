import { create } from 'zustand'



interface optionStore extends CtxOptions{

  setLineWidth:(width: number) => void;
  setLineColor:(color: string) => void;
  setMode: (mode: CtxMode) => void;
  setShape: (shape: Shape) => void;
  setSelection: (selection: { x: number; y: number; width: number; height: number } | null) => void;

}

const initialData = {
  lineColor: '#171717',
  lineWidth: 5,
  shape: "line" as Shape,
  mode: "draw" as CtxMode,
  selection: null,


}

export const optionStore = create<optionStore>((set) => ({
  ...initialData,
  setLineWidth: (width: number) => set((state) => ({ ...state, lineWidth: width })),
  setLineColor: (color: string) => set((state) => ({ ...state, lineColor: color })),
  setMode: (mode: CtxMode) => set((state) => ({ ...state, mode })),
  setShape: (shape: Shape) => set((state) => ({ ...state, shape })),
  setCircleRadius: (radius: number) => set((state) => ({ ...state, radius })),
  setRectHeight: (height: number) => set((state) => ({ ...state, height })),
  setRectWidth: (width: number) => set((state) => ({ ...state, width })),
  setSelection: (selection: { x: number; y: number; width: number; height: number } | null) => set((state) => ({ ...state, selection })),


}));


interface ColorStore{
  colorMap: Map<string, string>;
  setColor: (userId: string, color: string) => void;
  getColor: (userId: string) => string;
}

export const colorStore = create<ColorStore>((set, get) => ({
  colorMap: new Map(),
  setColor: (userId: string, color: string) => {
    const currentColors = get().colorMap;
    currentColors.set(userId, color);
    set({ colorMap: currentColors });
  },
  getColor: (userId: string) => {
    return get().colorMap.get(userId) || "#e0ffff"; 
  }
}));

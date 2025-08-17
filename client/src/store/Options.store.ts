import { create } from 'zustand'



interface optionStore extends CtxOptions{

  setLineWidth:(width: number) => void;
  setLineColor:(color: string) => void;
  setErase: (erase: boolean) => void;
  setShape: (shape: Shape) => void;

}

const initialData = {
  lineColor: '#171717',
  lineWidth: 5,
  shape: "line" as Shape,
  radius: 0,
  height: 0,
  width: 0


}

export const optionStore = create<optionStore>((set) => ({
  ...initialData,
  setLineWidth: (width: number) => set((state) => ({ ...state, lineWidth: width })),
  setLineColor: (color: string) => set((state) => ({ ...state, lineColor: color })),
  erase: false,
  setErase: (erase: boolean) => set((state) => ({ ...state, erase })),
   
  setShape: (shape: Shape) => set((state) => ({ ...state, shape })),
  setCircleRadius: (radius: number) => set((state) => ({ ...state, radius })),
  setRectHeight: (height: number) => set((state) => ({ ...state, height })),
  setRectWidth: (width: number) => set((state) => ({ ...state, width }))


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

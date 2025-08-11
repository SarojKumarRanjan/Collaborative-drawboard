import { create } from 'zustand'



interface optionStore extends CtxOptions{

  setLineWidth:(width: number) => void;
  setLineColor:(color: string) => void;

}

const initialData = {
  lineColor: '#171717',
  lineWidth: 5
}

export const optionStore = create<optionStore>((set) => ({
  ...initialData,
  setLineWidth: (width: number) => set((state) => ({ ...state, lineWidth: width })),
  setLineColor: (color: string) => set((state) => ({ ...state, lineColor: color })),
  
  
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

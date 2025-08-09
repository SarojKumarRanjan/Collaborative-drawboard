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

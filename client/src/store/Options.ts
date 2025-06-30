import { create } from 'zustand'



interface optionStore extends CtxOptions{
  setOptions:(options:Partial<CtxOptions>) => void
  resetOptions:() => void

}

const initialData = {
  lineColor: '#171717',
  lineWidth: 5
}

export const useOptions = create<optionStore>((set) => ({
  ...initialData,
  setOptions: (options) => set((state) => ({ ...state, ...options })),
  resetOptions: () => set(initialData)
}));

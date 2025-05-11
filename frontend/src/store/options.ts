import { create } from 'zustand'



export const useOptions = create<CtxOptions>(() => ({
  lineColor: '#171717',
  lineWidth: 5
}));

import { create } from 'zustand';

const useStore = create((set) => ({
  globalLang: 'cpp',
  setGlobalLang: (newGlobalLang) => set((state) => ({ globalLang: newGlobalLang })),
}));

export default useStore;
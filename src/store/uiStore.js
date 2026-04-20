import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toastMessage: null,
  toastType: 'error',
  showToast: (message, type = 'error') => {
    set({ toastMessage: message, toastType: type });
    // Esconder después de 4 segundos
    setTimeout(() => {
      set({ toastMessage: null });
    }, 4000);
  },
  hideToast: () => set({ toastMessage: null })
}));

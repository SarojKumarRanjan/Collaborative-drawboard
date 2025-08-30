import type { JSX } from "react";
import { create } from "zustand";

interface ModalStore {
  opened: boolean;
  modal: JSX.Element | JSX.Element[];
  setModal: (modal: JSX.Element | JSX.Element[]) => void;
  closeModal: () => void;
}

const modalStore = create<ModalStore>((set) => ({
  opened: false,
  modal: <></>,
  setModal: (modal: JSX.Element | JSX.Element[]) =>
    set({ opened: true, modal }),
  closeModal: () => set({ opened: false, modal: <></> }),
}));

export const useModalStore = modalStore;

import { create } from 'zustand';

export type ModalType =
  | 'addLocation'
  | 'editLocation'
  | 'addRoom'
  | 'editRoom'
  | 'addBooking';

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data?: any;
  onOpen: (type: ModalType, data?: {}) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: null,
  onOpen: (type, data = undefined) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false, data: null }),
}));

'use client';

import { useEffect, useState } from 'react';
import AddBookingModal from '../modals/add-booking-modal';
import AddLocationModal from '../modals/add-location-modal';
import AddRoomModal from '../modals/add-room-modal';
import EditLocationModal from '../modals/edit-location-modal';
import EditRoomModal from '../modals/edit-room-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AddLocationModal />
      <EditLocationModal />
      <AddRoomModal />
      <EditRoomModal />
      <AddBookingModal />
    </>
  );
};

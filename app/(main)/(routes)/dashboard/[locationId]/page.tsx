'use client';

import { getRooms } from '@/actions/getRooms';
import { useModal } from '@/hooks/use-modal-store';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';
import { useQuery } from 'react-query';

const LocationPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const params = useParams();

  const { onOpen, onClose } = useModal();

  const { data: res } = useQuery({
    queryKey: ['rooms', params.locationId],
    queryFn: ({ queryKey }) => getRooms(queryKey[1] as string),
    enabled: !!params.locationId,
  });

  useEffect(() => {
    if (res) {
      if (!!res.data.rooms.length) {
        onClose();
        router.push(`/dashboard/${params.locationId}/${res.data.rooms[0].id}`);
      } else {
        if (session?.user.role === 'admin') {
          onOpen('addRoom');
        }
      }
    }
  }, [onClose, onOpen, params.locationId, res, router, session]);

  if (session?.user.role !== 'admin') {
    return null;
  }

  return null;
};

export default memo(LocationPage);

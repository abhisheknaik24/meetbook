'use client';

import { getLocations } from '@/actions/getLocations';
import { useModal } from '@/hooks/use-modal-store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';
import { useQuery } from 'react-query';

const DashboardPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const { onOpen, onClose } = useModal();

  const { data: res } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  useEffect(() => {
    if (res) {
      if (!!res.data.locations.length) {
        onClose();
        router.push(`/dashboard/${res.data.locations[0].id}`);
      } else {
        if (session?.user.role === 'admin') {
          onOpen('addLocation');
        }
      }
    }
  }, [onClose, onOpen, res, router, session]);

  if (session?.user.role !== 'admin') {
    return null;
  }

  return null;
};

export default memo(DashboardPage);

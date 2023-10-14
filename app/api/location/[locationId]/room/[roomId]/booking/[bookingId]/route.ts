import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: { params: { locationId: string; roomId: string; bookingId: string } }
) {
  const { locationId, roomId, bookingId } = params;

  if (!locationId || !roomId || !bookingId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        locationId: locationId,
        roomId: roomId,
      },
    });

    if (!booking) {
      return NextResponse.json({
        status: false,
        message: 'Booking details not found!',
      });
    }

    return NextResponse.json({
      status: true,
      data: { booking: booking },
      message: 'Booking details fetched successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { locationId: string; roomId: string; bookingId: string } }
) {
  const { locationId, roomId, bookingId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      status: false,
      message: 'Session not found!',
    });
  }

  if (!locationId || !roomId || !bookingId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  try {
    let booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        locationId: locationId,
        roomId: roomId,
      },
    });

    if (!booking) {
      return NextResponse.json({
        status: false,
        message: 'Booking not found!',
      });
    }

    if (booking.isCalendarEvent) {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_GOOGLE_API}/calendar/v3/calendars/primary/events/${booking.eventId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!res.status) {
        throw new Error('Something went wrong!');
      }
    }

    booking = await prisma.booking.update({
      where: {
        id: bookingId,
        locationId: locationId,
        roomId: roomId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      status: true,
      data: { booking: booking },
      message: 'Booking deleted successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

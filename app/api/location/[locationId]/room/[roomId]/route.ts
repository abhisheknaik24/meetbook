import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { locationId: string; roomId: string };
  }
) {
  const { locationId, roomId } = params;

  if (!locationId || !roomId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  const currentDate = new Date();

  currentDate.setUTCHours(0, 0, 0, 0);

  const currentTime = new Date();

  currentTime.setUTCSeconds(0, 0);

  try {
    let room = await prisma.room.findUnique({
      where: {
        id: roomId,
        locationId: locationId,
      },
      include: {
        bookings: {
          where: {
            date: currentDate,
            OR: [
              {
                fromTime: {
                  gte: currentTime,
                },
              },
              {
                toTime: {
                  gte: currentTime,
                },
              },
            ],
            isActive: true,
          },
          include: {
            user: true,
          },
          orderBy: {
            fromTime: 'asc',
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({
        status: false,
        message: 'Room details not found!',
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        roomId: room.id,
        fromTime: {
          lte: currentTime,
        },
        toTime: {
          gte: currentTime,
        },
        isActive: true,
      },
    });

    if (!bookings.length) {
      Object.assign(room, { isAvailable: true });
    } else {
      Object.assign(room, { isAvailable: false });
    }

    return NextResponse.json({
      status: true,
      data: { room: room },
      message: 'Room details fetched successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { locationId: string; roomId: string } }
) {
  const { locationId, roomId } = params;

  const { title, capacity }: { title: string; capacity: number } =
    await req.json();

  if (!locationId || !roomId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  if (!title || capacity < 1) {
    return NextResponse.json({
      status: false,
      message: 'Request body is missing!',
    });
  }

  try {
    const roomExist = await prisma.room.findFirst({
      where: {
        locationId: locationId,
        title: title.toLowerCase(),
        isActive: true,
      },
    });

    if (roomExist) {
      return NextResponse.json({
        status: false,
        message: 'Room already exist!',
      });
    }

    const room = await prisma.room.update({
      where: {
        id: roomId,
        locationId: locationId,
      },
      data: {
        title: title.toLowerCase(),
        capacity: capacity,
      },
    });

    return NextResponse.json({
      status: true,
      data: { room: room },
      message: 'Room updated successfully!',
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
  { params }: { params: { locationId: string; roomId: string } }
) {
  const { locationId, roomId } = params;

  if (!locationId || !roomId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  try {
    const room = await prisma.room.update({
      where: {
        id: roomId,
        locationId: locationId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      status: true,
      data: { room: room },
      message: 'Room deleted successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

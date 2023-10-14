import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  const { locationId } = params;

  if (!locationId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  const currentTime = new Date();

  currentTime.setUTCSeconds(0, 0);

  try {
    let rooms = await prisma.room.findMany({
      where: {
        locationId: locationId,
        isActive: true,
      },
      include: {
        bookings: {
          where: {
            fromTime: {
              lte: currentTime,
            },
            toTime: {
              gte: currentTime,
            },
            isActive: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    rooms = rooms.map((room) => {
      if (!room.bookings.length) {
        Object.assign(room, { isAvailable: true });
      } else {
        Object.assign(room, { isAvailable: false });
      }
      return room;
    });

    return NextResponse.json({
      status: true,
      data: { rooms: rooms },
      message: 'Rooms fetched successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  const { locationId } = params;

  const { title, capacity }: { title: string; capacity: number } =
    await req.json();

  if (!locationId) {
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

    const room = await prisma.room.create({
      data: {
        locationId: locationId,
        title: title.toLowerCase(),
        capacity: capacity,
      },
    });

    return NextResponse.json({
      status: true,
      data: { room: room },
      message: 'Room added successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

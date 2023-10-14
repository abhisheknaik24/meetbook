import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
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
    const bookings = await prisma.booking.findMany({
      where: {
        locationId: locationId,
        roomId: roomId,
        isActive: true,
      },
    });

    return NextResponse.json({
      status: true,
      data: { bookings: bookings },
      message: 'Bookings fetched successfully!',
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
  { params }: { params: { locationId: string; roomId: string } }
) {
  const { locationId, roomId } = params;

  const {
    summary,
    description,
    date,
    fromTime,
    toTime,
    guests,
    isCalendarEvent,
  }: {
    summary: string;
    description: string | undefined;
    date: Date;
    fromTime: Date;
    toTime: Date;
    guests: string | undefined;
    isCalendarEvent: boolean;
  } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      status: false,
      message: 'Session not found!',
    });
  }

  if (!locationId || !roomId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  if (!summary || !date || !fromTime || !toTime) {
    return NextResponse.json({
      status: false,
      message: 'Request body is missing!',
    });
  }

  const timeZone = 'Asia/Kolkata';

  const parsedDate = new Date(date);

  parsedDate.setUTCHours(0, 0, 0, 0);

  const currentTime = new Date();

  currentTime.setUTCSeconds(0, 0);

  const parsedFromTime = new Date(fromTime);

  parsedFromTime.setUTCSeconds(0, 0);

  const parsedToTime = new Date(toTime);

  parsedToTime.setUTCSeconds(0, 0);

  if (parsedFromTime < currentTime || parsedToTime < currentTime) {
    return NextResponse.json({
      status: false,
      message: 'From and To time is less than current time!',
    });
  }

  const differenceTime = parsedToTime.getTime() - parsedFromTime.getTime();

  if (differenceTime < 60000) {
    return NextResponse.json({
      status: false,
      message: 'Atleast book room for more than one minute!',
    });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        locationId: locationId,
        roomId: roomId,
        AND: [
          {
            fromTime: {
              lt: parsedToTime,
            },
          },
          {
            toTime: {
              gt: parsedFromTime,
            },
          },
        ],
        isActive: true,
      },
    });

    if (!!bookings.length) {
      return NextResponse.json({
        status: false,
        message: 'The room has already book for this time.',
      });
    }

    let eventId: string | null = null;

    if (isCalendarEvent) {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_GOOGLE_API}/calendar/v3/calendars/primary/events`,
        {
          summary: summary,
          description: description || '',
          start: {
            dateTime: parsedFromTime.toISOString(),
            timeZone: timeZone,
          },
          end: {
            dateTime: parsedToTime.toISOString(),
            timeZone: timeZone,
          },
          attendees: guests
            ? guests.split(',').map((guest) => {
                return { email: guest };
              })
            : [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!res.status) {
        throw new Error('Something went wrong!');
      }

      eventId = res.data.id;
    }

    const booking: any = await prisma.booking.create({
      data: {
        userId: session.user.id,
        locationId: locationId,
        roomId: roomId,
        eventId: eventId,
        summary: summary.toLowerCase(),
        description: description,
        date: parsedDate,
        fromTime: parsedFromTime,
        toTime: parsedToTime,
        guests: guests,
        isCalendarEvent: isCalendarEvent,
      },
    });

    return NextResponse.json({
      status: true,
      data: { booking: booking },
      message: 'Booking added successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

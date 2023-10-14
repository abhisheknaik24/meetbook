import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const locations = await prisma.location.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      status: true,
      data: { locations: locations },
      message: 'Locations fetched successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

export async function POST(req: Request) {
  const { name }: { name: string } = await req.json();

  if (!name) {
    return NextResponse.json({
      status: false,
      message: 'Request body is missing!',
    });
  }

  try {
    const locationExist = await prisma.location.findFirst({
      where: {
        name: name.toLowerCase(),
        isActive: true,
      },
    });

    if (locationExist) {
      return NextResponse.json({
        status: false,
        message: 'Location already exist!',
      });
    }

    const location = await prisma.location.create({
      data: {
        name: name.toLowerCase(),
      },
    });

    return NextResponse.json({
      status: true,
      data: { location: location },
      message: 'Location added successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

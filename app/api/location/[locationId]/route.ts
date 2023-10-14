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

  try {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        rooms: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!location) {
      return NextResponse.json({
        status: false,
        message: 'location details not found!',
      });
    }

    return NextResponse.json({
      status: true,
      data: { location: location },
      message: 'Location details fetched successfully!',
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
  { params }: { params: { locationId: string } }
) {
  const { locationId } = params;

  const { name }: { name: string } = await req.json();

  if (!locationId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

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

    const location = await prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        name: name.toLowerCase(),
      },
    });

    return NextResponse.json({
      status: true,
      data: { location: location },
      message: 'Location updated successfully!',
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
  { params }: { params: { locationId: string } }
) {
  const { locationId } = params;

  if (!locationId) {
    return NextResponse.json({
      status: false,
      message: 'Request params is missing!',
    });
  }

  try {
    const location = await prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      status: true,
      data: { location: location },
      message: 'Location deleted successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

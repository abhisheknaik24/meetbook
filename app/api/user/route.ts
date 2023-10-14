import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    username,
    email,
    picture,
  }: { username: string; email: string; picture: string } = await req.json();

  if (!username && !email) {
    return NextResponse.json({
      status: false,
      message: 'Request body is missing!',
    });
  }

  const currentDate = new Date();

  try {
    const user = await prisma.user.upsert({
      create: {
        username: username,
        email: email,
        picture: picture,
        lastLogin: currentDate,
      },
      update: {
        lastLogin: currentDate,
      },
      where: {
        email: email,
      },
    });

    return NextResponse.json({
      status: true,
      data: { user: user },
      message: 'Login successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

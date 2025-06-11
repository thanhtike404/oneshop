import { NextResponse } from 'next/server';
import { prismaClient } from '@/lib/prismaClient'; // Your Prisma client

export async function POST(request: Request) {
  try {
    const { userId, title, body } = await request.json();

    // 1. Find the user's push token in your database
    const pushTokenRecord = await prismaClient.pushToken.findFirst({
      where: { userId: userId }, // Find the token belonging to this user
    });

    if (!pushTokenRecord) {
      return NextResponse.json({ error: 'Push token for this user not found.' }, { status: 404 });
    }

    const userPushToken = pushTokenRecord.token;

    // 2. Prepare the message for Expo's servers
    const message = {
      to: userPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: { someData: 'goes here' },
    };

    // 3. Send the notification
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
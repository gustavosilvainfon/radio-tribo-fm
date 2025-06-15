import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET', 
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
      RSS_FEED_URL: process.env.RSS_FEED_URL ? 'SET' : 'NOT SET',
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
    };

    return NextResponse.json({
      message: 'Debug info',
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug failed', details: String(error) },
      { status: 500 }
    );
  }
}
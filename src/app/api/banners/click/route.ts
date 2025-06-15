import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { AdBanner } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get('id');
    
    if (!bannerId) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }
    
    // Increment click count
    const banner = await AdBanner.findByIdAndUpdate(
      bannerId,
      { $inc: { clickCount: 1 } },
      { new: true }
    );
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Click registered',
      clickCount: banner.clickCount 
    });
  } catch (error) {
    console.error('Error registering click:', error);
    return NextResponse.json(
      { error: 'Failed to register click' },
      { status: 500 }
    );
  }
}
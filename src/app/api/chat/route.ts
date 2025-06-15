import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ChatMessage } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const messages = await ChatMessage.find({ isBlocked: false })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    // Reverse to show oldest first
    const reversedMessages = messages.reverse().map(msg => ({
      id: msg._id.toString(),
      username: msg.username,
      message: msg.message,
      timestamp: msg.timestamp,
      isBlocked: msg.isBlocked,
    }));
    
    return NextResponse.json(reversedMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Basic validation
    if (!body.username || !body.message) {
      return NextResponse.json(
        { error: 'Username and message are required' },
        { status: 400 }
      );
    }
    
    // Message length validation
    if (body.message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long' },
        { status: 400 }
      );
    }
    
    // Basic spam protection
    const recentMessages = await ChatMessage.find({
      username: body.username,
      timestamp: { $gte: new Date(Date.now() - 10000) }, // Last 10 seconds
    });
    
    if (recentMessages.length >= 3) {
      return NextResponse.json(
        { error: 'Too many messages sent recently. Please wait.' },
        { status: 429 }
      );
    }
    
    // Basic content filtering
    const bannedWords = ['spam', 'viagra', 'casino', 'porn'];
    const messageContent = body.message.toLowerCase();
    const containsBannedWord = bannedWords.some(word => 
      messageContent.includes(word)
    );
    
    const chatMessage = new ChatMessage({
      username: body.username,
      message: body.message,
      timestamp: new Date(),
      isBlocked: containsBannedWord,
    });
    
    await chatMessage.save();
    
    return NextResponse.json({
      id: chatMessage._id.toString(),
      username: chatMessage.username,
      message: chatMessage.message,
      timestamp: chatMessage.timestamp,
      isBlocked: chatMessage.isBlocked,
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json(
      { error: 'Failed to save chat message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    const message = await ChatMessage.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Message blocked successfully' });
  } catch (error) {
    console.error('Error blocking message:', error);
    return NextResponse.json(
      { error: 'Failed to block message' },
      { status: 500 }
    );
  }
}
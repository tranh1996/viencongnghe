import { NextRequest, NextResponse } from 'next/server';

interface MessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  department: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MessagePayload = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message', 'department'];
    for (const field of requiredFields) {
      if (!body[field as keyof MessagePayload] || body[field as keyof MessagePayload].trim() === '') {
        return NextResponse.json({
          success: false,
          status: 400,
          message: `Field '${field}' is required`,
          data: null
        }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: 'Invalid email format',
        data: null
      }, { status: 400 });
    }

    // Here you would typically:
    // 1. Save the message to a database
    // 2. Send email notifications
    // 3. Log the message for admin review
    
    // For now, we'll just log the message and return success
    console.log('New contact message received:', {
      timestamp: new Date().toISOString(),
      ...body
    });

    // Mock successful submission
    return NextResponse.json({
      success: true,
      status: 200,
      message: 'Message sent successfully',
      data: {
        id: Date.now(), // Mock message ID
        timestamp: new Date().toISOString(),
        ...body
      }
    });

  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}

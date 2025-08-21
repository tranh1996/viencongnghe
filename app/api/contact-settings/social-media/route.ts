import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const socialMedia = {
      facebook_link: "https://facebook.com/viencongnghe",
      instagram_link: "https://instagram.com/viencongnghe",
      linkedin_link: "https://linkedin.com/company/viencongnghe"
    };

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Social media links retrieved successfully",
      data: socialMedia
    });
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal server error",
      data: null
    }, { status: 500 });
  }
}

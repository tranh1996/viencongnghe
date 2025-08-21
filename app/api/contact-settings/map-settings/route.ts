import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mapSettings = {
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14897.912122570338!2d105.8113266!3d21.0135505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab6229494ac5%3A0x5ed48d45a299cd!2sTechnology%20Institute%20(MOIT)!5e0!3m2!1sen!2s!4v1683861112567!5m2!1sen!2s"
    };

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Map settings retrieved successfully",
      data: mapSettings
    });
  } catch (error) {
    console.error('Error fetching map settings:', error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal server error",
      data: null
    }, { status: 500 });
  }
}

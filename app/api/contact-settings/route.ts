import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data based on the provided API structure
    const contactSettings = {
      company_info: {
        company_name: "VIỆN CÔNG NGHỆ",
        company_subtitle: "Research Institute of Technology for Machinery",
        address_main: "Trụ sở chính: Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội",
        address_branch: "Cơ sở 2: Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội",
        email: "viencongnghe@ritm.vn",
        phone: "+84 243 776 3322",
        fax: "+84 243 835 9235"
      },
      social_media: {
        facebook_link: "https://facebook.com/viencongnghe",
        instagram_link: "https://instagram.com/viencongnghe",
        linkedin_link: "https://linkedin.com/company/viencongnghe"
      },
      map_settings: {
        google_map_embed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14897.912122570338!2d105.8113266!3d21.0135505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab6229494ac5%3A0x5ed48d45a299cd!2sTechnology%20Institute%20(MOIT)!5e0!3m2!1sen!2s!4v1683861112567!5m2!1sen!2s"
      }
    };

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Contact settings retrieved successfully",
      data: contactSettings
    });
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal server error",
      data: null
    }, { status: 500 });
  }
}

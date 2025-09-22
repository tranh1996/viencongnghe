import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const companyInfo = {
      company_name: "VIỆN CÔNG NGHỆ",
      company_subtitle: "Institute of Technology",
      address_main: "Trụ sở chính: Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội",
      address_branch: "Cơ sở 2: Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội",
      email: "viencongnghe@ritm.vn",
      phone: "+84 243 776 3322",
      fax: "+84 243 835 9235"
    };

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Company information retrieved successfully",
      data: companyInfo
    });
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal server error",
      data: null
    }, { status: 500 });
  }
}

import type { Metadata } from 'next';
import DepartmentDetail from '@/components/DepartmentDetail';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface DepartmentPageProps {
  params: {
    departmentSlug: string;
  };
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  // You can fetch department data here to generate dynamic metadata
  const departmentSlug = params.departmentSlug;

  return {
    title: `Phòng ban - Viện Công nghệ (RITM)`,
    description: `Thông tin chi tiết về phòng ban ${departmentSlug} của Viện Công nghệ (RITM).`,
    openGraph: {
      title: `Phòng ban - Viện Công nghệ (RITM)`,
      description: `Thông tin chi tiết về phòng ban ${departmentSlug} của Viện Công nghệ (RITM).`,
    },
  };
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  return <DepartmentDetail departmentSlug={params.departmentSlug} />;
}

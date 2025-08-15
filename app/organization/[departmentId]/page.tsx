import type { Metadata } from 'next';
import DepartmentDetail from '@/components/DepartmentDetail';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface DepartmentPageProps {
  params: {
    departmentId: string;
  };
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  // You can fetch department data here to generate dynamic metadata
  const departmentId = params.departmentId;

  return {
    title: `Phòng ban - Viện Công nghệ (RITM)`,
    description: `Thông tin chi tiết về phòng ban ${departmentId} của Viện Công nghệ (RITM).`,
    openGraph: {
      title: `Phòng ban - Viện Công nghệ (RITM)`,
      description: `Thông tin chi tiết về phòng ban ${departmentId} của Viện Công nghệ (RITM).`,
    },
  };
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  return <DepartmentDetail departmentId={params.departmentId} />;
}

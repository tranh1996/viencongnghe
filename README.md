# Viện Công nghệ - Website Chính thức

Website chính thức của Viện Công nghệ (RITM) - Research Institute of Technology for Machinery, được xây dựng bằng React và TypeScript.

## Giới thiệu

Viện Công nghệ (RITM) là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa các sản phẩm nhập khẩu.

## Tính năng

- **Trang chủ**: Giới thiệu tổng quan về Viện Công nghệ
- **Về chúng tôi**: Thông tin chi tiết về lịch sử, sứ mệnh và tầm nhìn
- **Lĩnh vực hoạt động**: Các dịch vụ và chuyên môn của viện
- **Sản phẩm & Dịch vụ**: Danh mục sản phẩm và dịch vụ cung cấp
- **Tin tức**: Cập nhật tin tức mới nhất về hoạt động của viện
- **Thư viện**: Hình ảnh và video hoạt động
- **Liên hệ**: Thông tin liên hệ và form liên hệ

## Công nghệ sử dụng

- **React 19**: Framework JavaScript cho giao diện người dùng
- **TypeScript**: Ngôn ngữ lập trình type-safe
- **Bootstrap 5**: Framework CSS cho responsive design
- **React Router**: Routing cho ứng dụng React
- **Bootstrap Icons**: Thư viện icon

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

### Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd vien-cong-nghe-react
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng ở môi trường development:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production

```bash
npm run build
```

### Chạy build production

```bash
npm run serve
```

## Cấu trúc thư mục

```
src/
├── components/          # Các component chung
│   ├── Header.tsx      # Header component
│   └── Footer.tsx      # Footer component
├── pages/              # Các trang của ứng dụng
│   ├── Home.tsx        # Trang chủ
│   ├── About.tsx       # Về chúng tôi
│   ├── Services.tsx    # Lĩnh vực hoạt động
│   ├── Products.tsx    # Sản phẩm & Dịch vụ
│   ├── Blog.tsx        # Tin tức
│   ├── Library.tsx     # Thư viện
│   └── Contact.tsx     # Liên hệ
├── assets/             # Tài nguyên tĩnh
│   └── css/
│       └── labozu.css  # CSS chính
└── App.tsx             # Component chính
```

## Thông tin liên hệ

- **Trụ sở chính**: Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội
- **Cơ sở 2**: Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội
- **Điện thoại**: +84 243 776 3322
- **Email**: viencongnghe@ritm.vn
- **Website**: https://viencongnghe.com/

## Lĩnh vực hoạt động

1. **Công nghệ đúc và vật liệu mới**
2. **Công nghệ xử lý nhiệt**
3. **Cơ khí chế tạo khuôn mẫu**
4. **Kiểm định vật liệu**
5. **Chuyển giao thiết bị/công nghệ**
6. **Đào tạo, tư vấn công nghệ**

## Giấy phép

Dự án này được phát hành dưới giấy phép MIT.

## Đóng góp

Mọi đóng góp đều được chào đón. Vui lòng tạo issue hoặc pull request để đóng góp vào dự án. 
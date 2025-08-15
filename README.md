# Viện Công nghệ (RITM) - Next.js Website

Website chính thức của Viện Công nghệ (RITM) - Research Institute of Technology for Machinery, được xây dựng với Next.js 14 và App Router.

## 🚀 Tính năng

- **Next.js 14** với App Router
- **TypeScript** cho type safety
- **Bootstrap 5** cho UI components
- **Server-Side Rendering (SSR)** cho SEO tốt hơn
- **Image Optimization** với Next.js Image
- **Internationalization** (Tiếng Việt/English)
- **Responsive Design**
- **Google Analytics 4** integration
- **SEO Optimization**

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: Bootstrap Icons
- **Analytics**: Google Analytics 4
- **Package Manager**: npm
- **Deployment**: Vercel (recommended)

## 📦 Cài đặt

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd viencongnghe
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Chạy development server**:
   ```bash
   npm run dev
   ```

4. **Mở trình duyệt**:
   ```
   http://localhost:3000
   ```

## 📦 NPM Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate sitemap
npm run generate-sitemap
```

## 🏗️ Cấu trúc dự án

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── products/          # Products page
│   ├── organization/      # Organization pages
│   ├── library/           # Library page
│   ├── blog/              # Blog page
│   ├── contact/           # Contact page
│   ├── loading.tsx        # Loading component
│   ├── error.tsx          # Error component
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── assets/            # Static assets
├── public/                # Public assets
└── scripts/               # Build scripts
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push code lên GitHub**
2. **Connect với Vercel**:
   - Import project từ GitHub
   - Vercel sẽ tự động detect Next.js
   - Deploy với cấu hình mặc định

### Manual Deployment

1. **Build project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env.local`:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# SEO Configuration
NEXT_PUBLIC_SITE_URL=https://viencongnghe.ritm.vn
```

### SEO Configuration

SEO được cấu hình trong `app/layout.tsx` và từng page với metadata API của Next.js.

## 📱 Responsive Design

Website được thiết kế responsive với Bootstrap 5:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Internationalization

Website hỗ trợ 2 ngôn ngữ:
- **Tiếng Việt** (mặc định)
- **English**

Language switching được implement với React Context.

## 📊 Analytics

Google Analytics 4 được tích hợp sẵn:
- Page views tracking
- Custom events tracking
- Performance monitoring

## 🔍 SEO Features

- **Meta tags** optimization
- **Open Graph** tags
- **Twitter Cards**
- **Structured data** (JSON-LD)
- **Sitemap** generation
- **Robots.txt** configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint

# Generate sitemap
npm run generate-sitemap
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Viện Công nghệ (RITM)**
- **Website**: https://viencongnghe.ritm.vn
- **Email**: viencongnghe@ritm.vn
- **Phone**: +84 243 776 3322
- **Address**: Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội

---

**Developed with ❤️ by Viện Công nghệ Team** 
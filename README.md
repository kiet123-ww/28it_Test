# 28ITjobs Automation Test Project

Dự án này chứa bộ mã nguồn kiểm thử tự động (Automation Test) cho hệ thống **28ITjobs** sử dụng **Playwright**.
Dự án được cấu trúc theo mô hình **Page Object Model (POM)** để dễ dàng mở rộng và bảo trì. Các kịch bản kiểm thử được thiết kế dựa trên kỹ thuật **Phân vùng tương đương (Equivalence Partitioning - EP)** và **Phân tích giá trị biên (Boundary Value Analysis - BVA)**, nhắm tới việc kiểm thử hộp đen.

## Cấu trúc thư mục

```text
28itjobs-automation-test/
├── pages/                  # Page Object Model (Định nghĩa các elements và actions trên từng trang)
│   ├── BasePage.ts         # Class cơ sở chứa các hàm tiện ích chung
│   ├── LoginPage.ts        # Page object cho trang Đăng nhập
│   └── RegisterPage.ts     # Page object cho trang Đăng ký
├── tests/                  # Các file kịch bản kiểm thử (Test Scripts)
│   ├── auth.spec.ts        # Kịch bản test Login / Register
│   ├── candidate.spec.ts   # Kịch bản test khu vực Candidate Dashboard
│   └── job.spec.ts         # Kịch bản test tìm kiếm & xem chi tiết công việc
├── test-data/              # Chứa các file data test (JSON, CSV)
├── .env                    # File chứa các biến môi trường cục bộ
├── playwright.config.ts    # Cấu hình Playwright (browsers, timeout, retries...)
├── package.json            # Quản lý dependencies (Playwright, Dotenv...)
└── README.md               # Tài liệu hướng dẫn sử dụng
```

## Yêu cầu môi trường
- **Node.js**: Phiên bản LTS mới nhất (v18 trở lên).
- **Trình duyệt**: Hệ thống sẽ tự động tải các trình duyệt cần thiết khi cài đặt Playwright.

## Cài đặt

1. Cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```
2. Cài đặt các trình duyệt cho Playwright (nếu chưa cài):
   ```bash
   npx playwright install --with-deps
   ```

## Biến môi trường
Tạo file `.env` tại thư mục gốc (không commit file này lên Git) và thêm cấu hình:
```env
BASE_URL=http://localhost:3000
```
> **Lưu ý**: Đảm bảo dự án Frontend `my-fronted` của bạn đang chạy ở cổng 3000 và Backend `my-backend` chạy ở cổng 4000 trước khi thực thi test để đạt kết quả chính xác nhất.

## Hướng dẫn chạy test

Chạy toàn bộ các test cases trên chế độ không giao diện (headless):
```bash
npm run test
```

Chạy test có hiển thị giao diện trình duyệt (headed):
```bash
npm run test:headed
```

Mở giao diện UI của Playwright để chạy từng test một cách trực quan:
```bash
npm run test:ui
```

Xem báo cáo kết quả test sau khi chạy:
```bash
npm run report
```

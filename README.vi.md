*Ngôn ngữ: [English](README.md) | [Tiếng Việt](README.vi.md)*

**Menu**: [Trang chủ](README.vi.md) | [Cài đặt](docs/setup.vi.md) | [HDSD](docs/user-guide.vi.md) | [Kiến trúc](docs/architecture.vi.md) | [API Contract](docs/api-contract.vi.md) | [Triển khai](docs/deployment.vi.md)

---

# 📘 Debt Reminder System (Hệ thống Báo Nợ Tự Động)

![Project Status](https://img.shields.io/badge/Status-Production_Ready-success) ![Cloudflare](https://img.shields.io/badge/Platform-Cloudflare-F38020) ![License](https://img.shields.io/badge/License-MIT-blue)

<p align="center">
  <img src="./docs/assets/dashboard.png" alt="Dashboard Mockup" width="800">
</p>

Chào mừng bạn đến với **Debt Reminder System** – Hệ thống quản lý và tự động nhắc nhở công nợ chuyên nghiệp, được thiết kế với tiêu chí **Zero-Ops (Không cần máy chủ)** và **Miễn phí 100%** trên hạ tầng Cloudflare. 

Hệ thống này sinh ra để giải phóng bạn khỏi việc phải nhớ ngày đáo hạn và nhắn tin đòi nợ thủ công. Mọi thứ từ gửi Email nhắc nhở đến thống kê nợ đều diễn ra hoàn toàn tự động.

---

## 🌟 Chức năng nổi bật
1. **Quản lý Khách hàng (Customers)**: Lưu trữ thông tin khách hàng, số điện thoại, email.
2. **Quản lý Nợ (Receivables)**: Tạo các khoản phải thu, gán cho khách hàng, thiết lập ngày đến hạn (Due Date) và số tiền.
3. **Mẫu Thư Nhắc Nợ (Templates)**: Viết sẵn các mẫu thư đòi nợ (thân thiện, dọa dẫm, cảnh báo...) để gửi tự động.
4. **Luật Nhắc Tự Động (Rules)**: Thiết lập luật (Ví dụ: Tự động gửi "Thư cảnh báo" trước ngày đến hạn 3 ngày). Hệ thống tự quét và gửi email mỗi 15 phút.
5. **Dashboard Thống kê**: Xem tổng quan khoản nợ, doanh thu, thư đã gửi.

---

## 📚 Tài Liệu Chi Tiết (Dành cho mọi đối tượng)

Chúng tôi đã viết sẵn các tài liệu cực kỳ chi tiết, cầm tay chỉ việc từ A-Z. **Ngay cả khi bạn không biết lập trình, bạn vẫn có thể cài đặt và sử dụng thành thạo!**

👉 **[1. Hướng Dẫn Sử Dụng Hệ Thống (Dành cho Người dùng)](./docs/user-guide.md)**
👉 **[2. Hướng Dẫn Cài Đặt Chạy Thử Máy Cánh Nhân (Local Setup)](./docs/setup.md)**
👉 **[3. Hướng Dẫn Đưa Lên Mạng Cloudflare (Deployment)](./docs/deployment.md)**
👉 **[4. Cấu Trúc Hệ Thống (Dành cho Kỹ Sư)](./docs/architecture.md)**

---

## 🚀 Hướng Dẫn Nhanh: 3 Bước Khởi Động

Nếu bạn chỉ muốn mở lên và xem thử hệ thống có gì, hãy làm đúng 3 bước sau:

**Bước 1: Tải hệ thống về máy**
Mở phần mềm Terminal (Mac) hoặc Command Prompt (Windows) và gõ:
```bash
git clone <đường-dẫn-chứa-code-này>
cd debt-reminder-system
```

**Bước 2: Cài đặt tự động**
(Yêu cầu máy bạn đã cài sẵn `Node.js` và `pnpm`). Chỉ cần gõ lệnh sau, hệ thống sẽ tự tải thư viện và xây dựng Database giả lập:
```bash
pnpm run setup:local
```

**Bước 3: Khởi động hệ thống**
Gõ lệnh này để bật máy chủ:
```bash
pnpm dev
```
Sau đó, hãy mở trình duyệt web và truy cập: **[http://localhost:5173](http://localhost:5173)**
- **Tài khoản**: `admin@example.com`
- **Mật khẩu**: `admin123`

---

## 🛠 Nền tảng công nghệ sử dụng
Hệ thống sử dụng các công nghệ hiện đại nhất năm 2024:
- **Cloudflare D1**: Cơ sở dữ liệu siêu tốc, miễn phí.
- **Cloudflare Workers**: Trái tim của hệ thống API và tính năng quét hẹn giờ (Cronjob).
- **Cloudflare Pages**: Nơi chứa giao diện trang web (React / Vite).
- **Resend API**: Dịch vụ chuyên gửi Email tự động vào hộp thư chính (không bị vào Spam).
- **Monorepo (pnpm)**: Cấu trúc mã nguồn chuyên nghiệp, dễ bảo trì.

*Dự án này được tối ưu cực độ để không bao giờ vượt qua Giới hạn Miễn Phí (Free Tier) của Cloudflare (Lên tới 100,000 lượt thao tác dữ liệu mỗi ngày!)*

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
debt-reminder-system/
├── apps/
│   ├── api/           # Backend API chạy trên Cloudflare Worker (Hono + D1)
│   └── web/           # Giao diện Frontend React + Vite (Cloudflare Pages)
├── packages/
│   ├── db/            # Lớp xử lý Database & Drizzle ORM
│   ├── core/          # Lõi xử lý nghiệp vụ, gửi Email, xử lý Cronjob
│   └── shared/        # Các định dạng chuẩn (Zod schemas) dùng chung
├── docs/              # Tài liệu hướng dẫn chi tiết
└── .github/workflows/ # Cấu hình GitHub Actions để Tự động hóa Deploy
```

---

## 🔐 Biến Môi Trường (Environment Variables)
Trong file `apps/api/.dev.vars` (khi chạy ở máy) hoặc cấu hình Secret trên Cloudflare (khi lên mạng), bạn cần nhập:

| Biến số (Variable) | Mô tả (Description) | Ví dụ (Example) |
|---|---|---|
| `AUTH_SECRET` | Khóa bí mật dùng để mã hóa và bảo vệ tài khoản đăng nhập. | `chuoi_mat_khau_bi_mat_123` |
| `RESEND_API_KEY` | Mã API lấy từ Resend.com để hệ thống có quyền gửi email thật. | `re_123456789_xxxxxxxx` |

---

## 🤝 Đóng Góp (Contributing)
Mọi đóng góp, báo lỗi (issues), và yêu cầu tính năng mới đều được chào đón!
Vui lòng kiểm tra trang [issues](https://github.com/dangvo/debt-reminder-system/issues) nếu bạn muốn đóng góp cho dự án.

1. Fork dự án này
2. Tạo nhánh tính năng mới (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi của bạn (`git commit -m 'Them TinhNangMoi'`)
4. Push lên nhánh (`git push origin feature/TinhNangMoi`)
5. Tạo một Pull Request

---

## 👤 Tác Giả (Author)
**Đăng Võ (Dang Vo)**
- Github: [@dangvo](https://github.com/dangvo)
- Link Dự án: [https://github.com/dangvo/debt-reminder-system](https://github.com/dangvo/debt-reminder-system)

---

## 📝 Bản Quyền (License)
Dự án này được cấp phép theo [Giấy phép MIT](https://opensource.org/licenses/MIT). 
Bạn được hoàn toàn tự do sử dụng, chỉnh sửa và phân phối lại mã nguồn này cho cả mục đích cá nhân lẫn thương mại.

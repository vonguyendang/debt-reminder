# 💻 Hướng Dẫn Cài Đặt Cá Nhân (Local Setup)

Tài liệu này dành cho người muốn chạy thử hệ thống trên chính máy tính của mình (không tốn tiền, không cần mạng internet phức tạp).

Thực hiện theo từng bước chậm rãi và cẩn thận dưới đây. Đừng bỏ sót bước nào nhé!

---

## Giai đoạn 1: Chuẩn bị vũ khí (Cài đặt môi trường)
Bạn cần tải 2 phần mềm này về máy tính nếu chưa có:
1. **Node.js (Phiên bản 20 trở lên)**: Đây là động cơ để chạy code. 
   👉 Link tải: [https://nodejs.org/](https://nodejs.org/) (Chọn bản LTS - Bản ổn định).
2. **pnpm**: Bộ công cụ giúp tải thư viện cực nhanh.
   👉 Sau khi cài Node.js xong, mở `Terminal` (hoặc `CMD` trên Windows) và gõ: 
   `npm install -g pnpm`

---

## Giai đoạn 2: Lấy Code về máy
Mở Terminal (hoặc CMD), di chuyển đến thư mục bạn muốn lưu dự án, sau đó gõ:
```bash
git clone https://github.com/<ten-cua-ban>/debt-reminder-system.git
cd debt-reminder-system
```
*(Nếu bạn đã có sẵn code trong máy thì chỉ cần mở Terminal tại thư mục `debt-reminder-system` là được).*

---

## Giai đoạn 3: Cấu hình chìa khóa (Secret Keys)
Hệ thống cần 2 chiếc chìa khóa để hoạt động: 1 chiếc để bảo mật đăng nhập, 1 chiếc để gửi email.

1. Vào thư mục `apps/api`.
2. Bạn sẽ thấy một file tên là `.dev.vars.example`. Hãy copy (nhân bản) file này ra và đổi tên bản sao thành `.dev.vars`.
3. Mở file `.dev.vars` bằng ứng dụng Note/TextEditor bất kỳ, bạn sẽ thấy:
   ```env
   AUTH_SECRET=chuoi_ky_tu_bi_mat_bat_ky_cua_ban
   RESEND_API_KEY=re_123456789_xxxxxxxxxxxxxxxxx
   ```
4. **AUTH_SECRET**: Xóa chữ đi và gõ bừa một chuỗi khó đoán (ví dụ: `con_meo_nhay_qua_hang_rao_123`). Chuỗi này dùng để mã hóa mật khẩu đăng nhập.
5. **RESEND_API_KEY**: Nếu bạn chỉ muốn xem giao diện mà chưa cần gửi email thật, hãy để trống hoặc điền bừa. Nếu bạn muốn hệ thống gửi email thật, hãy lên trang [https://resend.com](https://resend.com), tạo tài khoản miễn phí, lấy mã API Key và dán vào đây.

---

## Giai đoạn 4: Phép màu tự động cài đặt
Chúng tôi đã gói gọn việc tạo database, nhồi dữ liệu mẫu, tải thư viện chỉ trong **MỘT LỆNH DUY NHẤT**.

Quay lại màn hình Terminal (đang ở thư mục gốc `debt-reminder-system`), gõ:
```bash
pnpm run setup:local
```
Ngồi chờ khoảng 30 giây đến 1 phút. Hệ thống sẽ tự làm mọi thứ!

---

## Giai đoạn 5: Khởi động Động cơ
Gõ lệnh này để chính thức bật máy chủ web:
```bash
pnpm dev
```
Bạn sẽ thấy màn hình Terminal báo chữ xanh rực rỡ, hiển thị 2 đường link. 
- Mọi thứ đã hoàn tất! Hãy mở trình duyệt (Google Chrome) và vào đường link: **[http://localhost:5173](http://localhost:5173)**
- Đăng nhập bằng: `admin@example.com` / `admin123`.

*(Để tắt máy chủ, bạn quay lại Terminal và bấm tổ hợp phím `Ctrl + C`)*.

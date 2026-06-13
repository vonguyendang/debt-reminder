*Ngôn ngữ: [English](deployment.md) | [Tiếng Việt](deployment.vi.md)*

**Menu**: [Trang chủ](../README.vi.md) | [Cài đặt](setup.vi.md) | [HDSD](user-guide.vi.md) | [Kiến trúc](architecture.vi.md) | [API Contract](api-contract.vi.md) | [Triển khai](deployment.vi.md)

---

# 🌐 Hướng Dẫn Đưa Lên Mạng (Deployment)

Đây là tài liệu hướng dẫn cách đưa hệ thống của bạn lên Internet thực sự thông qua **Cloudflare** hoàn toàn MIỄN PHÍ. 

Hệ thống được thiết kế theo cơ chế **Zero-Ops**, nghĩa là một khi đã cài đặt xong, bạn chỉ việc gõ code và bấm Push lên GitHub, hệ thống sẽ **TỰ ĐỘNG** cập nhật bản mới nhất lên mạng mà bạn không cần phải làm gì thêm!

---

## Bước 1: Chuẩn bị tài khoản
Bạn cần 2 tài khoản miễn phí:
1. **GitHub**: Nơi chứa mã nguồn (code) của bạn.
2. **Cloudflare**: Nơi chạy hệ thống của bạn.

---

## Bước 2: Tạo Cơ Sở Dữ Liệu trên Cloudflare (D1)
Cơ sở dữ liệu (Database) là nơi lưu trữ thông tin khách hàng, nợ nần. Chúng ta sẽ tạo nó trên Cloudflare.
1. Đăng nhập vào Cloudflare.
2. Tìm đến mục **Workers & Pages** > **D1**.
3. Bấm **Create database**, đặt tên là `debt-reminder-db`.
4. Sau khi tạo xong, Cloudflare sẽ cấp cho bạn một chuỗi tên là `database_id` (Nó có dạng mã băm lộn xộn, ví dụ: `d4bxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx`).
5. Hãy copy chuỗi `database_id` này.
6. Mở file `apps/api/wrangler.jsonc` trong bộ code của bạn. Tìm dòng `database_id` và dán mã bạn vừa copy vào đó.

---

## Bước 3: Lấy Chìa khóa Cloudflare (API Token)
Để GitHub có quyền ra lệnh cho Cloudflare tự động cập nhật web, bạn cần cấp cho GitHub một "Chìa khóa vạn năng".
1. Trên Cloudflare, bấm vào hình người (Profile) ở góc trên bên phải > **My Profile**.
2. Chọn menu **API Tokens** bên trái.
3. Bấm **Create Token** > Kéo xuống cuối bấm **Create Custom Token**.
4. Chọn quyền (Permissions) như sau:
   - Account | D1 | Edit
   - Account | Workers Scripts | Edit
   - Account | Cloudflare Pages | Edit
5. Bấm **Continue to summary** và **Create Token**.
6. **COPY CHUỖI TOKEN NÀY VÀ LƯU LẠI KỸ**, vì nó chỉ hiện 1 lần duy nhất!

---

## Bước 4: Đẩy Code lên GitHub
1. Tạo một Repository mới (trống) trên GitHub của bạn.
2. Mở Terminal ở thư mục máy tính chứa dự án, gõ các lệnh sau để nối mã nguồn của bạn với GitHub:
   ```bash
   git remote add origin https://github.com/TENCUABAN/TEN-REPO-CUA-BAN.git
   git add .
   git commit -m "Upload hệ thống lần đầu"
   git push -u origin main
   ```

---

## Bước 5: Cài Chìa Khóa vào GitHub (Cực kỳ quan trọng)
Để GitHub Actions hoạt động, bạn phải giấu những thông tin bí mật (Secret) vào GitHub an toàn:
1. Vào trang GitHub chứa dự án của bạn.
2. Chọn tab **Settings** > Kéo xuống menu bên trái chọn **Secrets and variables** > **Actions**.
3. Bấm **New repository secret** để thêm LẦN LƯỢT 3 CHÌA KHÓA sau:

| Tên Secret (Name) | Nội dung dán vào (Secret) | Chú thích |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Chìa khóa bạn copy ở **Bước 3** | Cấp quyền cho GitHub upload web lên Cloudflare. |
| `CLOUDFLARE_ACCOUNT_ID` | Xem ở cột bên phải ngoài cùng màn hình chính Cloudflare. | ID tài khoản Cloudflare của bạn. |
| `API_SECRETS` | `{ "AUTH_SECRET": "Mật khẩu mã hóa của bạn", "RESEND_API_KEY": "re_xxx..." }` | Gõ y chang cấu trúc JSON này, chứa 2 mã bí mật bạn tạo ở Local Setup. |

---

## VÀ THẾ LÀ XONG! 🚀 BẤM NÚT TỰ ĐỘNG!
Mọi cấu hình đã hoàn tất. Từ bây giờ về sau, quy trình hoạt động siêu nhàn rỗi như sau:

1. Mỗi khi bạn sửa code trên máy tính.
2. Bạn gõ lệnh đưa code lên GitHub:
   `git add .` -> `git commit -m "Sửa cái abc"` -> `git push`
3. Cứ khi nào code được đẩy lên GitHub, "Người máy" **GitHub Actions** (được chúng tôi lập trình sẵn trong file `.github/workflows/ci.yml`) sẽ thức dậy!
4. Người máy này sẽ TỰ ĐỘNG:
   - Kéo code của bạn về.
   - Cài thư viện.
   - Biên dịch Web (Frontend).
   - Nén API (Backend).
   - Cập nhật Database (D1).
   - Đẩy tất cả lên hệ thống toàn cầu của Cloudflare.

**👉 Kết quả:** Tầm 2 phút sau khi bạn gõ `git push`, bạn có thể F5 trang web và thấy tính năng mới đã có mặt trên Internet! Bạn hoàn toàn rảnh tay, chuẩn phong cách **Zero-Ops**!

# 📖 Hướng Dẫn Sử Dụng (User Guide)

Tài liệu này sẽ hướng dẫn bạn cách sử dụng hệ thống từ góc độ của một người quản lý, không yêu cầu bất kỳ kiến thức lập trình nào.

---

## 1. Đăng nhập vào Hệ Thống
1. Mở trình duyệt web (Chrome, Safari, Edge...).
2. Truy cập vào đường link hệ thống (ví dụ: `http://localhost:5173` nếu chạy trên máy cá nhân, hoặc link trang web thật của bạn).
3. Tại màn hình đăng nhập, điền:
   - **Email**: Email của bạn (Mặc định dùng thử: `admin@example.com`)
   - **Mật khẩu**: Mật khẩu của bạn (Mặc định dùng thử: `admin123`)
4. Bấm nút **Sign In**.

---

## 2. Làm quen với Trang Chủ (Dashboard)
Ngay khi đăng nhập, bạn sẽ thấy Bảng điều khiển (Dashboard). Đây là trung tâm chỉ huy của bạn:
- **Upcoming Dues**: Hiển thị số lượng khoản nợ sắp đến hạn phải thu.
- **Overdue**: Hiển thị số lượng khoản nợ ĐÃ QUÁ HẠN (bạn cần nhắn tin đòi gắt gao hơn).
- **Emails Sent**: Số lượng email nhắc nợ mà hệ thống đã tự động gửi đi trong hôm nay.
- **Biểu đồ**: Hiển thị sự phát triển của dòng tiền (sẽ cập nhật sau).

---

## 3. Quản lý Khách Hàng (Customers)
Trước khi ghi nợ, bạn cần tạo khách hàng.
1. Ở menu bên trái, bấm vào mục **Customers**.
2. Bấm nút xanh **+ Add Customer** ở góc phải phía trên.
3. Một bảng điền thông tin hiện ra, bạn cần nhập:
   - **Full Name**: Tên đầy đủ (Bắt buộc). Ví dụ: *Nguyễn Văn A*.
   - **Company Name**: Tên công ty (nếu có).
   - **Email**: BẮT BUỘC ĐÚNG. Hệ thống sẽ gửi thư nhắc nợ tự động vào email này.
   - **Phone**: Số điện thoại.
4. Bấm **Save Customer**. Khách hàng mới sẽ xuất hiện trong danh sách!

---

## 4. Viết Mẫu Email Nhắc Nợ (Templates)
Bạn không cần gõ lại email mỗi lần đòi nợ. Bạn có thể lưu vô số "kịch bản" email.
1. Ở menu bên trái, bấm vào **Templates**.
2. Bấm **+ Add Template**.
3. Điền các ô:
   - **Template Name**: Tên gợi nhớ (Ví dụ: *Nhắc nhẹ trước 3 ngày*).
   - **Email Subject**: Tiêu đề email mà khách hàng sẽ thấy (Ví dụ: *Thông báo: Sắp đến hạn thanh toán khoản phí dịch vụ*).
   - **Email Body**: Nội dung email. 
   *(Mẹo: Bạn có thể viết nội dung chung chung, hệ thống sẽ tự động ghép số tiền thật vào sau).*
4. Bấm **Save Template**.

---

## 5. Cài Đặt Luật Nhắc Tự Động (Rules)
Hệ thống sẽ không biết khi nào cần gửi mẫu email nào nếu bạn không đặt ra luật.
1. Ở menu bên trái, bấm vào **Rules**.
2. Bấm **+ Add Rule**.
3. Điền các ô:
   - **Rule Name**: Tên luật (Ví dụ: *Luật nhắc 3 ngày*).
   - **Description**: Mô tả cho vui để dễ nhớ.
   - **Trigger Days**: Khoảng thời gian so với ngày đến hạn. **Ví dụ: Điền số 3 nghĩa là "Hệ thống tự gửi email trước 3 ngày đến hạn"**.
   - **Template**: Bấm vào mũi tên xổ xuống và chọn Mẫu Email mà bạn vừa tạo ở bước 4.
4. Bấm **Save Rule**. 
Từ giờ, cứ ai có khoản nợ còn 3 ngày nữa đến hạn, hệ thống sẽ lôi cái mẫu email kia ra gửi cho họ!

---

## 6. Ghi Nhận Một Khoản Nợ (Receivables)
Đây là bước quan trọng nhất.
1. Bấm vào **Receivables** ở menu bên trái.
2. Bấm **+ Add Receivable**.
3. Điền các thông tin:
   - **Customer**: Bấm chọn người khách đang nợ tiền (đã tạo ở Bước 3).
   - **Amount**: Số tiền (Ví dụ: 1000000).
   - **Currency**: Đơn vị tiền (VND hoặc USD).
   - **Due Date**: Bấm vào hình tờ lịch và chọn Ngày họ hứa sẽ trả.
4. Bấm **Save Receivable**.

**VÀ THẾ LÀ XONG! 🎉** 
Bạn có thể tắt máy đi ngủ. Hệ thống sẽ đếm lùi đến ngày `Due Date`. Khi thời gian lọt vào bộ `Rules` (ví dụ trước 3 ngày), bộ não Cloudflare ẩn sau hệ thống sẽ tự động thức dậy, soạn email theo `Templates`, và gửi thẳng vào hòm thư của khách hàng! Bạn không cần làm gì thêm cả!

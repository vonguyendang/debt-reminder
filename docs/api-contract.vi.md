# 🔌 Tài Liệu Đặc Tả API (API Reference)

*🌍 [English](api-contract.md)*

Tài liệu này quy định chuẩn giao tiếp (API Contract) của hệ thống Debt Reminder. 
API tuân thủ nghiêm ngặt các quy ước RESTful và luôn trả về định dạng JSON thống nhất.

---

## 1. Xác thực (Authentication)
Tất cả các API (ngoại trừ `/api/auth/login`) đều yêu cầu phải gửi kèm mã Token vào header `Authorization`.

```http
Authorization: Bearer <chuỗi_token_jwt_của_bạn_ở_đây>
```

---

## 2. Định Dạng Phản Hồi Chuẩn (Standard Responses)

**Phản hồi Thành công (Mã HTTP 200)**
```json
{
  "success": true,
  "data": { ... } // Dữ liệu trả về sẽ nằm trong object này
}
```

**Phản hồi Lỗi (Mã HTTP 400, 401, 403, 500)**
```json
{
  "success": false,
  "error": "Thông báo lỗi giải thích chi tiết lý do"
}
```

---

## 3. Danh sách Endpoints

### 3.1. Đăng nhập (Auth)
#### `POST /api/auth/login`
- **Dữ liệu gửi lên (Body)**:
  ```json
  { "email": "admin@example.com", "password": "admin123" }
  ```
- **Kết quả**: Trả về một `token` và thông tin `user`.

### 3.2. Khách Hàng (Customers)
#### `GET /api/customers`
- **Mô tả**: Lấy danh sách khách hàng (Tối đa 100 người mỗi trang).
- **Kết quả**: `[ { "id": "cus_123", "full_name": "Nguyễn Văn A", ... } ]`

#### `POST /api/customers`
- **Dữ liệu gửi lên**:
  ```json
  { "full_name": "Nguyễn Văn A", "email": "nguyenvana@example.com", "phone": "0987654321" }
  ```
- **Kết quả**: `{ "id": "cus_123" }`

#### `DELETE /api/customers/:id`
- **Mô tả**: Xóa vĩnh viễn một khách hàng khỏi hệ thống.

### 3.3. Khoản Nợ (Receivables)
#### `GET /api/receivables`
- **Mô tả**: Lấy danh sách khoản nợ. Hỗ trợ tham số lọc `?status=pending`.

#### `POST /api/receivables`
- **Dữ liệu gửi lên**:
  ```json
  { "customer_id": "cus_123", "amount": 5000000, "currency": "VND", "due_date": "2024-12-31T00:00:00Z" }
  ```

#### `POST /api/receivables/:id/mark-paid`
- **Mô tả**: Đánh dấu khoản nợ đã được thanh toán xong.

### 3.4. Luật & Mẫu Thư (Rules & Templates)
- `GET /api/templates` - Lấy danh sách mẫu thư.
- `POST /api/templates` - Tạo mẫu thư nhắc nợ mới.
- `GET /api/rules` - Lấy danh sách các quy tắc nhắc nợ.
- `POST /api/rules` - Tạo quy tắc nhắc nợ mới.

---

> [!NOTE]
> Để xem chi tiết các trường dữ liệu bắt buộc/không bắt buộc, vui lòng mở file mã nguồn `packages/shared/src/schemas.ts`. Tất cả đều được định nghĩa bằng Zod.

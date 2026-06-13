INSERT INTO email_templates (id, name, subject_template, html_template, is_active, created_at, updated_at) VALUES 
('tpl_yt_1', '[YouTube Premium] Nhắc trước hạn thanh toán', 'Nhắc lịch thanh toán gói YouTube Premium – Ngày {{due_day}} hằng tháng', 
'<p>Kính gửi chủ tài khoản <strong>{{customer_name}}</strong>,</p>
<p>Mình xin phép gửi lời nhắc định kỳ về lịch thanh toán gói YouTube Premium mà bạn đang tham gia, chu kỳ thanh toán hằng tháng vào ngày {{due_day}}.</p>
<p>Để việc gia hạn cho kỳ sử dụng mới không bị gián đoạn, kính mong bạn thu xếp thanh toán <strong>tối thiểu phí 1 tháng</strong> trước hoặc <strong>chậm nhất đến ngày {{due_date}}</strong>.</p>
<p>Bên mình có áp dụng <strong>thời gian ân hạn 3 ngày sau ngày {{due_day}}</strong>; trong khoảng thời gian này, bạn vẫn có thể thanh toán mà không ảnh hưởng đến suất thành viên hiện tại.</p>
<p>Số tiền thanh toán cần là bội số của <strong>{{amount}}</strong> (tương ứng 1 tháng sử dụng cho mỗi {{amount}}).</p>
<p><strong>Thông tin tài khoản nhận thanh toán:</strong></p>
<ul>
  <li>Ngân hàng: TIMO by BVBank</li>
  <li>Chủ tài khoản: VO NGUYEN DANG</li>
  <li>Số tài khoản: 0944353323</li>
</ul>
<p>Hoặc bạn có thể <strong>quét mã QR</strong> dưới đây để thanh toán nhanh chóng qua ứng dụng ngân hàng/ví điện tử hỗ trợ VietQR:</p>
<img src="https://img.vietqr.io/image/timo-0944353323-compact2.png?amount={{amount_raw}}&addInfo=Thanh%20toan%20Youtube%20Premium&accountName=VO%20NGUYEN%20DANG" alt="VietQR" style="max-width: 300px; display: block; margin: 1rem 0;" />
<p>Trong trường hợp bạn không còn nhu cầu tiếp tục sử dụng gói hiện tại, chỉ cần không thực hiện thanh toán, bên mình sẽ chủ động sắp xếp thay thế suất thành viên cho tài khoản khác sau thời gian ân hạn.</p>
<p>Đây là email được gửi tự động, nếu bạn đã thanh toán vui lòng bỏ qua email này.</p>
<p>Nếu bạn có bất kỳ thắc mắc nào hoặc cần hỗ trợ thêm, vui lòng phản hồi lại email này.</p>
<p>--<br>
<strong>Best regards,</strong><br>
<span style="color: #0b5394; font-weight: bold;">Vo Nguyen Dang</span><br>
<span style="color: #c90076; font-weight: bold;">m:</span> <a href="tel:+84944353323" style="color: #0b5394; text-decoration: none;">(+84) 944353323</a></p>', 1, datetime('now'), datetime('now'));

INSERT INTO email_templates (id, name, subject_template, html_template, is_active, created_at, updated_at) VALUES 
('tpl_yt_2', '[YouTube Premium] Đến hạn thanh toán (Lần 1)', 'Nhắc thanh toán gói YouTube Premium – Đến hạn thanh toán', 
'<p>Kính gửi chủ tài khoản <strong>{{customer_name}}</strong>,</p>
<p>Mình xin phép gửi lời nhắc về khoản thanh toán gói YouTube Premium mà bạn đang tham gia (chu kỳ thanh toán hằng tháng vào ngày {{due_day}}).</p>
<p><strong>Hiện tại, bên mình chưa ghi nhận được khoản thanh toán cho kỳ tháng này.</strong> Theo chính sách của bên mình, bạn có thời gian <strong>ân hạn 3 ngày</strong> sau ngày {{due_day}} để hoàn tất thanh toán mà không bị ảnh hưởng suất thành viên.</p>
<p>Nếu bạn vẫn muốn tiếp tục sử dụng dịch vụ, vui lòng thanh toán tối thiểu phí 1 tháng trước ngày <strong>{{grace_period_end}}</strong>. Số tiền thanh toán cần là bội số của <strong>{{amount}}</strong>.</p>
<p><strong>Thông tin tài khoản nhận thanh toán:</strong></p>
<ul>
  <li>Ngân hàng: TIMO by BVBank</li>
  <li>Chủ tài khoản: VO NGUYEN DANG</li>
  <li>Số tài khoản: 0944353323</li>
</ul>
<p>Hoặc bạn có thể <strong>quét mã QR</strong> dưới đây để thanh toán nhanh chóng:</p>
<img src="https://img.vietqr.io/image/timo-0944353323-compact2.png?amount={{amount_raw}}&addInfo=Thanh%20toan%20Youtube%20Premium&accountName=VO%20NGUYEN%20DANG" alt="VietQR" style="max-width: 300px; display: block; margin: 1rem 0;" />
<p><strong>Lưu ý quan trọng:</strong> Nếu sau ngày {{grace_period_end}} bên mình vẫn chưa nhận được khoản thanh toán, mình sẽ buộc phải tiến hành thay thế suất thành viên của bạn bằng tài khoản khác để đảm bảo hiệu quả quản lý gói chia sẻ.</p>
<p>Trong trường hợp bạn không còn nhu cầu tiếp tục sử dụng, bạn không cần thực hiện bất kỳ thao tác nào, mình sẽ tự động sắp xếp thay thế sau thời hạn.</p>
<p>Đây là email tự động. Nếu bạn đã thanh toán, vui lòng bỏ qua.</p>
<p>Nếu có thắc mắc hoặc cần hỗ trợ, hãy phản hồi email này hoặc nhắn Zalo số điện thoại bên dưới.</p>
<p>--<br>
<strong>Best regards,</strong><br>
<span style="color: #0b5394; font-weight: bold;">Vo Nguyen Dang</span><br>
<span style="color: #c90076; font-weight: bold;">m:</span> <a href="tel:+84944353323" style="color: #0b5394; text-decoration: none;">(+84) 944353323</a></p>', 1, datetime('now'), datetime('now'));

INSERT INTO email_templates (id, name, subject_template, html_template, is_active, created_at, updated_at) VALUES 
('tpl_yt_3', '[YouTube Premium] Quá hạn thanh toán (Lần 2)', 'Nhắc thanh toán (lần 2) gói YouTube Premium – Đến hạn thanh toán', 
'<p>Kính gửi chủ tài khoản <strong>{{customer_name}}</strong>,</p>
<p>Mình xin phép gửi lời nhắc (lần 2) về khoản thanh toán gói YouTube Premium mà bạn đang tham gia.</p>
<p><strong>Hiện tại, bên mình chưa ghi nhận được khoản thanh toán cho kỳ tháng này.</strong></p>
<p>Nếu bạn vẫn muốn tiếp tục sử dụng dịch vụ, vui lòng thanh toán tối thiểu phí 1 tháng trước ngày <strong>{{grace_period_end}}</strong>. Số tiền thanh toán cần là bội số của <strong>{{amount}}</strong>.</p>
<p><strong>Thông tin tài khoản nhận thanh toán:</strong></p>
<ul>
  <li>Ngân hàng: TIMO by BVBank</li>
  <li>Chủ tài khoản: VO NGUYEN DANG</li>
  <li>Số tài khoản: 0944353323</li>
</ul>
<p>Hoặc bạn có thể <strong>quét mã QR</strong> dưới đây để thanh toán nhanh chóng:</p>
<img src="https://img.vietqr.io/image/timo-0944353323-compact2.png?amount={{amount_raw}}&addInfo=Thanh%20toan%20Youtube%20Premium&accountName=VO%20NGUYEN%20DANG" alt="VietQR" style="max-width: 300px; display: block; margin: 1rem 0;" />
<p><strong>Lưu ý cực kỳ quan trọng:</strong> Nếu sau ngày {{grace_period_end}} bên mình vẫn chưa nhận được khoản thanh toán, mình sẽ buộc phải tiến hành thay thế suất thành viên của bạn bằng tài khoản khác để đảm bảo hiệu quả quản lý gói chia sẻ. Việc thay thế sẽ diễn ra tự động.</p>
<p>Đây là email tự động. Nếu bạn đã thanh toán, vui lòng bỏ qua.</p>
<p>Nếu có thắc mắc hoặc cần hỗ trợ, hãy phản hồi email này hoặc nhắn Zalo số điện thoại bên dưới.</p>
<p>--<br>
<strong>Best regards,</strong><br>
<span style="color: #0b5394; font-weight: bold;">Vo Nguyen Dang</span><br>
<span style="color: #c90076; font-weight: bold;">m:</span> <a href="tel:+84944353323" style="color: #0b5394; text-decoration: none;">(+84) 944353323</a></p>', 1, datetime('now'), datetime('now'));

INSERT INTO email_templates (id, name, subject_template, html_template, is_active, created_at, updated_at) VALUES 
('tpl_yt_4', '[YouTube Premium] Xác nhận thanh toán thành công', 'Xác nhận đã nhận thanh toán gói YouTube Premium', 
'<p>Kính gửi bạn <strong>{{customer_name}}</strong>,</p>
<p>Cảm ơn bạn đã thanh toán!</p>
<p>Mình xác nhận đã nhận được khoản thanh toán <strong>{{amount}}</strong> của bạn cho gói YouTube Premium.</p>
<p><strong>Thông tin thanh toán:</strong></p>
<ul>
  <li>Số tiền: <strong>{{amount}}</strong></li>
  <li>Ngày thanh toán kế tiếp: <strong>{{due_date}}</strong></li>
</ul>
<p>Suất thành viên của bạn đã được gia hạn thành công và bạn có thể tiếp tục sử dụng dịch vụ YouTube Premium không gián đoạn.</p>
<p>Nếu bạn có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ lại cho mình nhé.</p>
<p>Chúc bạn trải nghiệm dịch vụ vui vẻ!</p>
<p>--<br>
<strong>Best regards,</strong><br>
<span style="color: #0b5394; font-weight: bold;">Vo Nguyen Dang</span><br>
<span style="color: #c90076; font-weight: bold;">m:</span> <a href="tel:+84944353323" style="color: #0b5394; text-decoration: none;">(+84) 944353323</a></p>', 1, datetime('now'), datetime('now'));

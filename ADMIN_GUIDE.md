# INHOME Design - Admin Panel & Enhancement Guide

## 🎉 Các cải tiến đã thêm

### 1. **Giao diện Frontend được cải thiện** 
   - ✨ **Animations** - Hiệu ứng fade, slide, scale với CSS3 animations
   - 🎯 **Hover Effects** - Các nút, thẻ có hiệu ứng hover mượt mà
   - 💫 **Smooth Transitions** - Chuyển đổi mượt mà cho tất cả các yếu tố
   - 🔄 **Loading States** - Spinner animation cho trạng thái loading

**File**: `public/css/animations.css`

### 2. **Admin Panel Đầy Đủ Chức Năng**
   
   **URL**: `http://localhost:3000/admin`
   
   #### Các chức năng chính:
   
   - 📊 **Dashboard** - Thống kê doanh thu, số dự án, khách hàng, đánh giá
   - 👥 **Quản lý Khách hàng** - CRUD khách hàng, lịch sử liên hệ
   - 🏗️ **Quản lý Dự án** - Tạo, chỉnh sửa, xóa, theo dõi tiến độ dự án
   - 🛠️ **Quản lý Dịch vụ** - Quản lý danh sách dịch vụ, giá cả
   - 📋 **Quản lý Đơn hàng** - Theo dõi đơn hàng, trạng thái
   - ⭐ **Quản lý Đánh giá** - Xem và xóa đánh giá khách hàng
   - 💬 **Tin nhắn** - Xem tin nhắn từ khách hàng
   - ⚙️ **Cài đặt** - Thay đổi thông tin công ty, mật khẩu

### 3. **API Endpoints (Backend)**

Đã thêm các API endpoints JSON RESTful:

```
GET    /api/customers          - Lấy danh sách khách hàng
POST   /api/customers          - Thêm khách hàng mới
PUT    /api/customers/:id      - Cập nhật khách hàng
DELETE /api/customers/:id      - Xóa khách hàng

GET    /api/projects           - Lấy danh sách dự án
POST   /api/projects           - Thêm dự án mới
PUT    /api/projects/:id       - Cập nhật dự án
DELETE /api/projects/:id       - Xóa dự án

GET    /api/services           - Lấy danh sách dịch vụ
POST   /api/services           - Thêm dịch vụ mới
PUT    /api/services/:id       - Cập nhật dịch vụ
DELETE /api/services/:id       - Xóa dịch vụ

GET    /api/orders             - Lấy danh sách đơn hàng
GET    /api/testimonials       - Lấy danh sách đánh giá
DELETE /api/testimonials/:id   - Xóa đánh giá
GET    /api/messages           - Lấy danh sách tin nhắn
GET    /api/stats              - Lấy thống kê dashboard
```

## 📁 File Cấu Trúc

```
inhome-design/
├── index.html                          # Trang chủ
├── admin.html                          # ✨ Trang Admin Panel (MỚI)
├── server.js                           # Backend (Cập nhật API)
├── package.json
├── public/
│   ├── style.css
│   ├── css/
│   │   ├── base.css
│   │   ├── header.css
│   │   ├── sections.css
│   │   ├── footer.css
│   │   ├── animations.css              # ✨ Mới - Animations
│   │   ├── admin.css                   # ✨ Mới - Admin Panel CSS
│   │   └── responsive.css
│   └── js/
│       ├── main.js
│       ├── contact.js
│       ├── menu.js
│       ├── projects.js
│       ├── scroll.js
│       ├── faq.js
│       └── admin.js                    # ✨ Mới - Admin JS
```

## 🚀 Cách Sử Dụng

### 1. **Truy Cập Admin Panel**

```
URL: /admin
Username: admin
Password: admin (Mặc định, thay đổi qua biến môi trường)
```

Các biến môi trường trong `.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### 2. **Quản lý Khách hàng**

- Nhấp vào "Khách hàng" trong menu bên trái
- Nhấp "➕ Thêm khách hàng" để thêm mới
- Điền thông tin: Tên, Email, Điện thoại, Dịch vụ cần tư vấn
- Nhấp "Lưu" để lưu

**Tìm kiếm**: Dùng thanh tìm kiếm để lọc khách hàng theo tên, email, điện thoại

### 3. **Quản lý Dự án**

- Nhấp vào "Dự án" trong menu bên trái
- Nhấp "➕ Thêm dự án" để thêm dự án mới
- Điền: Tên dự án, Loại hình, Khách hàng, Diện tích, Ngân sách, Trạng thái
- Nhấp "Lưu"

**Theo dõi tiến độ**: Xem progress bar cho mỗi dự án (cập nhật bằng API)

### 4. **Quản lý Dịch vụ**

- Nhấp vào "Dịch vụ" trong menu
- Nhấp "➕ Thêm dịch vụ"
- Điền tên dịch vụ, giá tiêu chuẩn, mô tả
- Nhấp "Lưu"

### 5. **Xem Thống kê Dashboard**

- Dashboard hiển thị:
  - Tổng số dự án
  - Tổng số khách hàng
  - Tổng doanh thu
  - Đánh giá trung bình

## 🎨 Các Tính Năng Frontend Mới

### Animations
- **Fade-in/Fade-out** - Khi cuộn trang
- **Scale** - Khi hover vào thẻ dịch vụ, dự án
- **Float** - Nút floating buttons (Gọi điện, Email)
- **Slide** - Khi mở modal hoặc form

### Hover Effects
- Nút được nâng lên (translateY)
- Shadow mở rộng khi hover
- Color transition mượt mà

### CSS Improvements
- Better spacing and padding
- Modern gradient backgrounds
- Glassmorphism effects
- Smooth color transitions

## 🔐 Bảo Mật

- ✅ Session-based authentication
- ✅ CSRF protection (Helmet)
- ✅ Input sanitization (escapeHtml)
- ✅ Admin-only routes với `requireAdmin` middleware

**Cải thiện bảo mật**:
```javascript
// Tất cả input được sanitize
const safe = escapeHtml(userInput);

// Kiểm tra admin cho mỗi route
app.post('/api/customers', requireAdmin, (req, res) => {...});
```

## 📱 Responsive Design

Admin Panel responsive cho:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (<768px)

**Mobile Features**:
- Sidebar collapse thành hamburger menu
- Table scroll ngang
- Touch-friendly buttons
- Optimized layout

## 🛠️ Phát Triển Thêm

### Để thêm chức năng mới:

1. **Thêm API endpoint** trong `server.js`
   ```javascript
   app.get('/api/new-data', requireAdmin, (req, res) => {
       res.json({ success: true, data: newData });
   });
   ```

2. **Thêm function JavaScript** trong `admin.js`
   ```javascript
   async function loadNewData() {
       const response = await AdminAPI.get('/new-data');
       // Update UI
   }
   ```

3. **Thêm HTML** trong `admin.html`
   ```html
   <div id="newpage" class="page">
       <!-- Content here -->
   </div>
   ```

4. **Thêm CSS** trong `admin.css` nếu cần styling đặc biệt

## 📊 Database Integration (TODO)

Hiện tại dữ liệu lưu trong memory. Để lưu persistent, cần:

1. Cài đặt MongoDB hoặc PostgreSQL
2. Cài `mongoose` hoặc `pg` package
3. Tạo models/schemas
4. Thay thế in-memory arrays bằng database queries

Ví dụ MongoDB:
```javascript
const Customer = require('./models/Customer');

app.get('/api/customers', async (req, res) => {
    const customers = await Customer.find();
    res.json({ success: true, data: customers });
});
```

## 🚀 Deploy

Để deploy lên VPS:

1. SSH vào server
   ```bash
   ssh vps@20.244.83.46
   ```

2. Cập nhật code
   ```bash
   cd /var/www/du-an-ca-nhan
   git pull origin main
   ```

3. Cài dependencies
   ```bash
   npm install
   ```

4. Restart server
   ```bash
   pm2 restart du-an-ca-nhan
   ```

## 📝 Ghi Chú

- Admin panel sử dụng localStorage để lưu dark mode preference
- Search functionality hoạt động trên client-side (cần optimize cho production)
- Charts placeholder cần Chart.js library nếu muốn render
- Delete operations cần confirmation dialog

## 📞 Support

Nếu có lỗi:
1. Kiểm tra console (F12)
2. Kiểm tra Network tab để xem API calls
3. Kiểm tra server logs

Thành công! Admin panel của bạn đã sẵn sàng sử dụng! 🎉

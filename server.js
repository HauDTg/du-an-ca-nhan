const express = require("express");
const path = require("path");
const helmet = require("helmet");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "inhome_admin_secret_2026",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));

let contacts = [];

const services = [
    { name: "Thiết kế căn hộ", price: "150.000đ/m²", status: "Đang hiển thị" },
    { name: "Thiết kế nhà phố", price: "250.000đ/m²", status: "Đang hiển thị" },
    { name: "Thiết kế biệt thự", price: "Liên hệ", status: "Đang hiển thị" },
    { name: "Thiết kế văn phòng", price: "Theo dự án", status: "Đang hiển thị" },
    { name: "Thi công nội thất", price: "Theo dự án", status: "Đang hiển thị" }
];

const projects = [
    { name: "Modern Apartment", type: "Căn hộ", area: "75m²", status: "Hoàn thành" },
    { name: "Family House", type: "Nhà phố", area: "120m²", status: "Hoàn thành" },
    { name: "Creative Office", type: "Văn phòng", area: "180m²", status: "Đang triển khai" }
];

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "0011@admin";

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/contact", function (req, res) {
    const { fullname, phone, email, service, message } = req.body;

    const newContact = {
        id: Date.now(),
        fullname,
        phone,
        email,
        service,
        message,
        status: "Mới",
        createdAt: new Date().toLocaleString("vi-VN")
    };

    contacts.unshift(newContact);

    res.json({
        success: true,
        message: "Gửi yêu cầu tư vấn thành công!"
    });
});

function checkAdminLogin(req, res, next) {
    if (req.session.adminLoggedIn) {
        next();
    } else {
        res.redirect("/admin/login");
    }
}

function adminLayout(title, active, content) {
    return `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title} - INHOME Admin</title>

            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    background: #f4efe7;
                    color: #1f1b16;
                }

                .admin {
                    display: grid;
                    grid-template-columns: 290px 1fr;
                    min-height: 100vh;
                }

                .sidebar {
                    background: linear-gradient(180deg, #1f1b16, #0f0d0b);
                    color: white;
                    padding: 28px 22px;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    box-shadow: 15px 0 45px rgba(0, 0, 0, 0.18);
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding-bottom: 28px;
                    margin-bottom: 22px;
                    border-bottom: 1px solid rgba(255,255,255,0.12);
                }

                .brand-logo {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #d8b77c, #9a6a38);
                    color: #1f1b16;
                    border-radius: 18px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: 900;
                    font-size: 22px;
                }

                .brand h2 {
                    font-size: 24px;
                    letter-spacing: 3px;
                }

                .brand p {
                    color: #d8b77c;
                    margin-top: 4px;
                    font-size: 13px;
                    letter-spacing: 1px;
                }

                .menu-title {
                    color: #9f9283;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin: 20px 14px 12px;
                }

                .menu a {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #d7c9b7;
                    text-decoration: none;
                    padding: 14px 16px;
                    border-radius: 16px;
                    margin-bottom: 8px;
                    font-weight: 700;
                    transition: 0.2s;
                }

                .menu a:hover,
                .menu a.active {
                    background: rgba(216, 183, 124, 0.18);
                    color: white;
                    transform: translateX(4px);
                }

                .menu a.active {
                    border: 1px solid rgba(216, 183, 124, 0.35);
                }

                .main {
                    padding: 30px;
                }

                .topbar {
                    background: rgba(255,255,255,0.86);
                    backdrop-filter: blur(16px);
                    padding: 24px 28px;
                    border-radius: 28px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 18px 55px rgba(31, 27, 22, 0.08);
                    border: 1px solid #eadfce;
                    margin-bottom: 30px;
                }

                .topbar h1 {
                    font-size: 30px;
                    margin-bottom: 6px;
                }

                .topbar p {
                    color: #6b5a4b;
                }

                .top-actions {
                    display: flex;
                    gap: 10px;
                }

                .top-actions a {
                    color: white;
                    background: #1f1b16;
                    padding: 12px 18px;
                    border-radius: 999px;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                }

                .top-actions a.logout {
                    background: #9a6a38;
                }

                .cards {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 22px;
                    margin-bottom: 30px;
                }

                .card {
                    background: white;
                    padding: 28px;
                    border-radius: 28px;
                    box-shadow: 0 18px 55px rgba(31, 27, 22, 0.08);
                    border: 1px solid #eadfce;
                    position: relative;
                    overflow: hidden;
                }

                .card::after {
                    content: "";
                    width: 130px;
                    height: 130px;
                    background: rgba(216, 183, 124, 0.16);
                    border-radius: 50%;
                    position: absolute;
                    right: -45px;
                    bottom: -45px;
                }

                .card h2 {
                    color: #9a6a38;
                    font-size: 40px;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 2;
                }

                .card p {
                    color: #6b5a4b;
                    font-weight: 800;
                    position: relative;
                    z-index: 2;
                }

                .panel {
                    background: white;
                    padding: 30px;
                    border-radius: 28px;
                    box-shadow: 0 18px 55px rgba(31, 27, 22, 0.08);
                    border: 1px solid #eadfce;
                    margin-bottom: 26px;
                    overflow-x: auto;
                }

                .panel h2 {
                    font-size: 24px;
                    margin-bottom: 22px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 850px;
                }

                th {
                    background: #1f1b16;
                    color: white;
                    padding: 16px;
                    text-align: left;
                    font-size: 14px;
                }

                th:first-child {
                    border-radius: 14px 0 0 14px;
                }

                th:last-child {
                    border-radius: 0 14px 14px 0;
                }

                td {
                    padding: 16px;
                    border-bottom: 1px solid #eadfce;
                    color: #4e4034;
                    font-size: 14px;
                }

                tr:hover td {
                    background: #fff7ed;
                }

                .badge {
                    display: inline-block;
                    padding: 8px 13px;
                    border-radius: 999px;
                    background: #dcfce7;
                    color: #166534;
                    font-weight: 800;
                    font-size: 12px;
                }

                .badge.warning {
                    background: #fef3c7;
                    color: #92400e;
                }

                .badge.dark {
                    background: #1f1b16;
                    color: white;
                }

                .btn {
                    display: inline-block;
                    border: none;
                    cursor: pointer;
                    padding: 10px 14px;
                    border-radius: 12px;
                    background: #9a6a38;
                    color: white;
                    font-weight: 800;
                    text-decoration: none;
                    font-size: 13px;
                }

                .btn.danger {
                    background: #dc2626;
                }

                .empty {
                    padding: 38px;
                    text-align: center;
                    color: #6b5a4b;
                    background: #fff7ed;
                    border-radius: 20px;
                    font-weight: 800;
                }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .setting-box {
                    padding: 24px;
                    border-radius: 20px;
                    background: #fff7ed;
                    border: 1px solid #eadfce;
                }

                .setting-box h3 {
                    margin-bottom: 10px;
                }

                .setting-box p {
                    color: #6b5a4b;
                    line-height: 1.7;
                }

                @media (max-width: 1100px) {
                    .admin {
                        grid-template-columns: 1fr;
                    }

                    .sidebar {
                        height: auto;
                        position: static;
                    }

                    .cards,
                    .grid-2 {
                        grid-template-columns: 1fr;
                    }

                    .topbar {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 18px;
                    }

                    .main {
                        padding: 20px;
                    }
                }
            </style>
        </head>

        <body>
            <div class="admin">
                <aside class="sidebar">
                    <div class="brand">
                        <div class="brand-logo">IH</div>
                        <div>
                            <h2>INHOME</h2>
                            <p>Admin Control</p>
                        </div>
                    </div>

                    <div class="menu">
                        <div class="menu-title">Quản trị</div>

                        <a class="${active === "dashboard" ? "active" : ""}" href="/admin">📊 Tổng quan</a>
                        <a class="${active === "contacts" ? "active" : ""}" href="/admin/contacts">📩 Yêu cầu tư vấn</a>
                        <a class="${active === "services" ? "active" : ""}" href="/admin/services">🛋️ Quản lý dịch vụ</a>
                        <a class="${active === "projects" ? "active" : ""}" href="/admin/projects">🏗️ Quản lý dự án</a>
                        <a class="${active === "pricing" ? "active" : ""}" href="/admin/pricing">💰 Bảng giá</a>
                        <a class="${active === "settings" ? "active" : ""}" href="/admin/settings">⚙️ Cài đặt</a>

                        <div class="menu-title">Website</div>

                        <a href="/">🌐 Xem website</a>
                        <a href="/admin/logout">🚪 Đăng xuất</a>
                    </div>
                </aside>

                <main class="main">
                    <div class="topbar">
                        <div>
                            <h1>${title}</h1>
                            <p>Quản trị website thiết kế nội thất INHOME Design</p>
                        </div>

                        <div class="top-actions">
                            <a href="/">Xem website</a>
                            <a href="/admin/logout" class="logout">Đăng xuất</a>
                        </div>
                    </div>

                    ${content}
                </main>
            </div>
        </body>
        </html>
    `;
}

app.get("/admin/login", function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đăng nhập quản trị - INHOME Design</title>

            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                    background:
                        linear-gradient(120deg, rgba(20, 16, 12, 0.92), rgba(120, 83, 42, 0.55)),
                        url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80");
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }

                .login-wrapper {
                    width: 960px;
                    min-height: 560px;
                    display: grid;
                    grid-template-columns: 1fr 430px;
                    background: rgba(255, 250, 242, 0.96);
                    border-radius: 36px;
                    overflow: hidden;
                    box-shadow: 0 35px 100px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.35);
                }

                .login-left {
                    background:
                        linear-gradient(rgba(31, 27, 22, 0.72), rgba(31, 27, 22, 0.72)),
                        url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80");
                    background-size: cover;
                    background-position: center;
                    color: white;
                    padding: 46px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .brand-mark {
                    width: 58px;
                    height: 58px;
                    border-radius: 18px;
                    background: linear-gradient(135deg, #d8b77c, #9a6a38);
                    color: #1f1b16;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 23px;
                }

                .brand h1 {
                    font-size: 28px;
                    letter-spacing: 3px;
                }

                .brand p {
                    color: #d8b77c;
                    margin-top: 4px;
                    letter-spacing: 1px;
                }

                .intro h2 {
                    font-size: 42px;
                    line-height: 1.15;
                    margin-bottom: 18px;
                }

                .intro p {
                    color: #eadfce;
                    line-height: 1.7;
                    font-size: 17px;
                    max-width: 430px;
                }

                .login-right {
                    padding: 48px 42px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: #fffaf2;
                }

                .login-right h2 {
                    font-size: 34px;
                    color: #1f1b16;
                    margin-bottom: 10px;
                }

                .login-right .desc {
                    color: #7c6a58;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }

                .form-group {
                    margin-bottom: 18px;
                }

                label {
                    display: block;
                    font-weight: 800;
                    color: #1f1b16;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                input {
                    width: 100%;
                    padding: 16px 18px;
                    border: 1px solid #d6c4ad;
                    border-radius: 16px;
                    background: white;
                    font-size: 16px;
                    outline: none;
                    transition: 0.2s;
                }

                input:focus {
                    border-color: #9a6a38;
                    box-shadow: 0 0 0 4px rgba(154, 106, 56, 0.12);
                }

                button {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #9a6a38, #1f1b16);
                    color: white;
                    font-size: 16px;
                    font-weight: 900;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: 0.2s;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 28px rgba(154, 106, 56, 0.25);
                }

                .security-note {
                    margin-top: 24px;
                    padding: 14px;
                    border-radius: 16px;
                    background: #f1e4d2;
                    color: #5f5145;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .back-link {
                    display: block;
                    margin-top: 24px;
                    text-align: center;
                    color: #9a6a38;
                    text-decoration: none;
                    font-weight: 800;
                }

                @media (max-width: 850px) {
                    .login-wrapper {
                        grid-template-columns: 1fr;
                    }

                    .login-left {
                        min-height: 280px;
                    }

                    .intro h2 {
                        font-size: 32px;
                    }
                }
            </style>
        </head>

        <body>
            <div class="login-wrapper">
                <div class="login-left">
                    <div class="brand">
                        <div class="brand-mark">IH</div>
                        <div>
                            <h1>INHOME</h1>
                            <p>Interior Admin</p>
                        </div>
                    </div>

                    <div class="intro">
                        <h2>Quản trị website thiết kế nội thất</h2>
                        <p>
                            Theo dõi yêu cầu tư vấn, quản lý dịch vụ, dự án,
                            bảng giá và nội dung hiển thị trên website.
                        </p>
                    </div>
                </div>

                <form class="login-right" method="POST" action="/admin/login">
                    <h2>Đăng nhập</h2>
                    <p class="desc">
                        Vui lòng đăng nhập bằng tài khoản quản trị để tiếp tục.
                    </p>

                    <div class="form-group">
                        <label>Tên đăng nhập</label>
                        <input type="text" name="username" placeholder="Nhập tên đăng nhập" required>
                    </div>

                    <div class="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" placeholder="Nhập mật khẩu" required>
                    </div>

                    <button type="submit">Đăng nhập quản trị</button>

                    <div class="security-note">
                        Khu vực quản trị chỉ dành cho người có quyền truy cập hệ thống.
                    </div>

                    <a href="/" class="back-link">← Quay lại website</a>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post("/admin/login", function (req, res) {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.adminLoggedIn = true;
        res.redirect("/admin");
    } else {
        res.send(`
            <h2 style="font-family:Arial;text-align:center;margin-top:80px;">Sai tài khoản hoặc mật khẩu</h2>
            <p style="font-family:Arial;text-align:center;">
                <a href="/admin/login">Quay lại đăng nhập</a>
            </p>
        `);
    }
});

app.get("/admin", checkAdminLogin, function (req, res) {
    const recentContacts = contacts.slice(0, 5).map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.fullname || ""}</td>
                <td>${item.phone || ""}</td>
                <td>${item.service || ""}</td>
                <td><span class="badge warning">${item.status}</span></td>
                <td>${item.createdAt}</td>
            </tr>
        `;
    }).join("");

    const content = `
        <div class="cards">
            <div class="card">
                <h2>${contacts.length}</h2>
                <p>Yêu cầu tư vấn</p>
            </div>

            <div class="card">
                <h2>${services.length}</h2>
                <p>Dịch vụ</p>
            </div>

            <div class="card">
                <h2>${projects.length}</h2>
                <p>Dự án</p>
            </div>

            <div class="card">
                <h2>98%</h2>
                <p>Khách hàng hài lòng</p>
            </div>
        </div>

        <div class="panel">
            <h2>Yêu cầu tư vấn gần đây</h2>
            ${
                contacts.length === 0
                ? `<div class="empty">Chưa có yêu cầu tư vấn nào.</div>`
                : `
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Dịch vụ</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>${recentContacts}</tbody>
                    </table>
                `
            }
        </div>

        <div class="grid-2">
            <div class="panel">
                <h2>Trạng thái hệ thống</h2>
                <div class="setting-box">
                    <h3>Website</h3>
                    <p>Đang hoạt động bình thường.</p>
                </div>
                <br>
                <div class="setting-box">
                    <h3>Form tư vấn</h3>
                    <p>Đang nhận dữ liệu khách hàng từ trang liên hệ.</p>
                </div>
            </div>

            <div class="panel">
                <h2>Ghi chú quản trị</h2>
                <div class="setting-box">
                    <h3>Phiên bản demo</h3>
                    <p>Dữ liệu hiện lưu tạm trong RAM. Khi tắt server, dữ liệu sẽ mất. Có thể nâng cấp lên lưu file JSON hoặc database.</p>
                </div>
            </div>
        </div>
    `;

    res.send(adminLayout("Tổng quan", "dashboard", content));
});

app.get("/admin/contacts", checkAdminLogin, function (req, res) {
    const rows = contacts.map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.fullname || ""}</td>
                <td>${item.phone || ""}</td>
                <td>${item.email || ""}</td>
                <td>${item.service || ""}</td>
                <td>${item.message || ""}</td>
                <td><span class="badge warning">${item.status}</span></td>
                <td>${item.createdAt}</td>
                <td>
                    <form method="POST" action="/admin/contacts/delete/${item.id}">
                        <button class="btn danger" type="submit">Xóa</button>
                    </form>
                </td>
            </tr>
        `;
    }).join("");

    const content = `
        <div class="panel">
            <h2>Danh sách yêu cầu tư vấn</h2>
            ${
                contacts.length === 0
                ? `<div class="empty">Chưa có khách hàng nào gửi tư vấn.</div>`
                : `
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ tên</th>
                                <th>SĐT</th>
                                <th>Email</th>
                                <th>Dịch vụ</th>
                                <th>Nội dung</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                `
            }
        </div>
    `;

    res.send(adminLayout("Yêu cầu tư vấn", "contacts", content));
});

app.post("/admin/contacts/delete/:id", checkAdminLogin, function (req, res) {
    const id = Number(req.params.id);
    contacts = contacts.filter(function (item) {
        return item.id !== id;
    });
    res.redirect("/admin/contacts");
});

app.get("/admin/services", checkAdminLogin, function (req, res) {
    const rows = services.map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><span class="badge">${item.status}</span></td>
                <td><a class="btn" href="#">Sửa</a></td>
            </tr>
        `;
    }).join("");

    const content = `
        <div class="panel">
            <h2>Quản lý dịch vụ</h2>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên dịch vụ</th>
                        <th>Giá tham khảo</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;

    res.send(adminLayout("Quản lý dịch vụ", "services", content));
});

app.get("/admin/projects", checkAdminLogin, function (req, res) {
    const rows = projects.map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.area}</td>
                <td><span class="badge dark">${item.status}</span></td>
                <td><a class="btn" href="#">Chi tiết</a></td>
            </tr>
        `;
    }).join("");

    const content = `
        <div class="panel">
            <h2>Quản lý dự án</h2>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên dự án</th>
                        <th>Loại công trình</th>
                        <th>Diện tích</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;

    res.send(adminLayout("Quản lý dự án", "projects", content));
});

app.get("/admin/pricing", checkAdminLogin, function (req, res) {
    const content = `
        <div class="cards">
            <div class="card">
                <h2>150K</h2>
                <p>Gói cơ bản / m²</p>
            </div>

            <div class="card">
                <h2>250K</h2>
                <p>Gói tiêu chuẩn / m²</p>
            </div>

            <div class="card">
                <h2>Liên hệ</h2>
                <p>Gói cao cấp</p>
            </div>

            <div class="card">
                <h2>3</h2>
                <p>Gói dịch vụ</p>
            </div>
        </div>

        <div class="panel">
            <h2>Thông tin bảng giá</h2>
            <table>
                <thead>
                    <tr>
                        <th>Gói</th>
                        <th>Giá</th>
                        <th>Phù hợp</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Cơ bản</td>
                        <td>150.000đ/m²</td>
                        <td>Căn hộ nhỏ, thiết kế đơn giản</td>
                        <td><span class="badge">Đang hiển thị</span></td>
                    </tr>
                    <tr>
                        <td>Tiêu chuẩn</td>
                        <td>250.000đ/m²</td>
                        <td>Nhà ở, căn hộ, văn phòng</td>
                        <td><span class="badge">Đang hiển thị</span></td>
                    </tr>
                    <tr>
                        <td>Cao cấp</td>
                        <td>Liên hệ</td>
                        <td>Thiết kế cá nhân hóa, thi công trọn gói</td>
                        <td><span class="badge">Đang hiển thị</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    res.send(adminLayout("Bảng giá", "pricing", content));
});

app.get("/admin/settings", checkAdminLogin, function (req, res) {
    const content = `
        <div class="grid-2">
            <div class="panel">
                <h2>Thông tin website</h2>
                <div class="setting-box">
                    <h3>Tên website</h3>
                    <p>INHOME Design - Thiết kế nội thất cao cấp</p>
                </div>
                <br>
                <div class="setting-box">
                    <h3>Đường dẫn local</h3>
                    <p>http://localhost:3000</p>
                </div>
                <br>
                <div class="setting-box">
                    <h3>Chế độ</h3>
                    <p>Demo đồ án cá nhân</p>
                </div>
            </div>

            <div class="panel">
                <h2>Tài khoản quản trị</h2>
                <div class="setting-box">
                    <h3>Username</h3>
                    <p>admin</p>
                </div>
                <br>
                <div class="setting-box">
                    <h3>Mật khẩu</h3>
                    <p>admin</p>
                </div>
                <br>
                <div class="setting-box">
                    <h3>Bảo mật</h3>
                    <p>Đăng nhập bằng session. Có thể nâng cấp thêm mã hóa mật khẩu và database.</p>
                </div>
            </div>
        </div>
    `;

    res.send(adminLayout("Cài đặt", "settings", content));
});

app.get("/admin/logout", function (req, res) {
    req.session.destroy(function () {
        res.redirect("/admin/login");
    });
});

app.listen(PORT, "0.0.0.0", function () {
    console.log("Website đang chạy tại:");
    console.log("http://localhost:" + PORT);
    console.log("Admin: http://localhost:" + PORT + "/admin");
});
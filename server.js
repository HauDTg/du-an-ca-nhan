const express = require("express");
const path = require("path");
const helmet = require("helmet");
const session = require("express-session");
const nodemailer = require("nodemailer");
require("dotenv").config();

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
            maxAge: 2 * 60 * 60 * 1000
        }
    })
);

app.use("/public", express.static(path.join(__dirname, "public")));

let requests = [];

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function escapeHtml(value) {
    if (!value) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function requireAdmin(req, res, next) {
    if (req.session.adminLoggedIn) {
        return next();
    }

    res.redirect("/admin/login");
}

function getStatusClass(status) {
    if (status === "Đang xử lý") return "processing";
    if (status === "Đã xử lý") return "done";
    return "new";
}

function getStatusBadge(status) {
    return `<span class="status-badge ${getStatusClass(status)}">${status}</span>`;
}

function adminLayout(title, activePage, content) {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - INHOME Admin</title>

    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Be Vietnam Pro", Arial, sans-serif;
            background: #f4efe7;
            color: #1e1a16;
        }

        a {
            text-decoration: none;
        }

        button,
        input,
        select {
            font-family: "Be Vietnam Pro", Arial, sans-serif;
        }

        .layout {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 290px 1fr;
        }

        .sidebar {
            background:
                radial-gradient(circle at top left, rgba(216, 183, 124, 0.18), transparent 35%),
                linear-gradient(180deg, #1e1a16, #0f0c09);
            color: white;
            padding: 28px 22px;
            position: sticky;
            top: 0;
            height: 100vh;
            box-shadow: 18px 0 60px rgba(0, 0, 0, 0.18);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 26px;
            margin-bottom: 26px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .brand-logo {
            width: 58px;
            height: 58px;
            border-radius: 20px;
            background: linear-gradient(135deg, #d8b77c, #9a6a38);
            color: #1e1a16;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 20px;
        }

        .brand h2 {
            font-size: 23px;
            letter-spacing: 2px;
        }

        .brand p {
            color: #d8b77c;
            font-size: 13px;
            margin-top: 4px;
        }

        .menu-title {
            color: #9f9283;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 24px 14px 12px;
        }

        .menu a {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #d7c9b7;
            padding: 14px 16px;
            border-radius: 16px;
            margin-bottom: 8px;
            font-weight: 800;
            transition: 0.2s;
        }

        .menu a:hover,
        .menu a.active {
            background: rgba(216, 183, 124, 0.16);
            color: white;
            transform: translateX(4px);
        }

        .main {
            padding: 32px;
        }

        .topbar {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            border: 1px solid #eadfce;
            border-radius: 28px;
            padding: 24px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 28px;
            box-shadow: 0 18px 55px rgba(31, 27, 22, 0.08);
        }

        .topbar h1 {
            font-size: 31px;
            margin-bottom: 5px;
        }

        .topbar p {
            color: #6b5a4b;
        }

        .top-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .top-actions a {
            color: white;
            background: #1e1a16;
            padding: 12px 18px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 14px;
        }

        .top-actions a.primary {
            background: #9a6a38;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 28px;
        }

        .card {
            background: white;
            padding: 26px;
            border-radius: 26px;
            border: 1px solid #eadfce;
            box-shadow: 0 18px 55px rgba(31, 27, 22, 0.08);
            position: relative;
            overflow: hidden;
        }

        .card::after {
            content: "";
            width: 130px;
            height: 130px;
            position: absolute;
            right: -45px;
            bottom: -45px;
            background: rgba(216, 183, 124, 0.16);
            border-radius: 50%;
        }

        .card p {
            color: #6b5a4b;
            font-weight: 800;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
        }

        .card h2 {
            color: #9a6a38;
            font-size: 38px;
            position: relative;
            z-index: 2;
        }

        .panel {
            background: white;
            border: 1px solid #eadfce;
            border-radius: 26px;
            padding: 26px;
            box-shadow: 0 18px 55px rgba(31, 27, 22, 0.08);
            margin-bottom: 24px;
        }

        .panel-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 18px;
            margin-bottom: 22px;
        }

        .panel-title h2 {
            font-size: 24px;
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        .toolbar form {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        input,
        select {
            padding: 12px 14px;
            border: 1px solid #d6c4ad;
            border-radius: 13px;
            outline: none;
            min-width: 170px;
            background: white;
        }

        input:focus,
        select:focus {
            border-color: #9a6a38;
            box-shadow: 0 0 0 4px rgba(154, 106, 56, 0.12);
        }

        .btn {
            border: none;
            padding: 12px 16px;
            border-radius: 13px;
            background: #9a6a38;
            color: white;
            font-weight: 900;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
        }

        .btn.dark {
            background: #1e1a16;
        }

        .btn.danger {
            background: #dc2626;
        }

        .btn.light {
            background: #efe4d3;
            color: #1e1a16;
        }

        .table-wrap {
            overflow-x: auto;
            border-radius: 20px;
            border: 1px solid #eadfce;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1050px;
        }

        th {
            background: #1e1a16;
            color: white;
            padding: 16px;
            text-align: left;
            font-size: 14px;
        }

        td {
            padding: 16px;
            border-bottom: 1px solid #eadfce;
            vertical-align: top;
            font-size: 14px;
            color: #4e4034;
        }

        tr:hover td {
            background: #fff7ed;
        }

        td small {
            display: block;
            color: #7c6a58;
            margin-top: 5px;
        }

        .status-badge {
            display: inline-block;
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
        }

        .status-badge.new {
            background: #fef3c7;
            color: #92400e;
        }

        .status-badge.processing {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .status-badge.done {
            background: #dcfce7;
            color: #166534;
        }

        .action-form {
            display: inline-block;
            margin-right: 6px;
            margin-bottom: 6px;
        }

        .action-form select {
            min-width: 130px;
            padding: 8px;
        }

        .empty {
            text-align: center;
            padding: 46px;
            border-radius: 22px;
            background: #fff7ed;
            color: #6b5a4b;
            font-weight: 800;
        }

        .settings-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .setting-box {
            background: #fff7ed;
            border: 1px solid #eadfce;
            border-radius: 22px;
            padding: 24px;
        }

        .setting-box h3 {
            margin-bottom: 12px;
        }

        .setting-box p {
            color: #6b5a4b;
            line-height: 1.7;
            margin-bottom: 8px;
        }

        @media (max-width: 1100px) {
            .layout {
                grid-template-columns: 1fr;
            }

            .sidebar {
                height: auto;
                position: static;
            }

            .cards,
            .settings-grid {
                grid-template-columns: 1fr;
            }

            .topbar {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="layout">
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-logo">IHD</div>
                <div>
                    <h2>INHOME</h2>
                    <p>Admin Control</p>
                </div>
            </div>

            <nav class="menu">
                <div class="menu-title">Quản trị</div>
                <a class="${activePage === "dashboard" ? "active" : ""}" href="/admin">📊 Tổng quan</a>
                <a class="${activePage === "requests" ? "active" : ""}" href="/admin/requests">📩 Yêu cầu tư vấn</a>
                <a class="${activePage === "settings" ? "active" : ""}" href="/admin/settings">⚙️ Cài đặt</a>

                <div class="menu-title">Website</div>
                <a href="/">🌐 Xem website</a>
                <a href="/admin/export">📥 Xuất CSV</a>
                <a href="/admin/logout">🚪 Đăng xuất</a>
            </nav>
        </aside>

        <main class="main">
            <div class="topbar">
                <div>
                    <h1>${title}</h1>
                    <p>Quản lý khách hàng gửi yêu cầu tư vấn từ website INHOME Design.</p>
                </div>

                <div class="top-actions">
                    <a href="/">Xem website</a>
                    <a class="primary" href="/admin/logout">Đăng xuất</a>
                </div>
            </div>

            ${content}
        </main>
    </div>
</body>
</html>
    `;
}

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/contact", async function (req, res) {
    const { fullname, phone, email, service, message } = req.body;

    if (!fullname || !phone || !email || !service) {
        return res.json({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }

    const newRequest = {
        id: Date.now(),
        fullname: escapeHtml(fullname),
        phone: escapeHtml(phone),
        email: escapeHtml(email),
        service: escapeHtml(service),
        message: escapeHtml(message || ""),
        status: "Mới",
        createdAt: new Date().toLocaleString("vi-VN")
    };

    requests.unshift(newRequest);

    try {
        if (process.env.MAIL_USER && process.env.MAIL_PASS && process.env.MAIL_TO) {
            await mailTransporter.sendMail({
                from: `"INHOME Design" <${process.env.MAIL_USER}>`,
                to: process.env.MAIL_TO,
                subject: "Yêu cầu tư vấn mới từ website INHOME Design",
                html: `
                    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
                        <h2 style="color:#9a6a38;">Yêu cầu tư vấn mới</h2>
                        <p><b>Họ tên:</b> ${newRequest.fullname}</p>
                        <p><b>Số điện thoại:</b> ${newRequest.phone}</p>
                        <p><b>Email:</b> ${newRequest.email}</p>
                        <p><b>Dịch vụ:</b> ${newRequest.service}</p>
                        <p><b>Nội dung:</b> ${newRequest.message || "Không có"}</p>
                        <p><b>Thời gian:</b> ${newRequest.createdAt}</p>
                        <hr>
                        <p>Truy cập trang admin để quản lý yêu cầu này.</p>
                    </div>
                `
            });
        }

        res.json({
            success: true,
            message: "Gửi yêu cầu tư vấn thành công!"
        });
    } catch (error) {
        console.error("Lỗi gửi email:", error);

        res.json({
            success: true,
            message: "Đã lưu yêu cầu. Email thông báo chưa gửi được."
        });
    }
});

app.get("/admin/login", function (req, res) {
    res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập Admin</title>

    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            font-family: "Be Vietnam Pro", Arial, sans-serif;
            background:
                linear-gradient(120deg, rgba(20,16,12,0.92), rgba(120,83,42,0.65)),
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
            background: rgba(255,250,242,0.96);
            border-radius: 36px;
            overflow: hidden;
            box-shadow: 0 35px 100px rgba(0,0,0,0.4);
        }

        .login-left {
            background:
                linear-gradient(rgba(31,27,22,0.74), rgba(31,27,22,0.74)),
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
            color: #1e1a16;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
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
            margin-bottom: 10px;
        }

        .desc {
            color: #7c6a58;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        label {
            display: block;
            font-weight: 800;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            padding: 16px 18px;
            border: 1px solid #d6c4ad;
            border-radius: 16px;
            font-size: 16px;
            outline: none;
            margin-bottom: 18px;
        }

        input:focus {
            border-color: #9a6a38;
            box-shadow: 0 0 0 4px rgba(154,106,56,0.12);
        }

        button {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 999px;
            background: linear-gradient(135deg, #9a6a38, #1e1a16);
            color: white;
            font-size: 16px;
            font-weight: 900;
            cursor: pointer;
            margin-top: 8px;
        }

        .back {
            display: block;
            margin-top: 24px;
            text-align: center;
            color: #9a6a38;
            font-weight: 800;
            text-decoration: none;
        }

        @media (max-width: 850px) {
            .login-wrapper {
                grid-template-columns: 1fr;
            }

            .login-left {
                min-height: 280px;
            }
        }
    </style>
</head>
<body>
    <div class="login-wrapper">
        <div class="login-left">
            <div class="brand">
                <div class="brand-mark">IHD</div>
                <div>
                    <h1>INHOME</h1>
                    <p>Admin Control</p>
                </div>
            </div>

            <div class="intro">
                <h2>Quản lý yêu cầu tư vấn khách hàng</h2>
                <p>Theo dõi thông tin khách hàng, trạng thái xử lý và email thông báo từ website.</p>
            </div>
        </div>

        <form class="login-right" method="POST" action="/admin/login">
            <h2>Đăng nhập</h2>
            <p class="desc">Vui lòng nhập tài khoản quản trị để tiếp tục.</p>

            <label>Tên đăng nhập</label>
            <input type="text" name="username" placeholder="Nhập tài khoản" required>

            <label>Mật khẩu</label>
            <input type="password" name="password" placeholder="Nhập mật khẩu" required>

            <button type="submit">Đăng nhập quản trị</button>
            <a class="back" href="/">← Quay lại website</a>
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

app.get("/admin", requireAdmin, function (req, res) {
    const total = requests.length;
    const newCount = requests.filter(item => item.status === "Mới").length;
    const processingCount = requests.filter(item => item.status === "Đang xử lý").length;
    const doneCount = requests.filter(item => item.status === "Đã xử lý").length;

    const recentRows = requests.slice(0, 5).map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td><b>${item.fullname}</b><small>${item.email}</small></td>
                <td>${item.phone}</td>
                <td>${item.service}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>${item.createdAt}</td>
            </tr>
        `;
    }).join("");

    const content = `
        <div class="cards">
            <div class="card"><p>Tổng yêu cầu</p><h2>${total}</h2></div>
            <div class="card"><p>Yêu cầu mới</p><h2>${newCount}</h2></div>
            <div class="card"><p>Đang xử lý</p><h2>${processingCount}</h2></div>
            <div class="card"><p>Đã xử lý</p><h2>${doneCount}</h2></div>
        </div>

        <div class="panel">
            <div class="panel-title">
                <h2>Yêu cầu gần đây</h2>
                <a class="btn" href="/admin/requests">Xem tất cả</a>
            </div>

            ${
                requests.length === 0
                ? `<div class="empty">Chưa có yêu cầu tư vấn nào.</div>`
                : `
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Khách hàng</th>
                                    <th>SĐT</th>
                                    <th>Dịch vụ</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>${recentRows}</tbody>
                        </table>
                    </div>
                `
            }
        </div>
    `;

    res.send(adminLayout("Tổng quan", "dashboard", content));
});

app.get("/admin/requests", requireAdmin, function (req, res) {
    const keyword = escapeHtml(req.query.keyword || "").toLowerCase();
    const status = escapeHtml(req.query.status || "");

    let filtered = requests;

    if (keyword) {
        filtered = filtered.filter(item => {
            return (
                item.fullname.toLowerCase().includes(keyword) ||
                item.phone.toLowerCase().includes(keyword) ||
                item.email.toLowerCase().includes(keyword) ||
                item.service.toLowerCase().includes(keyword)
            );
        });
    }

    if (status) {
        filtered = filtered.filter(item => item.status === status);
    }

    const rows = filtered.map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td><b>${item.fullname}</b><small>${item.email}</small></td>
                <td>${item.phone}</td>
                <td>${item.service}</td>
                <td>${item.message || "Không có"}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>${item.createdAt}</td>
                <td>
                    <form class="action-form" method="POST" action="/admin/requests/update/${item.id}">
                        <select name="status">
                            <option ${item.status === "Mới" ? "selected" : ""}>Mới</option>
                            <option ${item.status === "Đang xử lý" ? "selected" : ""}>Đang xử lý</option>
                            <option ${item.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option>
                        </select>
                        <button class="btn" type="submit">Lưu</button>
                    </form>

                    <form class="action-form" method="POST" action="/admin/requests/delete/${item.id}" onsubmit="return confirm('Bạn chắc chắn muốn xóa yêu cầu này?')">
                        <button class="btn danger" type="submit">Xóa</button>
                    </form>
                </td>
            </tr>
        `;
    }).join("");

    const content = `
        <div class="panel">
            <div class="toolbar">
                <form method="GET" action="/admin/requests">
                    <input type="text" name="keyword" placeholder="Tìm tên, email, SĐT..." value="${keyword}">
                    <select name="status">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Mới" ${status === "Mới" ? "selected" : ""}>Mới</option>
                        <option value="Đang xử lý" ${status === "Đang xử lý" ? "selected" : ""}>Đang xử lý</option>
                        <option value="Đã xử lý" ${status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option>
                    </select>
                    <button class="btn dark" type="submit">Lọc</button>
                    <a class="btn light" href="/admin/requests">Xóa lọc</a>
                </form>

                <a class="btn" href="/admin/export">Xuất CSV</a>
            </div>

            ${
                filtered.length === 0
                ? `<div class="empty">Không có yêu cầu phù hợp.</div>`
                : `
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Khách hàng</th>
                                    <th>SĐT</th>
                                    <th>Dịch vụ</th>
                                    <th>Nội dung</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                `
            }
        </div>
    `;

    res.send(adminLayout("Yêu cầu tư vấn", "requests", content));
});

app.post("/admin/requests/update/:id", requireAdmin, function (req, res) {
    const id = Number(req.params.id);
    const status = req.body.status;

    const requestItem = requests.find(item => item.id === id);

    if (requestItem && ["Mới", "Đang xử lý", "Đã xử lý"].includes(status)) {
        requestItem.status = status;
    }

    res.redirect("/admin/requests");
});

app.post("/admin/requests/delete/:id", requireAdmin, function (req, res) {
    const id = Number(req.params.id);

    requests = requests.filter(item => item.id !== id);

    res.redirect("/admin/requests");
});

app.get("/admin/settings", requireAdmin, function (req, res) {
    const content = `
        <div class="settings-grid">
            <div class="setting-box">
                <h3>Tài khoản quản trị</h3>
                <p><b>Username:</b> ${ADMIN_USERNAME}</p>
                <p><b>Password:</b> lấy từ file .env dòng ADMIN_PASSWORD</p>
            </div>

            <div class="setting-box">
                <h3>Email thông báo</h3>
                <p><b>Gửi từ:</b> ${process.env.MAIL_USER || "Chưa cấu hình"}</p>
                <p><b>Gửi đến:</b> ${process.env.MAIL_TO || "Chưa cấu hình"}</p>
            </div>

            <div class="setting-box">
                <h3>Chức năng admin</h3>
                <p>Dashboard, quản lý yêu cầu, tìm kiếm, lọc trạng thái, cập nhật trạng thái, xóa yêu cầu, xuất CSV.</p>
            </div>

            <div class="setting-box">
                <h3>Lưu trữ dữ liệu</h3>
                <p>Hiện dữ liệu đang lưu tạm trong RAM. Nếu VPS restart, dữ liệu yêu cầu sẽ mất.</p>
                <p>Bước nâng cấp tiếp theo nên dùng JSON file hoặc database.</p>
            </div>
        </div>
    `;

    res.send(adminLayout("Cài đặt hệ thống", "settings", content));
});

app.get("/admin/export", requireAdmin, function (req, res) {
    const header = "STT,Ho ten,So dien thoai,Email,Dich vu,Noi dung,Trang thai,Thoi gian\n";

    const rows = requests.map(function (item, index) {
        return [
            index + 1,
            `"${item.fullname}"`,
            `"${item.phone}"`,
            `"${item.email}"`,
            `"${item.service}"`,
            `"${item.message}"`,
            `"${item.status}"`,
            `"${item.createdAt}"`
        ].join(",");
    }).join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=yeu-cau-tu-van.csv");
    res.send("\uFEFF" + header + rows);
});

app.get("/admin/logout", function (req, res) {
    req.session.destroy(function () {
        res.redirect("/admin/login");
    });
});

// ========== API ENDPOINTS FOR ADMIN PANEL ==========

// Store data in memory (in production, use database)
let customers = [];
let projects = [];
let services = [
    { id: 1, name: 'Thiết kế căn hộ', price: '250000', description: 'Bản vẽ 2D, 3D, dự toán vật liệu' },
    { id: 2, name: 'Thi công nội thất', price: 'Theo báo giá', description: 'Sản xuất, lắp đặt, giám sát' }
];
let orders = [];
let testimonials = [];
let messages = [];

// API: Get all customers
app.get("/api/customers", requireAdmin, (req, res) => {
    res.json({ success: true, data: customers });
});

// API: Add customer
app.post("/api/customers", requireAdmin, (req, res) => {
    const { fullname, email, phone, service, message } = req.body;
    const newCustomer = {
        id: customers.length + 1,
        fullname: escapeHtml(fullname),
        email: escapeHtml(email),
        phone: escapeHtml(phone),
        service: escapeHtml(service),
        message: escapeHtml(message),
        createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    res.json({ success: true, data: newCustomer });
});

// API: Update customer
app.put("/api/customers/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const customer = customers.find(c => c.id == id);
    if (!customer) return res.status(404).json({ success: false, message: 'Khách hàng không tồn tại' });
    
    Object.assign(customer, req.body);
    res.json({ success: true, data: customer });
});

// API: Delete customer
app.delete("/api/customers/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    customers = customers.filter(c => c.id != id);
    res.json({ success: true, message: 'Xóa khách hàng thành công' });
});

// API: Get all projects
app.get("/api/projects", requireAdmin, (req, res) => {
    res.json({ success: true, data: projects });
});

// API: Add project
app.post("/api/projects", requireAdmin, (req, res) => {
    const { projectname, type, customer, area, budget, status } = req.body;
    const newProject = {
        id: projects.length + 1,
        name: escapeHtml(projectname),
        type: escapeHtml(type),
        customer: escapeHtml(customer),
        area: parseInt(area),
        budget: parseInt(budget),
        status: escapeHtml(status),
        progress: 0,
        createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    res.json({ success: true, data: newProject });
});

// API: Update project
app.put("/api/projects/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if (!project) return res.status(404).json({ success: false, message: 'Dự án không tồn tại' });
    
    Object.assign(project, req.body);
    res.json({ success: true, data: project });
});

// API: Delete project
app.delete("/api/projects/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    projects = projects.filter(p => p.id != id);
    res.json({ success: true, message: 'Xóa dự án thành công' });
});

// API: Get all services
app.get("/api/services", requireAdmin, (req, res) => {
    res.json({ success: true, data: services });
});

// API: Add service
app.post("/api/services", requireAdmin, (req, res) => {
    const { servicename, price, description } = req.body;
    const newService = {
        id: services.length + 1,
        name: escapeHtml(servicename),
        price: escapeHtml(price),
        description: escapeHtml(description),
        createdAt: new Date().toISOString()
    };
    services.push(newService);
    res.json({ success: true, data: newService });
});

// API: Update service
app.put("/api/services/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const service = services.find(s => s.id == id);
    if (!service) return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại' });
    
    Object.assign(service, req.body);
    res.json({ success: true, data: service });
});

// API: Delete service
app.delete("/api/services/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    services = services.filter(s => s.id != id);
    res.json({ success: true, message: 'Xóa dịch vụ thành công' });
});

// API: Get all orders
app.get("/api/orders", requireAdmin, (req, res) => {
    res.json({ success: true, data: orders });
});

// API: Get all testimonials
app.get("/api/testimonials", requireAdmin, (req, res) => {
    res.json({ success: true, data: testimonials });
});

// API: Delete testimonial
app.delete("/api/testimonials/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    testimonials = testimonials.filter(t => t.id != id);
    res.json({ success: true, message: 'Xóa đánh giá thành công' });
});

// API: Get all messages
app.get("/api/messages", requireAdmin, (req, res) => {
    res.json({ success: true, data: messages });
});

// API: Get stats for dashboard
app.get("/api/stats", requireAdmin, (req, res) => {
    res.json({
        success: true,
        data: {
            totalProjects: projects.length,
            totalCustomers: customers.length,
            totalRevenue: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
            averageRating: 4.8
        }
    });
});

app.listen(PORT, "127.0.0.1", function () {
    console.log("Website đang chạy tại port " + PORT);
});
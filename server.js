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
        secret: "inhome_admin_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);

app.use("/public", express.static(path.join(__dirname, "public")));

let contacts = [];

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
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

app.get("/admin/login", function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đăng nhập Admin</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #100d0a, #9a6a38);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-box {
                    width: 420px;
                    background: #fffaf2;
                    padding: 40px;
                    border-radius: 28px;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.35);
                }

                .login-box h1 {
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 34px;
                    color: #1e1a16;
                }

                .login-box p {
                    text-align: center;
                    color: #7c6a58;
                    margin-bottom: 30px;
                }

                .form-group {
                    margin-bottom: 18px;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 800;
                    color: #1e1a16;
                }

                input {
                    width: 100%;
                    padding: 15px;
                    border: 1px solid #d6c4ad;
                    border-radius: 14px;
                    font-size: 16px;
                    outline: none;
                }

                input:focus {
                    border-color: #9a6a38;
                }

                button {
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 40px;
                    background: #1e1a16;
                    color: white;
                    font-size: 16px;
                    font-weight: 900;
                    cursor: pointer;
                }

                .back {
                    display: block;
                    margin-top: 22px;
                    text-align: center;
                    color: #9a6a38;
                    font-weight: 800;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <form class="login-box" method="POST" action="/admin/login">
                <h1>Admin Panel</h1>
                <p>INHOME Design Management</p>

                <div class="form-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" name="username" required>
                </div>

                <div class="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" name="password" required>
                </div>

                <button type="submit">Đăng nhập</button>

                <a class="back" href="/">← Quay lại website</a>
            </form>
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
    const rows = contacts.map(function (item, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.fullname || ""}</td>
                <td>${item.phone || ""}</td>
                <td>${item.email || ""}</td>
                <td>${item.service || ""}</td>
                <td>${item.message || ""}</td>
                <td>${item.createdAt}</td>
            </tr>
        `;
    }).join("");

    res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Admin - INHOME Design</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f5efe6;
                    padding: 30px;
                }

                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                h1 {
                    color: #1e1a16;
                }

                a {
                    color: white;
                    background: #1e1a16;
                    padding: 12px 20px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-weight: 800;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                }

                th, td {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    text-align: left;
                }

                th {
                    background: #1e1a16;
                    color: white;
                }

                .empty {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    text-align: center;
                    color: #6b5a4b;
                    font-weight: 800;
                }
            </style>
        </head>
        <body>
            <div class="top">
                <h1>Quản lý yêu cầu tư vấn</h1>
                <div>
                    <a href="/">Xem website</a>
                    <a href="/admin/logout">Đăng xuất</a>
                </div>
            </div>

            ${
                contacts.length === 0
                ? `<div class="empty">Chưa có yêu cầu tư vấn nào.</div>`
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
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                `
            }
        </body>
        </html>
    `);
});

app.get("/admin/logout", function (req, res) {
    req.session.destroy(function () {
        res.redirect("/admin/login");
    });
});

app.listen(PORT, "127.0.0.1", function () {
    console.log("Website đang chạy tại port " + PORT);
});
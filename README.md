


---
 <p align="center">
 <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

</p>



[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest



  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

    <p align="center">

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

</p>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
---

## 📌 Các Tính Năng Đã Hoàn Thành (Module)

Hệ thống được thiết kế hoàn thiện bao gồm các trục nghiệp vụ API:
* **🔑 Authentication:** Đăng ký, Đăng nhập và bốc tách Mapper Token JWT.
* **👥 Users/Staffs:** Quản lý Profile người dùng và CRUD tài khoản Nhân viên dành cho Admin.
* **📂 Categories:** Quản lý hệ thống phân loại danh mục các món ăn.
* **🍲 Foods:** Quản lý món ăn đặc sản, gán ghép liên kết danh mục.
* **🏪 Restaurants:** Quản lý thông tin quán ăn, GPS (Tọa độ) và bóc tách gán món ăn bán tại quán.
* **☁️ Upload:** Tích hợp đẩy File phương tiện (Hình ảnh/Audio) phục vụ lưu trữ đa phương tiện.
* **📜 Swagger (OpenAPI):** Tự động sinh tài liệu API đẹp mắt thay thế Postman.

---

## ⚙️ Cấu Hình Môi Trường (`.env`)

Tạo tệp tin `.env` tại thư mục gốc của dự án và dán cấu hình này vào:

```env
PORT=8080

PORT=8080
DATABASE_URL=mongodb+srv://duonght2004itsgu:D123123@bibi0.dfywgav.mongodb.net/?appName=bibi0
JWT_SECRET=xuoDKj98ZOBQKB8jEL2pT4K9jpTa8os
CLOUDINARY_CLOUD_NAME=ddlac1r3q
CLOUDINARY_API_KEY=167465238118624
CLOUDINARY_API_SECRET=DtlB86WPRXx9KzBiHgY8dD-2fbw
```

---

## 🛠️ Cài Đặt và Khởi Chạy dự án

### 1. Cài đặt các thư viện (Dependencies)
```bash
$ npm install
```

### 2. Khởi chạy dự án (Running the app)
```bash
# Chế độ phát triển (Watch mode - Tự động tải lại file khi sửa code)
$ npm run dev

# Chế độ Production (Vận hành thực tế)
$ npm run start:prod
```

### 3. Kiểm thử dự án (Run tests)
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

---

## 📜 Tài Liệu APIs - Swagger UI

Dự án đã tích hợp sẵn Swagger UI thay thế các tệp Postman cồng kềnh. Khi máy chủ chạy, bạn có thể xem chi tiết mô tả và bấm thử nghiệm gọi API tại:

👉 **Địa chỉ Docs:** `http://localhost:8080/api/v1/docs`

---

## 🧑‍💻 Nhóm Tác Giả


```

---


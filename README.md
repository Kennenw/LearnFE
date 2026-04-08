# 🛍️ Clothing Shop Management System

## 📌 1. Overview

Hệ thống web giúp chủ shop quần áo quản lý: - Sản phẩm (size, màu) - Đơn
hàng - Người dùng (Owner, Staff, Customer) - Tồn kho - Doanh thu

------------------------------------------------------------------------

## 👤 3. User & Roles

-   Owner: toàn quyền
-   Staff: quản lý sản phẩm, đơn
-   Customer: mua hàng

----------------------------------------------------------------------

## 🎯 5. Features

### User

-   CRUD user
-   Role-based
### Category
- CRUD Category
- Dùng để phân loại sản phẩm

### Brand
- CRUD Brand
- Dùng để xác định thương hiệu sản phẩm
### Product

-   CRUD sản phẩm
-   Category, Brand

### Product Variant

-   Size, Color, SKU
-   Stock

### Order

-   Tạo đơn
-   Update status

### Dashboard

-   Doanh thu
-   Sản phẩm bán chạy

------------------------------------------------------------------------

## 🧩 6. Entities

-   User
-   Product
-   ProductVariant
-   Category
-   Brand
-   Order
-   OrderDetail

------------------------------------------------------------------------

## 🧠 7. Business Rules

-   Variant tách riêng
-   Stock theo variant
-   OrderDetail lưu giá
-   Không cho mua khi hết hàng

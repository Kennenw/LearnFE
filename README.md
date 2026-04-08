# 🛍️ Clothing Shop Management System

## 📌 1. Overview
Hệ thống web giúp chủ shop quần áo quản lý toàn bộ hoạt động kinh doanh:

- Quản lý sản phẩm (size, màu)
- Quản lý đơn hàng
- Quản lý người dùng (Owner, Staff, Customer)
- Theo dõi tồn kho
- Xem báo cáo doanh thu

---

## 👤 2. User & Roles

Hệ thống sử dụng **1 bảng User duy nhất**, phân quyền theo Role:

- **Owner**: toàn quyền hệ thống
- **Staff**: quản lý sản phẩm và đơn hàng
- **Customer**: mua hàng

---

## 🎯 3. Functional Requirements

### 3.1 User Management
- CRUD User (Owner)
- Fields:
  - Username
  - Password (hash)
  - Name
  - Role

---

### 3.2 Category Management
- CRUD Category
- Dùng để phân loại sản phẩm

---

### 3.3 Brand Management
- CRUD Brand
- Dùng để xác định thương hiệu

---

### 3.4 Product Management
- CRUD sản phẩm
- Bắt buộc chọn:
  - Category
  - Brand

---

### 3.5 Product Variant (Core 🔥)

Mỗi sản phẩm có nhiều biến thể:

- Size (S, M, L, XL)
- Color
- Price (optional override)
- Stock Quantity

---

### 3.6 Order Management

- Xem danh sách đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái

#### Order Status:
- Pending
- Confirmed
- Shipping
- Completed
- Cancelled

---

### 3.7 Order Detail
- ProductVariantId
- Quantity
- Price (tại thời điểm mua)

---

### 3.8 Inventory Management

- Theo dõi tồn kho theo ProductVariant
---

### 3.10 Dashboard

- Doanh thu theo ngày/tháng
- Tổng số đơn hàng
- Sản phẩm bán chạy
- Cảnh báo sản phẩm sắp hết hàng

---

## 🧩 4. System Entities

### Core:
- User
- Product
- ProductVariant
- Category
- Brand

### Business:
- Order
- OrderDetail

---

## 🧠 5. Business Rules

- User dùng chung 1 bảng → phân quyền bằng Role
- Product phải có Category và Brand
- Không lưu size/màu trong Product → dùng ProductVariant
- Stock quản lý theo ProductVariant
- OrderDetail lưu giá tại thời điểm mua
- Không cho đặt hàng khi hết hàng
- Chỉ hỗ trợ thanh toán COD

---

## ✅ 6. Conclusion

Hệ thống tập trung vào:

- Quản lý sản phẩm theo variant (size, màu)
- Kiểm soát tồn kho chính xác
- Quản lý user bằng role trong 1 bảng
- Xử lý đơn hàng đơn giản (COD)
- Triển khai nhanh với kiến trúc monolith

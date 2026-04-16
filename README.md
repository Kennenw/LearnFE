# 1. Label CacheMode

### Glyph là gì?

**Glyph** là biểu diễn đồ họa cụ thể của một ký tự (chữ cái, số, ký hiệu) trong một font nhất định.

### Rasterize là gì?

**Rasterize** là quá trình chuyển đổi dữ liệu dạng vector (font, shape) thành ảnh pixel (bitmap) để GPU có thể render.

## 1. Cách CPU dựng text (Glyph Pipeline)

Khi set text cho Label:

1. Engine đọc font
2. CPU thực hiện:
   - Lấy từng ký tự
   - Tìm glyph tương ứng trong font
   - Rasterize → chuyển thành pixel
3. Tạo texture chứa text
4. GPU render texture đó lên màn hình

## 2. Label CacheMode là gì?

**Label CacheMode** là cơ chế tối ưu hóa render text bằng cách **cache kết quả vẽ text**, tránh việc dựng lại từ đầu mỗi frame.

### Mục tiêu:

- Giảm **draw call**
- Giảm chi phí CPU khi dựng glyph
- Tăng hiệu năng render UI

## 3. Tại sao cần CacheMode?

### Pipeline render mặc định:

Mỗi Label khi render sẽ:

1. Phân tích text
2. Rasterize font → tạo glyph
3. Upload lên GPU
4. Draw

### Nếu không cache:

- Text bị xử lý lại mỗi frame
- Mỗi Label có thể tạo 1 draw call riêng
- Nhiều Label → draw call tăng mạnh → giảm FPS

## 4. Nguyên lý hoạt động

### Không cache:

    Text → Glyph → Texture → GPU → Render (mỗi frame)

### Có cache:

    Text → (Cache) → Texture reuse → GPU → Render

→ Tránh lặp lại quá trình dựng text

## 5. Các chế độ CacheMode

### 5.1. NONE

#### Định nghĩa

- Tạo bitmap nhưng không tham gia Dynamic Atlas và không tối ưu batching

#### Cơ chế

- Mỗi frame:
  - Text được dựng lại hoàn toàn
- Không lưu texture hay glyph

#### Đặc điểm

- Không tốn memory cache
- Tốn CPU và draw call

#### Khi sử dụng

- Text thay đổi liên tục mỗi frame
- Nội dung realtime (debug, log)

---

### 5.2. BITMAP

#### Định nghĩa

- Toàn bộ text được render thành **một texture (bitmap)** và cache lại. BITMAP vẫn tạo bitmap cho mỗi Label, kể cả text giống nhau.

#### Cơ chế

1. Text được rasterize thành ảnh
2. Ảnh được đưa vào **Dynamic Atlas**
3. Khi render:
   - Dùng lại texture

#### Đặc điểm

- Có thể batch với sprite → giảm draw call
- Hiệu năng cao
- Tốn GPU memory

#### Hạn chế

- Khi text thay đổi:
  → phải tạo lại toàn bộ bitmap
- Không phù hợp text thay đổi thường xuyên

#### Khi sử dụng

- UI tĩnh:
  - Button label
  - Title
  - Menu

### 5.3. CHAR

#### Định nghĩa

Cache ở mức **từng ký tự (glyph)**.

#### Cơ chế

1. Mỗi ký tự được rasterize thành texture riêng
2. Lưu vào **glyph cache (global)**
3. Khi render:
   - Ghép các glyph đã cache lại

#### Đặc điểm

- Ký tự giống nhau chỉ render 1 lần
- Dùng chung giữa nhiều Label
- Hiệu quả khi text thay đổi nhưng lặp ký tự

#### Ưu điểm

- Cân bằng giữa:
  - Hiệu năng
  - Bộ nhớ
  - Khả năng update

#### Hạn chế

- Kém hiệu quả với ký tự hiếm (Unicode phức tạp)
- Phụ thuộc font và style
- Chỉ dùng khi:
  - fontSize cố định
  - fontFamily, color, outline giống nhau
- Glyph cache:
  - global bitmap 2048x2048
    limit → ký tự mới không render được
- Không hỗ trợ:
  - SHRINK overflow
- Không tham gia Dynamic Atlas

#### Khi sử dụng

- HUD game:
  - Score
  - HP
  - Timer

## 6. So sánh tổng quát

| Thuộc tính  | NONE     | BITMAP       | CHAR       |
| ----------- | -------- | ------------ | ---------- |
| Cache       | Không    | Toàn bộ text | Theo ký tự |
| Hiệu năng   | Thấp     | Cao          | Cao        |
| Update text | Tốt      | Kém          | Tốt        |
| Memory      | Thấp     | Cao          | Trung bình |
| Batch       | Không    | Có           | Có         |
| Use case    | Realtime | UI tĩnh      | Game UI    |


---   

# 2. Life Cycle Callback

## 1. Khái niệm

### 1.1 Life Cycle Callback là gì?

Life Cycle Callback là tập hợp các hàm đặc biệt được định nghĩa sẵn bởi engine Cocos Creator.

Engine sử dụng cơ chế **Inversion of Control (IoC)**:

- Không cần gọi thủ công các hàm
- Engine tự điều khiển thứ tự thực thi
- Lập trình viên chỉ cần "hook" logic vào đúng các hàm tương ứng

### 1.2 Lí do cần Life Cycle

Trong game:

- Object liên tục được **tạo / kích hoạt / cập nhật / hủy**
- Mỗi giai đoạn cần xử lý khác nhau

Do đó, Life Cycle giúp:

- Chuẩn hóa luồng xử lý
- Tránh bug do sai thứ tự logic
- Tối ưu performance (tránh logic dư thừa, dọn rác đúng lúc)

## 2. Vòng đời của Component

Thứ tự lifecycle:

    onLoad → onEnable → start → update → lateUpdate → onDisable → onDestroy

## 3.Từng giai đoạn


### 3.1 onLoad — Khởi tạo (Initialization)

#### Bản chất

- Gọi khi node **lần đầu active**
- Dùng để khởi tạo dữ liệu ban đầu

#### Đặc điểm

- Chỉ chạy **1 lần duy nhất**
- Chạy trước tất cả `start()`

#### Có thể làm

- Truy cập node khác
- Load resource

#### Dùng khi nào?

- Gán reference
- Cache dữ liệu
- Setup biến không đổi

#### Ví dụ

    onLoad() {
        this.player = cc.find("Canvas/Player");
    }

### 3.2 onEnable — Khi component bật

**Bản chất**

- Gọi khi:
  - component.enabled = true
  - node.active = true

**Đặc điểm**

- Gọi nhiều lần
- Sau onLoad, trước start

**Dùng khi**

- Đăng ký event
- Bắt đầu lắng nghe

```js
onEnable() {
   cc.systemEvent.on(...);
}
```

### 3.3 start — Runtime init

**Bản chất**

- Gọi trước frame đầu tiên

**So với onLoad**

| onLoad                  | start           |
| ----------------------- | --------------- |
| Init tĩnh               | Init động       |
| Chạy ngay               | Delay frame đầu |
| Không phụ thuộc enabled | Có phụ thuộc    |

**Dùng khi**

- Reset state
- Init biến runtime


### 3.4 update(dt) — Game loop

**Bản chất**

- Gọi mỗi frame
- Core gameplay loop

**dt**

- Delta time giữa 2 frame

**Dùng khi**

- Di chuyển object
- Gameplay logic
- Animation thủ công

```js
update(dt) {
   this.node.x += 100 * dt;
}
```

### 3.5 lateUpdate(dt)

**Bản chất**

- Chạy sau update, animation, physics

**Dùng khi**

- Follow camera
- Sync position
- Fix jitter

Pattern:
update() → xử lý  
lateUpdate() → chỉnh cuối

### 3.6 onDisable

**Bản chất**

- Khi component/node bị tắt

**Dùng khi**

- Remove event
- Stop timer

```js
onDisable() {
   cc.systemEvent.off(...);
}
```
### 3.7 onDestroy

**Bản chất**

- Khi node.destroy()

**Đặc điểm**

- Dọn sau frame hiện tại

**Dùng khi**

- Cleanup
- Giải phóng memory

## 4. Mapping vòng đời

| Giai đoạn  | Ý nghĩa    |
| ---------- | ---------- |
| onLoad     | Sinh ra    |
| onEnable   | Hoạt động  |
| start      | Chuẩn bị   |
| update     | Đang chạy  |
| lateUpdate | Điều chỉnh |
| onDisable  | Tạm dừng   |
| onDestroy  | Hủy        |

## 5. Tại sao phải dùng đúng lifecycle?

### 5.1 Tránh bug

Sai:

```js
start() {
  this.enemy = cc.find("Enemy");
}
```

→ Có thể null

Đúng:

```js
onLoad();
```

### 5.2 Performance

- update chạy ~60 FPS

Nguyên tắc:

- Không logic nặng trong update
- Không init trong update

### 5.3 Maintainable

- Code rõ ràng
- Dễ debug
- Dễ scale


## 6. Best Practices

- onLoad → init static
- start → init dynamic
- update → logic frame
- lateUpdate → sync cuối
- onEnable → add event
- onDisable → remove event
- onDestroy → cleanup

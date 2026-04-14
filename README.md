# 1. Trục tọa độ trong Cocos System


Trục tọa độ là hệ quy chiếu để biểu diễn position, rotation, scale của node trong không gian như local, world.

## Có 2 hệ trục tọa độ

### Cartesian Coordinate (World / OpenGL)

- Gốc: **góc dưới bên trái**
- Trục:
  - X → sang phải  
  - Y → lên trên  
  - Là hệ của:
    - GPU / OpenGL  

#### Dùng để:
- Render object  
- Tính toán transform (position, rotation, scale)  
- Physics, animation  

  => **Phục vụ game engine (game world)**

---

### Screen Coordinate (UI / OS)

- Gốc: **góc trên bên trái**
- Trục:
  - X → sang phải  
  - Y → xuống dưới  

  - Là hệ của:
    - OS (Windows, iOS, Android)

#### Dùng để:
- Input (touch, click)  
- UI system native  

=> **Phục vụ người dùng (user interaction)**

---

### Điểm quan trọng

- Hai hệ **ngược trục Y**
- Không dùng trực tiếp chung được  

  => Cần **convert qua lại** giữa:
  - Screen → World  
  - World → Screen  
### Luồng chuyển đổi tọa độ (Screen → Cartesian)
#### Input từ người dùng (Screen Space)

- Bạn click / touch vào màn hình  
- Nhận được tọa độ từ OS  
#### Convert Screen → World

- Engine sử dụng **Camera**
- Chuyển tọa độ từ Screen sang World  

  Mục đích:
  - Xác định vị trí đó nằm ở đâu trong game world  

#### Convert World → Local (Node)

- Khi thao tác với một node cụ thể  
- Cần chuyển từ World về Local của node  

  Vì:
  - Node hoạt động trong **local space**
  - Phụ thuộc vào parent  

#### Render (Chiều ngược lại)

Khi vẽ lên màn hình, engine xử lý ngược:
 Local → World → Screen

### Bản chất

- **Screen** = ngôn ngữ của người dùng  
- **World** = ngôn ngữ của game  
- **Local** = ngôn ngữ riêng của từng object  

  Engine sẽ **convert qua lại giữa các hệ** để đồng bộ mọi thứ

---
### Hệ tọa độ trong Cocos

Cocos dùng hệ tọa độ 3D theo quy ước:

- Hệ tọa độ tay phải
- X tăng dần sang phải
- Y tăng dần lên trên (trong 2D)
- Trong 3D, Z tăng dần hướng ra khỏi màn hình (forward)
- Tùy camera mà có thể nhìn theo hướng -Z hoặc +Z

## World Space & Local Space

### World space
- Là hệ tọa độ toàn cục của toàn bộ scene/game, nơi mà mọi node đều được quy về để render và tính toán.

### Local space
- Là hệ tọa độ riêng của 1 node, được tính so với parent của nó.
- Gốc của local space nằm tại Anchor Point của node

## Rotation

- Xoay hệ trục local của node quanh anchor
- Không đổi local Position nhưng có thể làm thay đổi world Position của child
- Nó thay đổi hướng của hệ trục local
- Ảnh hưởng luôn tới child nodes

## Anchor 

Anchor là điểm neo trong không gian local (0 → 1)

Nó ảnh hưởng:

- Rotation (xoay quanh đâu)
- Scale (phóng từ đâu)
- Position (cách node “bám” vào parent)


## Transform System

Engine runtime của Cocos định nghĩa các hệ quy chiếu (Local space, World space, etc) và quản lý cách biến đổi giữa chúng, nó dùng Transform System để tự động tính các position, rotation, scale và chuyển tự động vị trí local theo world.

## Parent - Child & Local Axis

Toàn bộ hệ tọa độ phụ thuộc vào cấu trúc parent-child:

- Mỗi node có một trục tọa độ local được định nghĩa bởi Transform của nó so với cha
- Child node nằm trong local space của parent
→ Khi parent transform (move / rotate / scale) thì child cũng bị ảnh hưởng theo

## Nguyên lý hoạt động

Nguyên lý hoạt động là nó không lưu 1 vị trí duy nhất:

- Nó không lưu world position cố định
- Mà lưu:
  - local position
  - rotation 
  - scale 

World position chỉ được tính khi cần.

Thay vào đó mỗi node có 1 tọa độ local, rồi engine dùng matrix transform để tự tính world transform.

## Công thức Matrix Transform
    WorldMatrix = ParentWorldMatrix * LocalMatrix

Trong đó:

    LocalMatrix = T (position) * R (rotation) * S (scale)

# 2.1 AutoAtlas

## Khái niệm

AutoAtlas là một phương pháp/ công cụ đóng gói ảnh trong phát triển game.

## Thuật toán

Thường dùng thuật toán dạng Rectangle Packing, phổ biến nhất là biến thể của MaxRects algorithm.

### MaxRects algorithm:

- Sắp xếp các hình chữ nhật nhỏ (sprites)
- Đưa vào một hình lớn (atlas)
- Không chồng lấn
- Tối ưu diện tích sử dụng


## Chức năng

Tự động kết hợp các ảnh nhỏ đơn lẻ thành 1 ảnh lớn được gọi là:

- Sprite Sheet
- hoặc Texture Atlas

## Mục đích

Giảm số lần Draw calls  
(là các chỉ thị từ CPU đến GPU yêu cầu hiển thị một đối tượng lên màn hình thông qua các API đồ họa. Trong cocos là OpenGL)

→ Tối ưu hiệu suất game

## Cách hoạt động

### 1. Đóng gói ảnh
- Gom nhiều ảnh nhỏ thành 1 atlas

### 2. Mapping tọa độ
- Mapping tọa độ ảnh trên atlas

### 3. Rendering
  - GPU batch bằng cùng texture + UV mapping (tọa độ tương đối của ảnh)
    #### Điều kiện để batching (giảm draw call)

    Chỉ có thể batch khi:
    - Các sprite dùng cùng 1 texture (atlas)
    - Cùng material / shader
    - Không thay đổi state GPU (blend, mask, effect...)
    Nếu không thỏa → sẽ phát sinh thêm draw call
    #### Trường hợp không batching được
    - Sprite khác texture
    - Khác material / shader
    - Có mask / effect đặc biệt
    - Khác blend mode

# 2.2 Texture Atlas & Power of Two (POT)

## Power of Two (POT)

Power of Two là các số có dạng:

2ⁿ

Ví dụ:
- 256 = 2⁸  
- 512 = 2⁹  
- 1024 = 2¹⁰  
- 2048 = 2¹¹  
- 4096 = 2¹²  

---

## Lí do GPU sử dụng POT

GPU được thiết kế tối ưu cho các kích thước dạng POT vì:

- Memory của GPU chia theo block nhị phân
- Tính toán UV mapping nhanh hơn
- Mipmap hoạt động chính xác và đầy đủ
- Sampling texture hiệu quả hơn

Nếu không dùng POT:
- Có thể bị resize nội bộ → giảm chất lượng
- Tốn thêm bộ nhớ
- Có thể không tương thích trên thiết bị yếu

Non-POT vẫn chạy được trên GPU hiện đại nhưng:
- Mipmap có thể bị disable
- Một số GPU mobile cũ không hỗ trợ tốt
---

## Texture Atlas

Texture Atlas là một ảnh lớn chứa nhiều ảnh nhỏ (sprite).

### Mục đích:
- Giảm số lần draw call
- Tăng hiệu suất render

---

## Kích thước tối đa của Atlas

Kích thước tối đa phụ thuộc vào GPU:

| Thiết bị       | Max Texture Size |
|----------------|------------------|
| Mobile yếu     | 1024 – 2048      |
| Mobile trung   | 2048 – 4096      |
| PC / High-end  | 8192 – 16384     |

---

## Lựa chọn kích thước Atlas

### Atlas nhỏ (512, 1024)
Ưu điểm:
- Load nhanh
- Ít tốn RAM

Nhược điểm:
- Nhiều draw call hơn

---

### Atlas lớn (2048, 4096)
Ưu điểm:
- Giảm draw call
- Tăng hiệu suất render

Nhược điểm:
- Tốn VRAM
- Load lâu hơn
- Có thể crash trên thiết bị yếu
---
## Các cấu hình quan trọng của Auto Atlas

### Max Width / Max Height
- Xác định kích thước tối đa của atlas (texture lớn)
- Thường là Power Of Two (POT): 512, 1024, 2048, 4096
- Nếu vượt quá → Cocos sẽ tạo nhiều atlas


### Padding
- Khoảng cách giữa các sprite trong atlas
- Tránh hiện tượng **texture bleeding** (bị lem viền)
- Giá trị thường dùng: 2 - 4 px


### Allow Rotation
- Cho phép xoay sprite khi đóng gói
- Giúp tối ưu diện tích atlas (ít khoảng trống hơn)
- Có thể làm phức tạp UV mapping nhưng Cocos xử lý tự động


### Force Squared
- Ép atlas thành hình vuông (ví dụ: 1024x1024)
- Giúp tương thích tốt hơn với GPU cũ


###  Power Of Two (POT)
- Kích thước atlas theo dạng 2ⁿ:
  - 256, 512, 1024, 2048...
- Lợi ích:
  - Tối ưu bộ nhớ GPU
  - Mipmap hoạt động chính xác
  - Sampling texture hiệu quả hơn


### Extrude (Padding Bleed)
- Mở rộng pixel viền của sprite ra ngoài
- Tránh bị nhòe hoặc viền đen khi scale / zoom
- Thường dùng: 1 - 2 px


### Heuristics (Thuật toán sắp xếp)
- Cách sắp xếp sprite vào atlas
- Thường dùng biến thể của MaxRects:
  - BestShortSideFit
  - BestAreaFit
  - BottomLeftRule
- Mục tiêu: tối ưu diện tích sử dụng


### Filter Unused Resources
- Loại bỏ các sprite không được sử dụng khi build
- Giúp giảm dung lượng game

###  Preview
- Xem trước atlas sau khi pack
- Bao gồm:
  - Packed Textures: ảnh đã được đóng gói
  - Unpacked Textures: ảnh không thể pack

### Lưu ý quan trọng
- Auto Atlas chỉ hoạt động khi build game
- Nếu sprite không dùng atlas → sẽ không được batching
- Không nên đặt atlas trong thư mục resources nếu không cần thiết

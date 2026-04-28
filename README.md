# Command Pattern

## 1. Khái niệm

**Command Pattern** là một **Behavioral Design Pattern** (mẫu thiết kế hành vi), dùng để **đóng gói một request / thao tác thành một object riêng biệt**. Object này chứa toàn bộ thông tin cần thiết để thực thi request, chẳng hạn:

- đối tượng nhận lệnh (receiver)
- phương thức cần gọi
- tham số liên quan
- thời điểm thực thi (nếu có)

Nhờ vậy, request có thể được truyền đi, lưu trữ, xếp hàng, hoàn tác hoặc thực thi ở thời điểm khác.

## 2. Ý nghĩa cốt lõi

Command Pattern giúp **biến hành động thành dữ liệu**.

Khi hành động trở thành object, hệ thống có thể:

- Queue command (xếp hàng thực thi)
- Undo / Redo
- Ghi log lịch sử thao tác
- Replay input
- Mapping phím động
- Tách Input và Gameplay logic
- AI dùng chung hệ thống hành động với Player
- Network synchronization

## 3. Cấu trúc chuẩn của Command Pattern

### 3.1 Command Interface

Định nghĩa phương thức chung:

```ts
interface Command {
  execute(): void;
}
```

Nếu cần undo:

```ts
interface Command {
  execute(): void;
  undo(): void;
}
```

### 3.2 Concrete Command

Lớp triển khai command cụ thể.

Ví dụ:

- JumpCommand
- AttackCommand
- MoveLeftCommand
- RotateBlockCommand

```ts
class JumpCommand implements ICommand {
  constructor(private player: Player) {}

  execute() {
    this.player.jump();
  }
}
```

Concrete Command sẽ gọi logic thật từ Receiver.

### 3.3 Receiver

Là đối tượng thực thi nghiệp vụ thật sự.

Ví dụ:

- Player
- Enemy
- Character
- Inventory
- MapEditor

```ts
player.jump();
player.attack();
block.rotate();
```

### 3.4 Invoker

Là nơi nhận command và kích hoạt command.

Ví dụ:

- InputManager
- UI Button
- Macro System
- Replay Manager
- Network Event Handler

```ts
class InputHandler {
  press(command: ICommand) {
    command.execute();
  }
}
```

Invoker không cần biết logic bên trong command.

### 3.5 Client

Thành phần khởi tạo command và gán command cho invoker.

Ví dụ:

```ts
input.bind("W", new JumpCommand(player));
```

## 4. Ví dụ

```text
W = Jump
A = Move Left
D = Move Right
Space = Attack
```

Thay vì:

```ts
if (key == "W") player.jump();
```

Dùng:

```ts
input.bind("W", new JumpCommand(player));
```

## 5. Ứng dụng phổ biến trong game

### 5.1 Input Mapping

- đổi key setting
- keyboard / gamepad / mobile touch

### 5.2 Undo / Redo

Map editor, builder game:

- đặt block
- xoá block
- rotate object
- move object

### 5.3 Replay System

Lưu command mỗi frame rồi phát lại chính xác.

### 5.4 Multiplayer Sync

Gửi command thay vì gửi full state.

Ví dụ:

```json
{ "frame": 120, "command": "jump" }
```

### 5.5 AI Behavior

AI cũng gửi command:

- AttackCommand
- RetreatCommand
- MoveToTargetCommand

Player và AI dùng chung hệ thống.

### 5.6 Combo / Skill Queue

Ví dụ fighting game:

- punch
- kick
- special attack

## 6. Ưu điểm

### Loose Coupling

Input không phụ thuộc gameplay logic.

### Open/Closed Principle

Thêm hành động mới không cần sửa code cũ.

### Dễ mở rộng

Thêm skill mới:

- DashCommand
- HealCommand
- FireballCommand

### Hỗ trợ Undo / Replay / Queue

Rất mạnh trong game và editor.

### Dễ test

Có thể test từng command độc lập.

## 7. Nhược điểm

### Tăng số lượng class

Nhiều action → nhiều command class.

### Có thể overengineering

Game nhỏ dùng sẽ dư thừa.

### Debug khó hơn nếu thiết kế rối

Nhiều tầng gọi:

Input → Invoker → Command → Receiver

## 8. Khi nào nên dùng

### Nên dùng khi:

- game có nhiều input
- nhiều skill/action
- có replay
- có undo/redo
- AI dùng chung action system
- multiplayer deterministic
- editor tool

### Không nên dùng khi:

- game nhỏ đơn giản
- prototype nhanh
- chỉ 1–2 hành động
- logic quá ngắn, không cần abstraction

---

# Flyweight Pattern

## 1. Khái niệm

**Flyweight Pattern** là một **Structural Design Pattern** (mẫu thiết kế cấu trúc), dùng để **giảm chi phí bộ nhớ và tăng hiệu quả tài nguyên** bằng cách **chia sẻ dữ liệu chung giữa nhiều object giống nhau**, thay vì mỗi object giữ một bản sao riêng biệt.

Pattern này đặc biệt hữu ích khi hệ thống cần quản lý **số lượng rất lớn object nhỏ, chi tiết và lặp lại**.

## 2. Ý nghĩa cốt lõi

Flyweight Pattern giúp:

- giảm RAM usage
- giảm duplicate data
- tăng hiệu năng load resource
- scale tốt khi số lượng object lớn
- quản lý dữ liệu dùng chung tập trung

> Bản chất:
> **Tách phần dữ liệu dùng chung ra khỏi phần dữ liệu riêng của từng object.**

## 3. Hai loại trạng thái trong Flyweight

## 3.1 Intrinsic State (Trạng thái nội tại)

Là dữ liệu:

- có thể chia sẻ
- không phụ thuộc context bên ngoài
- ít thay đổi hoặc immutable

Ví dụ trong game:

- model 3D
- sprite / texture
- animation clip
- weapon config
- font glyph
- enemy template data

## 3.2 Extrinsic State (Trạng thái ngoại tại)

Là dữ liệu:

- riêng cho từng object
- thay đổi thường xuyên
- được truyền từ bên ngoài khi sử dụng

Ví dụ trong game:

- position (x, y, z)
- HP hiện tại
- velocity
- direction
- alive/dead state
- cooldown hiện tại

## 4. Cấu trúc chuẩn Flyweight Pattern

## 4.1 Flyweight Interface

Định nghĩa hành vi chung.

```ts id="s0g98o"
interface Flyweight {
  render(state: any): void;
}
```

## 4.2 Concrete Flyweight

Lưu intrinsic state và triển khai hành vi chia sẻ.

Ví dụ:

- TreeType
- BulletType
- CharacterSkin
- FontGlyph

```ts
class TreeType implements Flyweight {
  constructor(public texture: string) {}

  render(state: any) {
    console.log("Draw", this.texture, state.x, state.y);
  }
}
```

## 4.3 Flyweight Factory

Quản lý cache và tái sử dụng flyweight object.

Nếu object đã tồn tại → trả lại object cũ.
Nếu chưa có → tạo mới rồi lưu cache.

```ts
class TreeFactory {
  private static types = new Map();

  static get(type: string) {
    if (!this.types.has(type)) {
      this.types.set(type, new TreeType(type));
    }
    return this.types.get(type);
  }
}
```

## 4.4 Context

Là object thật ngoài hệ thống, chứa extrinsic state và tham chiếu tới Flyweight.

Ví dụ:

- Tree instance
- Bullet instance
- Enemy instance

```ts
class Tree {
  constructor(
    public x: number,
    public y: number,
    public type: TreeType,
  ) {}

  draw() {
    this.type.render(this);
  }
}
```

## 5. Ví dụ

## 5.1 Bullet Hell Game

10,000 bullets:

Shared:

- sprite
- collider size
- damage config

Riêng:

- x,y
- direction
- speed hiện tại
- active state

## 5.2 Text Rendering

Mỗi ký tự:

Shared:

- font glyph

Riêng:

- vị trí hiển thị

## 6. Ưu điểm

### Giảm bộ nhớ mạnh

Khi object số lượng lớn.

### Tránh duplicate asset

Không load texture/model nhiều lần.

### Tăng performance

Do reuse dữ liệu.

### Dễ scale game lớn

Open world / RTS / MMO.

## 7. Nhược điểm

### Code phức tạp hơn

Phải tách state hợp lý.

### Debug khó hơn

Dữ liệu chia nhiều nơi.

### Không phù hợp nếu object khác nhau quá nhiều

Không share được.

### Premature Optimization

Tối ưu sớm khi chưa cần thiết.

## 8. Khi nào nên dùng

## Nên dùng khi:

- số lượng object rất lớn
- nhiều object giống nhau
- asset nặng
- mobile memory thấp
- open world
- RTS / MMO
- particle / bullet systems

## Không nên dùng khi:

- số lượng object ít
- object unique nhiều
- prototype nhanh
- chưa có vấn đề memory/performance

# 9. So sánh Flyweight với các Design Pattern khác

## 1. Flyweight vs Object Pool

| Tiêu chí                            | Flyweight Pattern                           | Object Pool Pattern                           |
| ----------------------------------- | ------------------------------------------- | --------------------------------------------- |
| Mục đích chính                      | Giảm bộ nhớ bằng cách chia sẻ dữ liệu chung | Giảm chi phí tạo / hủy object liên tục        |
| Cách tối ưu                         | Reuse **shared data**                       | Reuse **object instance**                     |
| Tập trung vào                       | Memory usage                                | Allocation / Garbage Collection / Performance |
| Object có được tạo nhiều lần không? | Có thể tạo nhiều Context object             | Hạn chế tạo mới, tái sử dụng object cũ        |
| State của object                    | Chia thành intrinsic + extrinsic            | Reset state khi trả về pool                   |
| Khi nào hữu ích                     | Có nhiều object giống nhau                  | Object spawn/despawn liên tục                 |
| Ví dụ game                          | 10,000 viên đạn dùng chung sprite           | 10,000 viên đạn tái sử dụng instance Bullet   |
| Độ phức tạp                         | Trung bình                                  | Trung bình đến cao                            |
| Có thể dùng chung không?            | Có                                          | Có                                            |

## Giải thích chi tiết

### Flyweight giải quyết vấn đề gì?

Flyweight sẽ chuyển các dữ liệu giống nhau thành shared object

### Object Pool giải quyết vấn đề gì?

Object Pool sẽ:

- tạo sẵn object
- dùng xong trả lại pool
- lấy lại dùng tiếp

## Kết luận

- Flyweight tối ưu **RAM**
- Object Pool tối ưu **CPU + GC**
- Game lớn thường dùng **cả hai**

## 2. Flyweight vs Singleton

| Tiêu chí                       | Flyweight Pattern                       | Singleton Pattern                       |
| ------------------------------ | --------------------------------------- | --------------------------------------- |
| Mục đích chính                 | Chia sẻ dữ liệu chung giữa nhiều object | Đảm bảo chỉ có một instance toàn cục    |
| Số lượng instance              | Nhiều Flyweight object có thể tồn tại   | Chỉ 1 instance                          |
| Dùng cho                       | Shared asset / common data              | Manager / global service                |
| Có Context riêng không?        | Có                                      | Không nhất thiết                        |
| Scope sử dụng                  | Theo loại dữ liệu                       | Toàn hệ thống                           |
| Ví dụ game                     | TreeType, BulletType, FontGlyph         | AudioManager, SceneManager, SaveManager |
| Tập trung tối ưu               | Memory                                  | Global access / centralized control     |
| Có thể cache nhiều loại không? | Có                                      | Không                                   |

## Giải thích chi tiết

### Singleton dùng khi cần duy nhất một đối tượng

Toàn game chỉ cần 1 object điều phối.

### Flyweight dùng khi cần nhiều object nhưng share phần giống nhau

Mỗi object riêng nhưng model/texture dùng chung.

## Kết luận

- Singleton = quản lý **một đối tượng duy nhất**
- Flyweight = quản lý **nhiều object dùng chung dữ liệu**

## 3. Kết luận cuối

Ba pattern này không thay thế nhau.

Chúng giải quyết **ba vấn đề khác nhau**:

- Flyweight → tiết kiệm bộ nhớ
- Object Pool → giảm tạo/hủy object
- Singleton → quản lý hệ thống toàn cục

---

# Observer Pattern

## 1. Khái niệm

**Observer Pattern** là một **Behavioral Design Pattern** (mẫu thiết kế hành vi), định nghĩa mối quan hệ **one-to-many dependency (1-N)** giữa các object.

Khi **một object thay đổi trạng thái** (Subject / Publisher), tất cả các object đang theo dõi nó (**Observers / Subscribers**) sẽ được **thông báo tự động** và có thể cập nhật tương ứng.

## 2. Ý nghĩa cốt lõi

Observer Pattern giúp:

- giảm coupling giữa các object
- tăng khả năng mở rộng hệ thống
- hỗ trợ event-driven architecture
- tách nơi phát sinh thay đổi và nơi xử lý phản ứng
- cho phép thêm / bỏ listener dễ dàng
- tái sử dụng các hệ thống phản ứng độc lập

> Bản chất:
> **Một object thay đổi → nhiều object khác được thông báo và phản ứng.**

## 3. Cấu trúc chuẩn Observer Pattern

## 3.1 Subject (Publisher / Observable)

Đối tượng được theo dõi.

Chứa danh sách observer và cung cấp các hàm:

- attach / subscribe
- detach / unsubscribe
- notify

```ts id="0w3l4g"
interface Subject {
  attach(o: Observer): void;
  detach(o: Observer): void;
  notify(): void;
}
```

## 4.2 Observer

Interface cho đối tượng nhận thông báo.

```ts id="1h8w9u"
interface Observer {
  update(data: any): void;
}
```

## 4.3 Concrete Subject

Subject cụ thể.

Ví dụ:

- Player
- Inventory
- MatchTimer
- EnemySpawner
- GameState

```ts
class Player {
  private observers: Observer[] = [];
  hp = 100;

  subscribe(o: Observer) {
    this.observers.push(o);
  }

  notify() {
    this.observers.forEach((o) => o.update(this.hp));
  }

  damage(value: number) {
    this.hp -= value;
    this.notify();
  }
}
```

## 4.4 Concrete Observer

Observer cụ thể.

Ví dụ:

- UIHealthBar
- SoundSystem
- QuestTracker
- AchievementSystem
- CameraShakeSystem

```ts
class HealthUI implements Observer {
  update(hp: number) {
    console.log("UI HP:", hp);
  }
}

class SoundHit implements Observer {
  update(hp: number) {
    console.log("Play hit sound");
  }
}
```

## 4.5 Client

Thành phần đăng ký observer vào subject.

Ví dụ:

```ts id="5e7v1n"
const player = new Player();

player.subscribe(new HealthUI());
player.subscribe(new SoundHit());

player.damage(20);
```

## 5. Ví dụ

## Player bị damage

Subject: Player

Observers:

- UI cập nhật máu
- phát hit sound
- camera rung
- check nhiệm vụ survive
- analytics log

## 6. Ứng dụng

### UI Reactive

- HP bar
- Mana bar
- Coin text
- Cooldown icon

### Gameplay Events

- enemy chết
- player level up
- item nhặt được

### Quest / Achievement

- kill 100 enemies
- survive 10 waves

### Audio / FX

- play sound
- particle effect
- screen shake

### Multiplayer

- player join room
- ready state changed

## 7. Ưu điểm

### Loose Coupling

Subject không cần biết chi tiết observer.

### Dễ mở rộng

Thêm observer mới không sửa subject.

### Reusable Modules

UI, Sound, Quest độc lập.

## 8. Nhược điểm

### Debug khó

Không rõ ai phát event, ai nhận.

### Memory Leak

Quên unsubscribe.

### Event Spaghetti

Quá nhiều event gây rối hệ thống.

### Thứ tự xử lý khó kiểm soát

Observer nào chạy trước/sau.

      Có thể giảm performance nếu spam event

## 9. Khi nào nên dùng

## Nên dùng khi:

- một thay đổi cần nhiều nơi phản ứng
- UI sync data
- quest / achievement tracking
- gameplay event systems
- multiplayer state changes
- modular architecture

## Không nên dùng khi:

- quan hệ 1-1 đơn giản
- logic trực tiếp rõ ràng
- code nhỏ ít module
- performance hot path cực nặng
- event bus bị lạm dụng

# 10. So sánh Observer Pattern với các Pattern khác

# 1. Observer vs Command Pattern

| Tiêu chí                               | Observer Pattern                     | Command Pattern                           |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| Nhóm pattern                           | Behavioral                           | Behavioral                                |
| Mục đích chính                         | Thông báo khi sự kiện đã xảy ra      | Đóng gói yêu cầu hành động thành object   |
| Câu hỏi nó trả lời                     | “Điều gì vừa xảy ra?”                | “Cần thực hiện hành động gì?”             |
| Hướng xử lý                            | Reactive (phản ứng sau sự kiện)      | Imperative (ra lệnh thực thi)             |
| Dữ liệu truyền                         | Event data / state change            | Action + receiver + parameters            |
| Coupling                               | Subject không biết chi tiết observer | Invoker không biết chi tiết receiver      |
| Có hỗ trợ Undo / Queue không?          | Không phải mục tiêu chính            | Có, rất mạnh                              |
| Có nhiều listener cùng phản ứng không? | Có                                   | Thường không (1 command = 1 action chính) |
| Ví dụ game                             | EnemyDied, PlayerDamaged             | JumpCommand, AttackCommand                |
| Thường dùng cho                        | Event system, UI update              | Input system, replay, combo               |

---

## Giải thích chi tiết

## Observer dùng khi cần phát sự kiện

Ví dụ enemy chết:

Nhiều hệ thống cùng phản ứng:

- tăng score
- drop loot
- update quest
- play sound
- UI cập nhật

Không ai “ra lệnh” cho các hệ thống đó. Chỉ đơn giản là thông báo.

## Command dùng khi cần yêu cầu hành động

Ví dụ player bấm nút attack:

Command chứa:

- ai thực hiện
- hành động gì
- tham số gì

Invoker gọi:

- execute()

## Kết luận

- Observer = thông báo **điều đã xảy ra**
- Command = yêu cầu **điều cần xảy ra**

---

# State Pattern

## 1. Khái niệm

**State Pattern** là một **Behavioral Design Pattern** (mẫu thiết kế hành vi), cho phép **một object thay đổi hành vi khi trạng thái nội tại (internal state) của nó thay đổi**. Khi nhìn từ bên ngoài, object sẽ có vẻ như đổi class.

## 2. Ý tưởng

Thay vì dùng:

```ts id="f0z8ut"
if(state == "Idle") ...
else if(state == "Run") ...
else if(state == "Jump") ...
```

Hoặc:

```ts id="x8a2nk"
switch (state) {
  case "Idle":
  case "Run":
}
```

Ta tách từng trạng thái thành class riêng:

- IdleState
- RunState
- JumpState
- AttackState
- DeadState

Object chính (**Context**) giữ state hiện tại và dùng **delegation** xử lý cho state đó.

    Delegate là nơi đối tượng(sender) thay vì thực hiện nhiệm vụ, nó ủy thác công việc cho 1 đối tượng khác

## 3. Ý nghĩa

State Pattern giúp:

- đóng gói hành vi theo trạng thái
- loại bỏ if/else, switch-case phức tạp
- dễ mở rộng trạng thái mới
- tuân thủ Open/Closed Principle
- quản lý state transition rõ ràng
- giảm code rối trong class chính
- tăng khả năng bảo trì

## 4. Cấu trúc chuẩn State Pattern

## 4.1 State Interface

Định nghĩa hành vi chung cho các state.

```ts id="n5r3bz"
interface State {
  enter(): void;
  update(): void;
  exit(): void;
}
```

## 4.2 Concrete State

Các state cụ thể triển khai hành vi riêng.

Ví dụ:

- IdleState
- MoveState
- JumpState
- AttackState
- HurtState
- DeadState

```ts id="n5r3bz"
class IdleState implements State {
  constructor(private player: Player) {}

  enter() {
    console.log("Enter Idle");
  }
  update() {
    console.log("Standing...");
  }
  exit() {
    console.log("Exit Idle");
  }
}

class RunState implements State {
  constructor(private player: Player) {}

  enter() {
    console.log("Enter Run");
  }
  update() {
    console.log("Running...");
  }
  exit() {
    console.log("Exit Run");
  }
}
```

## 4.3 Context

Object chứa state hiện tại và quản lý việc chuyển state.

Ví dụ:

- Player
- Enemy
- Door
- GameSession
- UI Screen

```ts
class Player {
  private state: State;

  changeState(newState: State) {
    this.state?.exit();
    this.state = newState;
    this.state.enter();
  }

  update() {
    this.state.update();
  }
}
```

## 4.4 Client 
Thành phần tạo state hoặc trigger change state.

```ts
const player = new Player();

player.changeState(new IdleState(player));
player.update();

player.changeState(new RunState(player));
player.update();
```

## 5 State có lifecycle

Thường gồm:

- enter()
- update()
- exit()

## 6. Ví dụ  
## Player Controller

States:

- Idle
- Run
- Jump
- Attack
- Hurt
- Dead

## UI Popup

States:

- Hidden
- Opening
- Showing
- Closing

## 7. Ưu điểm

### Tổ chức code sạch

Mỗi state một nơi.

### Dễ mở rộng

Thêm DashState không sửa code cũ.

### Phù hợp game loop

update mỗi frame rất tốt.

### Tách behavior rõ ràng
 

## 8. Nhược điểm

### Tăng số lượng class

Nhiều state = nhiều file.

### Transition dễ rối

Nếu quá nhiều trạng thái.

### Overengineering cho case nhỏ

2 state đơn giản không cần dùng.

### Shared data cần quản lý tốt

State sửa Context lung tung sẽ khó bảo trì.
 
## 9. Khi nào nên dùng

## Nên dùng khi:

- object có nhiều trạng thái rõ ràng
- hành vi thay đổi mạnh theo state
- nhiều transition
- update liên tục mỗi frame
- game AI / character / UI flow

## Không nên dùng khi:

- chỉ On / Off
- logic quá nhỏ
- prototype nhanh
- ít state, ít thay đổi
---
# Singleton Pattern 

## 1. Khái niệm

**Singleton Pattern** là một **Creational Design Pattern** (mẫu thiết kế khởi tạo), đảm bảo rằng **một class chỉ có duy nhất một instance** trong phạm vi hệ thống và cung cấp **điểm truy cập toàn cục (global access point)** tới instance đó.

## 2. Ý nghĩa

Singleton Pattern giúp:

* kiểm soát số lượng instance
* cung cấp global access có kiểm soát
* chia sẻ resource dùng chung
* đồng bộ trạng thái hệ thống
* tránh duplicate manager object 
* đảm bảo tính nhất quán của service trung tâm


## 3. Cấu trúc chuẩn Singleton Pattern

## 3.1 Private Constructor

Ngăn việc tạo object từ bên ngoài.

```ts id="m1p6xo"
private constructor() {}
``` 

## 5.2 Static Instance Field

Lưu instance duy nhất.

```ts id="j5t9uv"
private static instance: GameManager;
```

## 5.3 Static Access Method

Cho phép truy cập instance.

```ts id="u3q8nz"
public static getInstance(): GameManager
``` 

## 5.4 Client

Thành phần sử dụng singleton.

```ts id="b9f2dr"
GameManager.getInstance()
```
 
## 6. Ví dụ  
```ts id="p7w1cx"
class GameManager {
   private static instance: GameManager;

   private constructor(){}

   public static getInstance(): GameManager {
      if(!GameManager.instance){
         GameManager.instance = new GameManager();
      }
      return GameManager.instance;
   }

   score = 0;
}
```
 

## 7. Ứng dụng 
## Manager Systems

* GameManager
* AudioManager
* SaveManager
* UIManager
* SettingsManager
* ResourceManager

* Logger
* Analytics
* EventBus (có thể)

## 8. Ưu điểm

### Truy cập tiện lợi

Dùng ở nhiều nơi.

### Chỉ một nguồn sự thật

Một state trung tâm.

### Tránh tạo object dư thừa

Manager không bị nhân đôi.

### Có thể lazy load

Chỉ tạo khi cần.

---

## 9. Nhược điểm   

### Global State

Dễ biến thành biến toàn cục trá hình.

### Coupling cao

Nhiều class phụ thuộc singleton.

### Khó test

Mock khó hơn dependency injection.

### Hidden Dependency

Class dùng singleton nhưng không thể hiện ở constructor.

### Vi phạm Single Responsibility nếu lạm dụng

Một manager ôm quá nhiều việc.
 
## 10. Khi nào nên dùng

## Nên dùng khi:

* thực sự chỉ cần một instance
* service dùng toàn hệ thống
* state toàn cục hợp lý
* manager xuyên scene/game session
* resource dùng chung
 
## Không nên dùng khi:

* object gameplay thông thường (Player, Enemy, Bullet)
* object có thể nhiều instance tương lai
* hệ thống cần unit test mạnh
* chỉ dùng vì “tiện gọi ở mọi nơi”

## 11. So sánh với pattern khác

## Singleton vs Static Class

| Tiêu chí           | Singleton | Static Class    |
| ------------------ | --------- | --------------- |
| Có object instance | Có        | Không           |
| Có interface       | Có        | Không           |
| Có inheritance     | Có thể    | Không           |
| Có lazy init       | Có        | Không linh hoạt |
 

## Singleton vs Flyweight

| Tiêu chí          | Singleton      | Flyweight            |
| ----------------- | -------------- | -------------------- |
| Số lượng instance | 1              | Nhiều shared objects |
| Mục đích          | Global control | Memory optimization  |
--- 


# Tổng hợp so sánh 5 Design Pattern

| Tiêu chí               | Command Pattern                 | Flyweight Pattern                           | Observer Pattern                | State Pattern                        | Singleton Pattern                    |
| ---------------------- | ------------------------------- | ------------------------------------------- | ------------------------------- | ------------------------------------ | ------------------------------------ |
| Nhóm Pattern           | Behavioral                      | Structural                                  | Behavioral                      | Behavioral                           | Creational                           |
| Mục đích chính         | Đóng gói hành động thành object | Chia sẻ dữ liệu chung để giảm memory        | Thông báo khi state thay đổi    | Thay đổi hành vi theo state hiện tại | Đảm bảo chỉ có 1 instance            |
| Câu hỏi nó giải quyết  | Cần thực hiện hành động gì?     | Làm sao tối ưu hàng ngàn object giống nhau? | Ai cần biết sự kiện vừa xảy ra? | Object đang ở trạng thái nào?        | Object này có nên chỉ tồn tại 1 bản? |
| Trọng tâm              | Action / Request                | Memory / Resource Sharing                   | Event Notification              | Behavior by State                    | Global Access / Lifetime             |
| Thành phần chính       | Command, Receiver, Invoker      | Flyweight, Factory, Context                 | Subject, Observer               | State, Context                       | Private ctor, Static instance        |
| Dễ gặp trong game      | Input, Skill, Replay            | Bullet, Tree, Enemy clone                   | UI, Quest, Sound, Events        | Player FSM, AI FSM                   | AudioManager, GameManager            |
| Có nhiều object không? | Có                              | Rất nhiều                                   | Có                              | Có                                   | Chỉ 1                                |
| Có hỗ trợ mở rộng tốt? | Rất tốt                         | Tốt                                         | Rất tốt                         | Rất tốt                              | Trung bình                           |
| Độ phức tạp            | Trung bình                      | Trung bình                                  | Trung bình                      | Trung bình - Cao                     | Thấp                                 |
| Rủi ro                 | Quá nhiều class                 | Tối ưu sai chỗ                              | Khó quản lí khi nhiều event                | Quá nhiều state                      | Global state                         |

# 1. Bản chất từng Pattern

## Command Pattern

Biến hành động thành object.

Dùng cho:

* input system
* undo/redo
* replay
* combo queue


## Flyweight Pattern

Tách dữ liệu chung để share.

Dùng cho:

* memory optimization
* shared asset
* rendering scale lớn

## Observer Pattern

Một object đổi → nhiều object khác được notify.

Các hệ thống nghe:

* score
* loot
* UI
* quest
* sound

## State Pattern

Object đổi behavior theo state hiện tại.

Dùng cho:

* player FSM
* enemy AI
* menu flow

## Singleton Pattern

Chỉ tồn tại 1 object toàn hệ thống.

# 2. So sánh theo OOP nguyên lý

| Pattern   | Giảm Coupling | Tăng Reuse | Tối ưu hiệu năng | Dễ test    |
| --------- | ------------- | ---------- | ---------------- | ---------- |
| Command   | Cao           | Cao        | Trung bình       | Tốt        |
| Flyweight | Trung bình    | Cao        | Rất cao          | Trung bình |
| Observer  | Cao           | Cao        | Trung bình       | Trung bình |
| State     | Cao           | Cao        | Trung bình       | Tốt        |
| Singleton | Thấp          | Trung bình | Trung bình       | Kém        |
 
# 3. Khi nào không nên dùng

| Pattern   | Không nên dùng khi                |
| --------- | --------------------------------- |
| Command   | Game quá nhỏ, chỉ vài hành động   |
| Flyweight | Object ít, không có vấn đề memory |
| Observer  | Logic đơn giản, ít module         |
| State     | Chỉ 2 state đơn giản              |
| Singleton | Chỉ dùng vì tiện gọi global       |

# 4. Cách chọn pattern

| Pattern   | Mong muốn                 |
| --------- | ------------------------- |
| Command   | Tôi muốn làm gì           |
| Flyweight | Làm sao đỡ tốn RAM        |
| Observer  | Có gì xảy ra thì báo tôi  |
| State     | Tôi đang ở trạng thái nào |
| Singleton | Chỉ cần 1 thằng thôi      |

# 5. Kết luận
* **Command** → quản lý hành động
* **Flyweight** → tối ưu tài nguyên
* **Observer** → giao tiếp sự kiện
* **State** → quản lý trạng thái
* **Singleton** → quản lý vòng đời instance

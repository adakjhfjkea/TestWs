# 📖 HƯỚNG DẪN QUẢN TRỊ WEBSITE QUẢNG CÁO GÒ NỔI

Chào bạn! Hệ thống website đã được tái cấu trúc để giúp bạn **dễ dàng cập nhật bài viết, thay đổi thông tin công ty và quản lý hình ảnh** mà không cần phải chạm vào code hệ thống (thư mục `src`).

Tất cả những gì bạn cần quan tâm từ bây giờ là thư mục **`QUAN_TRI_WEBSITE`** và thư mục **`public/assets`**.

---

## 1. 📷 QUẢN LÝ HÌNH ẢNH (Thư mục `/public/assets/`)

Để thay đổi logo, banner, hoặc hình ảnh bài viết, bạn cần copy hình mới của bạn thả vào đúng thư mục con bên trong `/public/assets/`.
- Chứa logo: `/public/assets/logo/`
- Chứa ảnh dự án: `/public/assets/projects/`
- Chứa ảnh nhân viên: `/public/assets/team/`

*Mẹo: Đặt tên file hình ảnh đơn giản, tiếng Việt không dấu (ví dụ: `bang-hieu-1.jpg`).*

---

## 2. 📝 QUẢN TRỊ NỘI DUNG (Thư mục `/QUAN_TRI_WEBSITE/`)

Giờ đây, toàn bộ "ruột" của website được gom gọn gàng trong 5 file nằm ngay tại thư mục gốc **`QUAN_TRI_WEBSITE`**. Bạn dùng trình soạn thảo văn bản mở file cần sửa.

### File 1: `1_ThongTinCongTy.ts`
Đây là nơi chứa toàn bộ thông tin cốt lõi. Sửa ở đây là toàn bộ website tự cập nhật.

```javascript
  companyName: "Công Ty TNHH TM-DV Quảng Cáo Gò Nổi",
  slogan: "Vững tâm - Vươn tầm",
  heroImage: "https://... hoặc /assets/images/banner.jpg", // Hình nền lớn
  contact: {
    phone: "0909276588",       // SĐT bấm gọi
    phoneDisplay: "0909 276 588", // SĐT hiển thị
    address: "6/2 Đặng Thúc Vịnh, ấp 11, Xã Đông Thạnh...",
    // ...
  }
```

### File 2: `2_DanhSachDuAn.ts`
Chứa các hình ảnh/dự án đã thi công hiển thị trên mục Dự án. Để thêm dự án, bạn copy 1 đoạn cũ dán xuống dưới, rồi sửa.

```javascript
  {
    id: 99, 
    title: 'Thi công bảng hiệu Spa', 
    category: 'Chữ nổi Inox',
    image: '/assets/projects/hinh-anh-cua-ban.jpg', // Link hình ảnh sau khi up vô public/assets
  },
```

### File 3: `3_DanhSachDichVu.tsx`
Chứa hạng mục các dịch vụ công ty cung cấp.
```javascript
  {
    title: 'Thi Công Mặt Dựng Alu',
    description: 'Chuyên thi công thiết kế bảng hiệu Alu cao cấp...',
    // Khuyến nghị không nên sửa dòng `icon:` nếu bạn chưa rành về giao diện.
  },
```

### File 4: `4_DoiNguNhanSu.ts`
Thêm/sửa/xoá thông tin các thành viên (Hiển thị ở trang chủ).
```javascript
  {
    id: 'member-3',
    name: 'Nguyễn Thị Kim Yên',
    role: 'Trưởng phòng Kinh Doanh',
    image: '/assets/team/anh-kim-yen.jpg',
  },
```

### File 5: `5_VideoGioiThieu.ts`
Thay đổi link Video giới thiệu công ty bằng ID link nhúng của Youtube.

---

### 🎉 TỔNG KẾT QUY TRÌNH CHUẨN 3 BƯỚC:
1. Chuẩn bị hình ảnh trên máy (nên resize để tối ưu tốc độ, khoảng 300KB/ảnh).
2. Tải hình ảnh thả vào thư mục `public/assets/...` tương ứng.
3. Vào thư mục **`QUAN_TRI_WEBSITE`**, mở file tương ứng, đổi dòng chữ hoặc đổi thông số link hình ảnh.
4. **Xong!** Website sẽ tự động nạp dữ liệu mới. Không cần đụng đến code hệ thống.

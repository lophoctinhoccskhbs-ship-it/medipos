# 🏥 MediPOS - Hệ Thống Quản Lý Bán Hàng Nhà Thuốc

Một hệ thống **quản lý bán hàng (POS)** và **ERP cơ bản** chuyên dụng cho nhà thuốc, với giao diện hiện đại, trực quan và dễ sử dụng.

## ✨ Tính Năng Chính

### 1. 📊 Dashboard - Theo Dõi Kinh Doanh
- **Thống kê thời gian thực**:
  - Doanh thu hôm nay
  - Số hóa đơn bán ra
  - Tổng số sản phẩm
  - Tổng khách hàng
  
- **Biểu đồ và báo cáo**:
  - Biểu đồ doanh thu 7 ngày
  - Sản phẩm bán chạy nhất
  - Cảnh báo hụt hàng và hết hạn

### 2. 🛒 Bán Hàng (POS) - Giao Dịch Nhanh
- **Tìm kiếm sản phẩm** nhanh chóng
- **Quét mã vạch/Barcode** (hỗ trợ camera hoặc máy quét)
- **Giỏ hàng thông minh** với tính năng:
  - Thêm/bớt sản phẩm dễ dàng
  - Tính tổng tiền tự động
  - Áp dụng chiết khấu linh hoạt
  
- **Thanh toán đa phương thức**:
  - Tiền mặt
  - Thẻ tín dụng/ghi nợ
  - Chuyển khoản ngân hàng (với QR code)

- **In và tải về hóa đơn** chuyên nghiệp

### 3. 📦 Quản Lý Kho
- **Thông tin chi tiết sản phẩm**:
  - Tên, barcode, giá nhập/bán
  - Thành phần, công dụng
  - Nhà sản xuất, hạn sử dụng
  
- **Theo dõi tồn kho** theo thời gian thực
- **Cảnh báo tự động**:
  - Sản phẩm sắp hết hàng
  - Sản phẩm sắp hết hạn
  - Sản phẩm đã hết hạn
  
- **Quản lý dễ dàng**:
  - Thêm sản phẩm mới
  - Sửa thông tin
  - Xóa sản phẩm

### 4. 👥 Quản Lý Khách Hàng
- **Lưu trữ thông tin khách**:
  - Tên, số điện thoại, địa chỉ
  - Lịch sử mua hàng
  - Tổng chi tiêu
  - Số lần mua

- **Chương trình khách hàng thân thiết**:
  - Tích điểm qua mỗi đơn hàng
  - Quản lý điểm tích lũy
  - Hỗ trợ chương trình khuyến mãi

### 5. 📈 Báo Cáo & Thống Kê
- **Báo cáo doanh số**:
  - Doanh thu theo ngày, tuần, tháng, năm
  - Lợi nhuận và chi phí
  - Tỷ suất lợi nhuận
  
- **Báo cáo hàng tồn kho**:
  - Sản phẩm bán chạy
  - Giá trị tồn kho
  - Phân tích xu hướng

### 6. ⚙️ Cài Đặt
- **Thông tin nhà thuốc**:
  - Tên, địa chỉ, số điện thoại
  - Mã số thuế
  - Số tài khoản ngân hàng
  
- **Tùy chỉnh hóa đơn**:
  - Logo/tên nhà thuốc
  - Thông tin liên hệ trên hóa đơn

### 7. 💾 Lưu Trữ Dữ Liệu
- **Lưu trữ cục bộ** (Browser LocalStorage)
  - Dữ liệu lưu trên máy tính
  - Không cần kết nối internet
  - An toàn và bảo mật

- **Xuất/Nhập dữ liệu**
  - Backup dữ liệu định kỳ
  - Khôi phục từ file sao lưu
  - Định dạng JSON

## 🚀 Cách Sử Dụng

### Bắt Đầu
1. **Mở file `index.html`** trong trình duyệt web
2. Hệ thống sẽ tự động tải dữ liệu demo
3. Bắt đầu sử dụng ngay!

### Accesso Qua Link
```
Để sử dụng từ xa, bạn có thể:
- Host trên server web
- Sử dụng GitHub Pages
- Deploy trên Netlify/Vercel
- Sử dụng local web server
```

### Phím Tắt Nhanh
| Phím Tắt | Chức Năng |
|----------|----------|
| Ctrl/Cmd + 1 | Dashboard |
| Ctrl/Cmd + 2 | Bán Hàng |
| Ctrl/Cmd + 3 | Quản Lý Kho |
| Ctrl/Cmd + 4 | Danh Sách Khách |

## 📋 Quy Trình Bán Hàng (POS)

1. **Tìm sản phẩm**
   - Gõ tên sản phẩm vào thanh tìm kiếm
   - Hoặc quét barcode
   
2. **Thêm vào giỏ hàng**
   - Nhấp trên sản phẩm
   - Điều chỉnh số lượng (nút + / -)
   
3. **Áp dụng chiết khấu** (nếu cần)
   - Nhập % chiết khấu
   - Hệ thống tính toán tự động
   
4. **Chọn phương thức thanh toán**
   - Tiền mặt
   - Thẻ
   - Chuyển khoản (QR code)
   
5. **Hoàn thành giao dịch**
   - Nhấp "Hoàn Thành Giao Dịch"
   - In hoặc tải về hóa đơn
   - Giỏ hàng sẽ tự động xóa

## 📊 Tính Năng Báo Cáo

### Loại Báo Cáo Có Sẵn
- **Hôm Nay**: Doanh số từ 00:00 đến bây giờ
- **7 Ngày Qua**: Toàn bộ dữ liệu 7 ngày vừa qua
- **Tháng Này**: Từ ngày 1 đến hôm nay của tháng hiện tại
- **Toàn Bộ**: Tất cả giao dịch đã lưu

### Metrics Báo Cáo
- Tổng doanh thu
- Tổng chi phí
- Lợi nhuận ròng
- Tỷ suất lợi nhuận
- Sản phẩm bán chạy
- Giá trị tồn kho

## 🔐 An Toàn & Bảo Mật

- ✅ **Dữ liệu lưu cục bộ** trên thiết bị của bạn
- ✅ **Không gửi thông tin lên server** (ngoại trừ khi tùy chỉnh)
- ✅ **Hỗ trợ offline** - hoạt động không cần internet
- ✅ **Backup dễ dàng** - xuất dữ liệu theo nhu cầu

## 📱 Tương Thích Thiết Bị

- ✓ Máy tính để bàn (Chrome, Firefox, Safari, Edge)
- ✓ Máy tính bảng (iPad, Android tablets)
- ✓ Điện thoại thông minh (responsive design)

## 📦 Cấu Trúc File

```
HTML/
├── index.html          # Trang chính
├── styles.css          # CSS styling
├── app.js              # Khởi tạo ứng dụng
├── data-manager.js     # Quản lý dữ liệu
├── ui-manager.js       # Quản lý UI
├── pos-manager.js      # Quản lý hệ thống POS
├── sw.js              # Service Worker (offline)
└── README.md           # File này
```

## 🔧 Công Nghệ Sử Dụng

- **HTML5** - Cấu trúc
- **CSS3** - Thiết kế đẹp mắt
- **JavaScript (Vanilla)** - Logic
- **LocalStorage** - Lưu trữ dữ liệu
- **Chart.js** - Biểu đồ
- **Font Awesome** - Icons
- **Service Worker** - Offline support

## 🎨 Giao Diện

- **Màu sắc**: Trắng, xanh dương nhẹ
- **Design**: Hiện đại, chuyên nghiệp
- **UX**: Trực quan, dễ sử dụng
- **Responsive**: Tối ưu trên mọi thiết bị

## 📝 Ví Dụ Dữ Liệu Demo

### Sản Phẩm Demo
- Paracetamol 500mg
- Ibuprofen 200mg
- Vitamin C 1000mg
- Aspirin 100mg
- Omeprazole 20mg
- Cough Syrup

### Khách Hàng Demo
- Nguyễn Văn A
- Trần Thị B
- Phạm Việt C

## 💡 Mẹo Sử Dụng

1. **Quản lý tồn kho**: Cập nhật số lượng sau mỗi nhập/xuất
2. **Cảnh báo**: Kiểm tra Dashboard mỗi ngày để xem cảnh báo
3. **Backup**: Xuất dữ liệu hàng tuần
4. **Khách hàng**: Thêm khách thường xuyên vào danh sách
5. **Báo cáo**: Tạo báo cáo cuối tháng để phân tích

## 🆘 Khắc Phục Sự Cố

### Dữ liệu bị mất
- Kiểm tra localStorage: F12 > Application > LocalStorage
- Khôi phục từ file backup (Xuất dữ liệu)

### Hiển thị sai
- Xóa cache: Ctrl + Shift + Delete
- Tải lại trang: Ctrl + R hoặc F5

### Biểu đồ không hiển thị
- Kiểm tra kết nối internet (cần tải Chart.js)
- Chờ trang tải hoàn toàn

## 🚀 Tự Phát Triển

Để thêm tính năng ghép với backend:

```javascript
// Ví dụ API call
fetch('https://your-api.com/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
});
```

## 📞 Liên Hệ & Hỗ Trợ

- Ứng dụng được phát triển cho nhà thuốc
- Hỗ trợ tùy chỉnh theo nhu cầu
- Có thể mở rộng thêm tính năng

## 📄 Giấy Phép

Miễn phí sử dụng cho mục đích thương mại và cá nhân

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2026  
**Trạng thái**: Hoạt động ổn định ✅


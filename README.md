# Dashboard chương trình đào tạo

Trang web tĩnh (HTML, CSS, JavaScript thuần) để theo dõi chương trình đào tạo của công ty: tổng chuyên đề, tổng thời gian, số học viên, tỷ lệ hoàn thành, chuyên đề theo tuần/tháng, nhóm theo khóa học.

## Cấu trúc

- `index.html`: giao diện
- `style.css`: kiểu dáng (có chế độ sáng/tối tự động)
- `script.js`: dữ liệu mẫu và xử lý. Sửa mảng `data` ở đầu file để đổi dữ liệu.

## Chạy thử trên máy

Mở `index.html` bằng trình duyệt. Không cần cài đặt gì.

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub, tải toàn bộ file trong thư mục này lên (nhánh `main`).
2. Vào **Settings > Pages**.
3. Ở mục **Build and deployment**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi bấm Save.
4. Chờ ít phút, GitHub sẽ hiện địa chỉ dạng `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

## Lưu ý

- Dữ liệu thêm, sửa, xóa hoặc nhập từ Excel được lưu trong trình duyệt của máy đang dùng (localStorage). Máy hoặc trình duyệt khác sẽ không thấy. Để chuyển dữ liệu sang máy khác, bấm Xuất Excel rồi Nhập từ Excel ở máy đó.
- Nhập từ Excel: bấm Tải file mẫu để lấy đúng tên cột (Khóa học, Tên chuyên đề, Giảng viên, Công ty, Địa điểm đào tạo, Ngày đào tạo, Thời lượng (giờ), Số học viên, Trạng thái). Ngày nhập dạng dd/mm/yyyy hoặc kiểu ngày của Excel. Dòng thiếu tên hoặc ngày sẽ bị bỏ qua.
- Chức năng Excel dùng thư viện SheetJS tải từ cdnjs, nên cần có mạng.
- Trang dùng phông Be Vietnam Pro từ Google Fonts; nếu không có mạng, trình duyệt dùng phông hệ thống.

# Dashboard chương trình đào tạo

Trang web tĩnh (HTML, CSS, JavaScript thuần) để theo dõi chương trình đào tạo của công ty.

## Các file

- `index.html`: trang chỉ để xem. Gửi địa chỉ trang này cho mọi người.
- `admin.html`: trang quản trị (thêm, sửa, xóa, nhập Excel). Chỉ dùng cho người quản lý.
- `data.js`: dữ liệu mà mọi người nhìn thấy trên trang xem.
- `style.css`, `script.js`: giao diện và xử lý.

## Cập nhật số liệu cho mọi người

1. Mở `admin.html` (cùng trình duyệt đã nhập dữ liệu), thêm, sửa, xóa hoặc nhập từ Excel.
2. Bấm **Xuất dữ liệu để đăng**, trình duyệt tải về file `data.js`.
3. Vào repository trên GitHub, **Add file > Upload files**, kéo `data.js` vào để thay file cũ, rồi **Commit changes**.
4. Chờ một đến hai phút (có thể đến khoảng 10 phút do bộ nhớ đệm), trang xem sẽ có số liệu mới.

Dữ liệu sửa trên `admin.html` chỉ lưu trong trình duyệt của máy đó (localStorage) cho đến khi bạn đăng `data.js`. Người khác mở `admin.html` cũng chỉ sửa được trên máy họ, không ảnh hưởng người xem. Chỉ người có quyền ghi vào repository mới thay đổi được `data.js`.

## Nhập từ Excel

Bấm **Tải file mẫu** để lấy đúng tên cột: Khóa học, Tên chuyên đề, Giảng viên, Công ty, Địa điểm đào tạo, Ngày đào tạo, Thời lượng (giờ), Số học viên, Trạng thái. Ngày nhập dạng dd/mm/yyyy hoặc kiểu ngày của Excel. Dòng thiếu tên hoặc ngày sẽ bị bỏ qua. Chức năng này dùng thư viện SheetJS tải từ cdnjs nên cần có mạng.

## Đưa lên GitHub Pages

Tải toàn bộ file lên repository (nhánh `main`), vào **Settings > Pages**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi Save.

## Lưu ý

Repository công khai thì `data.js` và trang web cũng công khai: ai có địa chỉ đều xem được số liệu.

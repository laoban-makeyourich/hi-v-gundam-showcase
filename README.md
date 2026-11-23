# Hi-V Gundam Ver.Ka — Showcase

Trang trình bày tĩnh cho mẫu **MG 1/100 RX-93-v2 Hi-V Gundam “Ver.Ka”** của Bandai, theo bố cục editorial lấy cảm hứng từ Humaan: hero chữ lớn, marquee, section lắp ráp điều khiển bằng cuộn (tách rời → lắp ráp → đổi tư thế bung fin funnel), lưới từng bộ phận, chi tiết cận cảnh và khối mua hàng.

Không dùng framework hay build step. Chỉ HTML + CSS + JS thuần, animation dùng `transform` / `opacity` để cuộn mượt, có tôn trọng `prefers-reduced-motion`.

## Xem thử

Mở `index.html` bằng trình duyệt, hoặc chạy server tĩnh:

```sh
python3 -m http.server 8000
# mở http://localhost:8000/
```

## Cấu trúc

```
index.html      Trang chính (tiếng Việt)
styles.css      Toàn bộ giao diện + animation cuộn
app.js          Reveal, parallax, thanh tiến trình, exploded view theo cuộn, menu mobile
assets/
  fin-funnels.webp      Ảnh hero: fin funnel bung ra (minh họa AI từ mẫu thật)
  exploded-view.webp    Ảnh exploded view (minh họa AI)
  detail-head-chest.webp Cận cảnh đầu và ngực (minh họa AI)
  hero-original.png     Ảnh sản phẩm gốc do shop đăng
```

## Nguồn và lưu ý trung thực

- Giá **1.550.000đ**, tình trạng còn hàng tại C3 Gundam được kiểm tra ngày **23/11/2026**. Giá có thể đổi — kiểm tra lại trên trang shop trước khi trả tiền.
- Ảnh exploded view, cận cảnh và fin funnel là **hình minh họa AI dựa trên mẫu thật**, không phải bản vẽ kỹ thuật chính thức của Bandai, không phải ảnh chụp thật của từng góc.
- Ảnh `hero-original.png` là ảnh sản phẩm gốc do shop đăng.
- Gundam, Hi-V và Ver.Ka thuộc về chủ sở hữu tương ứng. Trang này là bản trình bày độc lập, không bán hàng và không nhận thanh toán.
- Video AI hiện không khả dụng cho tài khoản này, nên trang dùng chuyển động cuộn bằng CSS/JS thay cho video nền.

## Triển khai GitHub Pages

Repo này là site tĩnh, bật GitHub Pages với nhánh `main`, thư mục `/ (root)` là xem được ngay, không cần build.

export function ConversionArticle() {
  return (
    <article className="seoArticle converterArticle">
      <h2>Cách đổi ngày dương lịch sang âm lịch</h2>
      <p>
        Để đổi một ngày dương sang âm, chọn tab <strong>&ldquo;Dương → Âm&rdquo;</strong>, nhập ngày/tháng/năm dương lịch rồi nhấn Chuyển đổi. Kết quả hiển thị ngày âm tương ứng, kèm can chi ngày–tháng–năm, tiết khí, trạng thái hoàng đạo/hắc đạo và danh sách giờ tốt trong ngày.
      </p>
      <p>
        Lưu ý: cùng một ngày dương lịch sẽ rơi vào ngày âm <strong>khác nhau theo từng năm</strong>. Ví dụ 15/8 dương lịch năm nay không phải là rằm tháng 8 âm lịch — cần tra cứu cụ thể từng năm.
      </p>

      <h2>Cách đổi ngày âm lịch sang dương lịch</h2>
      <p>
        Chọn tab <strong>&ldquo;Âm → Dương&rdquo;</strong>, nhập ngày/tháng/năm âm lịch. Nếu ngày thuộc <strong>tháng nhuận</strong>, bật thêm tùy chọn &ldquo;Tháng nhuận âm lịch&rdquo; — nếu bỏ qua bước này, kết quả có thể không chính xác hoặc trả về ngày khác.
      </p>
      <p>
        Năm âm lịch có tháng nhuận thêm một tháng vào giữa năm. Ví dụ năm 2023 có tháng 2 nhuận — ngày âm 15/2 nhuận/2023 và 15/2/2023 là hai ngày dương lịch hoàn toàn khác nhau.
      </p>

      <h2>So sánh lịch âm và lịch dương</h2>
      <p>
        Lịch dương (Gregorian) được tính theo chu kỳ Trái Đất quay quanh Mặt Trời, cố định 365–366 ngày/năm. Lịch âm Việt Nam thực chất là <strong>âm dương lịch</strong> — kết hợp chu kỳ Mặt Trăng với tiết khí Mặt Trời để không lệch quá xa mùa vụ. Mỗi tháng âm có 29 hoặc 30 ngày; năm âm có 353–355 ngày; năm nhuận thêm một tháng thành 383–385 ngày.
      </p>

      <h2>Các trường hợp cần đổi ngày âm dương</h2>
      <ul>
        <li>Tra ngày cúng giỗ, ngày giỗ tổ theo năm mới (ngày âm cố định, ngày dương thay đổi).</li>
        <li>Xác định ngày rằm, ngày mùng một, Tết Nguyên Đán, Tết Đoan Ngọ, Tết Trung Thu.</li>
        <li>Kiểm tra sinh nhật âm lịch — ngày dương lịch mỗi năm một khác.</li>
        <li>Chọn ngày tốt (hoàng đạo) cho cưới hỏi, khai trương, xuất hành.</li>
        <li>Ghi lịch theo âm dương để không nhầm kỳ giỗ hay ngày lễ.</li>
      </ul>

      <h2>Lưu ý khi đổi ngày</h2>
      <ul>
        <li>Kết quả tính theo múi giờ Việt Nam (UTC+7). Nếu bạn ở múi giờ khác, ngày âm có thể lệch một ngày.</li>
        <li>Phạm vi hỗ trợ: từ năm 1800 đến 2199. Ngoài khoảng này dữ liệu thiên văn kém chính xác hơn.</li>
        <li>Luôn kiểm tra kỹ tháng nhuận khi đổi ngày âm sang dương để tránh nhầm.</li>
      </ul>

      <h2>Câu hỏi thường gặp</h2>
      <h3>Ngày dương lịch đổi sang âm lịch có cố định không?</h3>
      <p>Không. Cùng một ngày dương lịch nhưng ngày âm tương ứng thay đổi theo từng năm do chu kỳ Mặt Trăng không bằng chu kỳ Mặt Trời.</p>
      <h3>Tại sao kết quả báo "ngày âm không tồn tại"?</h3>
      <p>Một số ngày âm trong tháng nhuận chỉ tồn tại khi bật tùy chọn tháng nhuận. Ngoài ra, ngày 29/30 của tháng âm ngắn (29 ngày) cũng không tồn tại.</p>
      <h3>Công cụ này có thể xem ngày tốt xấu không?</h3>
      <p>Sau khi đổi ngày, trang kết quả hiển thị luôn can chi, hoàng đạo/hắc đạo và danh sách giờ tốt trong ngày để tham khảo.</p>
    </article>
  );
}

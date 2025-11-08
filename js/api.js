// Dữ liệu JSON giả (Mock data)
const MOCK_KHOAN_THU = [
    {id: 1, TenKhoanThu: "Phí vệ sinh T11/2025", SoTien: 50000, LoaiKhoanThu: 0}, // 0 = Bắt buộc
    {id: 2, TenKhoanThu: "Quỹ khuyến học 2025", SoTien: 100000, LoaiKhoanThu: 1}, // 1 = Tự nguyện
    {id: 3, TenKhoanThu: "Phí bảo trì thang máy", SoTien: 150000, LoaiKhoanThu: 0}
];

/**
 * Lấy danh sách khoản thu (hiện tại là MOCK)
 * Dùng 'async' và 'Promise' để giả lập một API call bất đồng bộ
 */
async function getKhoanThu() {
    console.log("Đang dùng MOCK DATA - Lấy danh sách khoản thu...");
    // Giả lập độ trễ mạng 0.5 giây
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_KHOAN_THU;
}

/**
 * Thêm một khoản thu mới (hiện tại là MOCK)
 */
async function addKhoanThu(newFee) {
    console.log("Đang dùng MOCK DATA - Thêm khoản thu mới...", newFee);
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 500));

    // Tạo ID mới (logic đơn giản)
    const newId = MOCK_KHOAN_THU.length + 1;
    const feeToAdd = {id: newId, ...newFee};

    MOCK_KHOAN_THU.push(feeToAdd);

    console.log("Đã thêm:", feeToAdd);
    return feeToAdd;
}
// Chạy khi DOM được tải, chỉ áp dụng cho trang index.html
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {

    document.addEventListener("DOMContentLoaded", () => {
        // Tải mọi thứ cần thiết cho dashboard
        loadDashboard();

        // Gắn sự kiện cho nút "Lưu lại" trong Modal
        const saveFeeButton = document.getElementById("saveFeeButton");
        saveFeeButton.addEventListener("click", handleSaveNewFee);
    });
}

/**
 * Hàm chính, tải và hiển thị dữ liệu dashboard
 */
async function loadDashboard() {
    // 1. Hiển thị tên người dùng
    const username = localStorage.getItem("username") || "Quản trị viên";
    document.getElementById("userName").textContent = username;

    // 2. Lấy và render bảng khoản thu
    try {
        const fees = await getKhoanThu(); // Gọi hàm từ api.js
        renderFeeTable(fees); // Render ra bảng
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

/**
 * Render dữ liệu khoản thu ra bảng HTML
 * @param {Array} fees - Mảng các đối tượng khoản thu
 */
function renderFeeTable(fees) {
    const tableBody = document.getElementById("feeTableBody");
    if (!tableBody) return; // Thoát nếu không tìm thấy bảng

    // Xóa dữ liệu cũ
    tableBody.innerHTML = "";

    // Lặp qua dữ liệu và tạo dòng mới
    fees.forEach(fee => {
        const row = document.createElement("tr");

        // Format loại khoản thu
        const loaiText = fee.LoaiKhoanThu === 0
            ? '<span class="badge bg-danger">Bắt buộc</span>'
            : '<span class="badge bg-success">Tự nguyện</span>';

        // Format số tiền
        const soTienFormatted = fee.SoTien.toLocaleString('vi-VN');

        row.innerHTML = `
            <td>KT${String(fee.id).padStart(3, '0')}</td>
            <td>${fee.TenKhoanThu}</td>
            <td>${soTienFormatted}</td>
            <td>${loaiText}</td>
            <td>
                <button class="btn btn-primary btn-sm"><i class="bi bi-pencil-fill"></i> Sửa</button>
                <button class="btn btn-danger btn-sm"><i class="bi bi-trash-fill"></i> Xóa</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

/**
 * Xử lý khi nhấn nút "Lưu lại" trên modal thêm khoản thu
 */
async function handleSaveNewFee() {
    // 1. Lấy dữ liệu từ form trong modal
    const ten = document.getElementById("tenKhoanThu").value;
    const soTien = document.getElementById("soTien").value;
    const loai = document.getElementById("loaiKhoanThu").value;

    // 2. Validate đơn giản
    if (!ten || !soTien) {
        alert("Vui lòng nhập đầy đủ Tên khoản thu và Số tiền.");
        return;
    }

    // 3. Tạo đối tượng dữ liệu mới
    const newFeeData = {
        TenKhoanThu: ten,
        SoTien: parseFloat(soTien),
        LoaiKhoanThu: parseInt(loai)
    };

    // 4. Gọi API (giả) để thêm
    try {
        await addKhoanThu(newFeeData); // Gọi hàm từ api.js

        // 5. Tải lại bảng
        loadDashboard();

        // 6. Xóa form và đóng modal
        document.getElementById("addFeeForm").reset(); // Xóa form
        const modalElement = document.getElementById('addFeeModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }

    } catch (error) {
        console.error("Lỗi khi thêm khoản thu:", error);
        alert("Thêm khoản thu thất bại!");
    }
}
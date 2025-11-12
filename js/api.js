/**
 * URL CƠ SỞ CỦA API.
 * !!! THAY THẾ URL NÀY BẰNG URL TỪ NGROK CỦA BẠN !!!
 * (Phải giống hệt URL trong file auth.js)
 */
const API_BASE_URL = "https://684e1717f7c1.ngrok-free.app/"; // <--- THAY URL NÀY

/**
 * Hàm 'fetch' tùy chỉnh, tự động đính kèm Token
 * và xử lý lỗi 401 (Unauthorized)
 */
async function fetchWithAuth(url, options = {}) {
    const token = getAccessToken(); // Lấy token từ auth.js (nếu bạn gộp file) hoặc localStorage

    // Chuẩn bị headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // Ghi đè header nếu cần
    };

    // Thêm token vào header nếu có
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Thêm header vào options
    const newOptions = { ...options, headers: headers };

    try {
        const response = await fetch(url, newOptions);

        // Xử lý lỗi Token hết hạn (401)
        if (response.status === 401) {
            alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            // (Nâng cao: Có thể dùng refresh token ở đây)
            handleLogout(); // Gọi hàm từ auth.js (nếu bạn gộp file)
            return; // Dừng lại
        }

        if (!response.ok) {
            // Xử lý các lỗi khác (404, 500...)
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        // Nếu request là DELETE hoặc không có nội dung, trả về response
        if (response.status === 204) {
            return;
        }

        return await response.json(); // Lấy dữ liệu JSON thật

    } catch (error) {
        console.error("Lỗi gọi API:", error);
        throw error; // Ném lỗi ra để hàm gọi xử lý
    }
}

// --- Các hàm nghiệp vụ ---

/**
 * Lấy danh sách khoản thu (API THẬT)
 */
async function getKhoanThu() {
    console.log("Đang gọi API thật - Lấy danh sách khoản thu...");
    return await fetchWithAuth(`${API_BASE_URL}/api/khoan-thu/`);
}

/**
 * Thêm một khoản thu mới (API THẬT)
 */
async function addKhoanThu(newFee) {
    console.log("Đang gọi API thật - Thêm khoản thu mới...", newFee);

    return await fetchWithAuth(`${API_BASE_URL}/api/khoan-thu/`, {
        method: 'POST',
        body: JSON.stringify(newFee)
    });
}

// --- Gộp các hàm từ auth.js vào đây để tiện quản lý ---
// (Nếu bạn muốn giữ 2 file riêng, bạn phải import/export hoặc
// đảm bảo cả hai file được tải trong HTML)

function getAccessToken() {
    return localStorage.getItem("accessToken");
}

function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}
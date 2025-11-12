/**
 * URL CƠ SỞ CỦA API.
 * !!! THAY THẾ URL NÀY BẰNG URL TỪ NGROK CỦA BẠN !!!
 */
const API_BASE_URL = "https://1c7df611cf01.ngrok-free.app"; // <--- THAY URL NÀY

// Chạy ngay khi DOM được tải
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutButton");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    // Bảo vệ trang: Kiểm tra token nếu không phải trang login
    if (!window.location.pathname.endsWith('login.html')) {
        checkAuth();
    }
});

/**
 * Kiểm tra xem người dùng đã có access token hay chưa.
 * Nếu chưa, đá về trang login.html.
 */
function checkAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        window.location.href = "login.html";
    }
    // (Phiên bản nâng cao: bạn có thể gọi API /api/token/verify/ ở đây)
}

/**
 * Xử lý sự kiện submit form đăng nhập
 */
async function handleLoginSubmit(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("loginError");
    const spinner = loginButton.querySelector(".spinner-border");

    // Hiển thị loading
    loginButton.disabled = true;
    spinner.classList.remove("d-none");
    loginError.classList.add("d-none");

    try {
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            // Đăng nhập THÀNH CÔNG
            const data = await response.json();

            // Lưu token vào localStorage
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("username", username); // Lưu username để chào hỏi

            window.location.href = "index.html"; // Chuyển đến trang dashboard
        } else {
            // Đăng nhập THẤT BẠI
            loginError.textContent = "Tên đăng nhập hoặc mật khẩu không chính xác!";
            loginError.classList.remove("d-none");
        }

    } catch (error) {
        // Lỗi mạng (không kết nối được BE)
        console.error("Lỗi kết nối:", error);
        loginError.textContent = "Không thể kết nối đến máy chủ. Hãy đảm bảo ngrok và server Django đang chạy.";
        loginError.classList.remove("d-none");
    } finally {
        // Luôn tắt loading
        loginButton.disabled = false;
        spinner.classList.add("d-none");
    }
}

/**
 * Xử lý sự kiện đăng xuất
 */
function handleLogout() {
    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

/**
 * Lấy access token từ localStorage
 */
function getAccessToken() {
    return localStorage.getItem("accessToken");
}

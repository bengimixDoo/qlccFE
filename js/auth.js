// Chạy ngay khi DOM được tải
document.addEventListener("DOMContentLoaded", () => {

    // Tìm các phần tử
    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutButton");

    // 1. Gắn logic cho Form Đăng nhập (nếu nó tồn tại trên trang này)
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }

    // 2. Gắn logic cho Nút Đăng xuất (nếu nó tồn tại)
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    // 3. Bảo vệ trang
    // Nếu chúng ta không ở trang login.html, hãy kiểm tra xem user đã đăng nhập chưa
    if (!window.location.pathname.endsWith('login.html')) {
        checkAuth();
    }
});

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa.
 * Nếu chưa, đá về trang login.html.
 */
function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        window.location.href = "login.html";
    }
}

/**
 * Xử lý sự kiện submit form đăng nhập
 */
async function handleLoginSubmit(event) {
    event.preventDefault(); // Ngăn form submit theo cách truyền thống

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("loginError");
    const spinner = loginButton.querySelector(".spinner-border");

    // Hiển thị loading
    loginButton.disabled = true;
    spinner.classList.remove("d-none");
    loginError.classList.add("d-none");

    // --- MOCK LOGIC (GIẢ LẬP GỌI API) ---
    // Trong Giai đoạn 4, chúng ta sẽ gọi API thật ở đây
    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập độ trễ mạng

    if (username === "admin" && password === "123") {
        // Đăng nhập thành công
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        window.location.href = "index.html"; // Chuyển đến trang dashboard
    } else {
        // Đăng nhập thất bại
        loginError.classList.remove("d-none");
        loginButton.disabled = false;
        spinner.classList.add("d-none");
    }
}

/**
 * Xử lý sự kiện đăng xuất
 */
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}
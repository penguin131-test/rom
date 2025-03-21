// Lưu dữ liệu khi thay đổi
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
        saveData(input.closest('table').id);
    });
});

// Tải dữ liệu khi mở trang
window.onload = () => {
    loadData('nonRootedTable');
    loadData('rootedTable');
};

// Xử lý tab
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.table-section').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-tab') + 'Section').classList.add('active');
    });
});

// Lưu dữ liệu vào localStorage
function saveData(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    const data = [];
    rows.forEach(row => {
        const category = row.cells[0].innerText || row.previousElementSibling.cells[0].innerText;
        const feature = row.cells[1].innerText;
        const pass = row.querySelector('input[value="pass"]').checked;
        const notPass = row.querySelector('input[value="notpass"]').checked;
        const notTested = row.querySelector('input[value="nottested"]').checked;
        const errors = row.querySelector('.error-input').value;
        const notes = row.querySelector('.note-input').value;
        data.push({ category, feature, pass, notPass, notTested, errors, notes });
    });
    localStorage.setItem(tableId, JSON.stringify(data));
}

// Tải dữ liệu từ localStorage
function loadData(tableId) {
    const savedData = localStorage.getItem(tableId);
    if (savedData) {
        const data = JSON.parse(savedData);
        const rows = document.getElementById(tableId).querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            const { pass, notPass, notTested, errors, notes } = data[index];
            if (pass) row.querySelector('input[value="pass"]').checked = true;
            if (notPass) row.querySelector('input[value="notpass"]').checked = true;
            if (notTested) row.querySelector('input[value="nottested"]').checked = true;
            row.querySelector('.error-input').value = errors;
            row.querySelector('.note-input').value = notes;
        });
    }
}

// Tải xuống bảng dưới dạng hình ảnh với watermark
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tableId = btn.getAttribute('data-table');
        const section = document.getElementById(tableId + 'Section'); // Chụp toàn bộ table-section
        
        // Tạm thời ẩn nút "Save as Image" để không xuất hiện trong ảnh
        btn.style.display = 'none';

        // Tạm thời bỏ giới hạn chiều cao của bảng để chụp toàn bộ nội dung
        const tableWrapper = section.querySelector('.table-wrapper');
        const originalHeight = tableWrapper.style.maxHeight;
        tableWrapper.style.maxHeight = 'none';

        html2canvas(section, {
            backgroundColor: '#2a2a3d', // Màu nền của section
            scale: 2, // Độ phân giải cao hơn
            useCORS: true, // Hỗ trợ tải tài nguyên từ nguồn khác nếu cần
            scrollX: 0, // Đảm bảo không bị lệch do scroll
            scrollY: 0, // Đảm bảo không bị lệch do scroll
            height: section.scrollHeight // Chụp toàn bộ chiều cao của section
        }).then(canvas => {
            const ctx = canvas.getContext('2d');
            
            // Thêm watermark
            ctx.font = '20px Inter';
            ctx.fillStyle = 'rgba(160, 231, 229, 0.7)';
            ctx.textAlign = 'right';
            ctx.fillText('@penguin1301', canvas.width - 20, canvas.height - 20);

            // Tạo link tải xuống
            const link = document.createElement('a');
            link.download = tableId === 'nonRooted' ? 'ROM_Test_NonRooted.png' : 'ROM_Test_Rooted.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Khôi phục trạng thái
            btn.style.display = 'flex'; // Hiển thị lại nút
            tableWrapper.style.maxHeight = originalHeight; // Khôi phục giới hạn chiều cao
        }).catch(err => {
            console.error('Error capturing section as image:', err);
            alert('Có lỗi xảy ra khi chụp ảnh. Vui lòng thử lại!');
            btn.style.display = 'flex'; // Hiển thị lại nút nếu có lỗi
            tableWrapper.style.maxHeight = originalHeight; // Khôi phục nếu có lỗi
        });
    });
});

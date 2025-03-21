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

// Tải xuống bảng dưới dạng hình ảnh
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tableId = btn.getAttribute('data-table') === 'nonRooted' ? 'nonRootedTable' : 'rootedTable';
        const table = document.getElementById(tableId);
        
        html2canvas(table, {
            backgroundColor: '#2a2a3d', // Màu nền của bảng
            scale: 2, // Độ phân giải cao hơn
            useCORS: true // Hỗ trợ tải tài nguyên từ nguồn khác nếu cần
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = tableId === 'nonRootedTable' ? 'ROM_Test_NonRooted.png' : 'ROM_Test_Rooted.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Error capturing table as image:', err);
            alert('Có lỗi xảy ra khi chụp ảnh bảng. Vui lòng thử lại!');
        });
    });
});

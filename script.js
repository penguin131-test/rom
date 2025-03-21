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

// Tải xuống file CSV
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tableId = btn.getAttribute('data-table') === 'nonRooted' ? 'nonRootedTable' : 'rootedTable';
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tr');
        let csv = 'Category,Function/Feature,Pass,Not Pass,Not Tested,Errors,Notes\n';
        rows.forEach((row, index) => {
            if (index === 0) return; // Bỏ qua header
            const category = row.cells[0].innerText || row.previousElementSibling.cells[0].innerText;
            const feature = row.cells[1].innerText;
            const pass = row.querySelector('input[value="pass"]').checked ? 'Yes' : 'No';
            const notPass = row.querySelector('input[value="notpass"]').checked ? 'Yes' : 'No';
            const notTested = row.querySelector('input[value="nottested"]').checked ? 'Yes' : 'No';
            const errors = row.querySelector('.error-input').value;
            const notes = row.querySelector('.note-input').value;
            csv += `"${category}","${feature}","${pass}","${notPass}","${notTested}","${errors}","${notes}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tableId === 'nonRootedTable' ? 'ROM_Test_NonRooted.csv' : 'ROM_Test_Rooted.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    });
});

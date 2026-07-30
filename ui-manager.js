// ========== UI MANAGER - Handles all UI rendering and interactions ==========

class UIManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Product modal
        document.getElementById('addProductBtn')?.addEventListener('click', () => this.openProductModal());
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.handleProductSubmit(e));
        document.querySelector('#productModal .close')?.addEventListener('click', () => closeProductModal());

        // Customer modal
        document.getElementById('addCustomerBtn')?.addEventListener('click', () => this.openCustomerModal());
        document.getElementById('customerForm')?.addEventListener('submit', (e) => this.handleCustomerSubmit(e));

        // Settings
        document.getElementById('saveSettingsBtn')?.addEventListener('click', () => this.saveSettings());

        // Export/Import
        document.getElementById('exportBtn')?.addEventListener('click', () => dataManager.exportData());
        document.getElementById('importBtn')?.addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile')?.addEventListener('change', (e) => this.handleImport(e));

        // Reports
        document.getElementById('generateReportBtn')?.addEventListener('click', () => this.generateReport());

        // Inventory search
        document.getElementById('inventorySearch')?.addEventListener('input', (e) => this.handleInventorySearch(e));

        // Customer search
        document.getElementById('customerSearch')?.addEventListener('input', (e) => this.handleCustomerSearch(e));

        // Product search (for POS)
        document.getElementById('productSearch')?.addEventListener('input', (e) => posManager.handleProductSearch(e));
    }

    handleNavigation(e) {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.currentTarget.classList.add('active');
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(page).classList.add('active');
        
        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'pos': 'Bán Hàng (POS)',
            'inventory': 'Quản Lý Kho',
            'customers': 'Danh Sách Khách Hàng',
            'reports': 'Báo Cáo',
            'settings': 'Cài Đặt'
        };
        document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';
        
        // Load page content
        if (page === 'dashboard') {
            this.loadDashboard();
        } else if (page === 'inventory') {
            this.loadInventory();
        } else if (page === 'customers') {
            this.loadCustomers();
        } else if (page === 'pos') {
            posManager.initPOS();
        } else if (page === 'settings') {
            this.loadSettings();
        }
    }

    // ========== DASHBOARD ==========

    loadDashboard() {
        this.updateDashboardStats();
        this.updateCharts();
    }

    updateDashboardStats() {
        const todayRevenue = dataManager.getTodayRevenue();
        const todayTransactions = dataManager.getTodayTransactions().length;
        const totalProducts = dataManager.getProducts().length;
        const totalCustomers = dataManager.getCustomers().length;

        document.getElementById('todayRevenue').textContent = this.formatCurrency(todayRevenue);
        document.getElementById('todayTransactions').textContent = todayTransactions;
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalCustomers').textContent = totalCustomers;

        this.updateAlerts();
        this.updateTopProducts();
    }

    updateCharts() {
        this.updateRevenueChart();
    }

    updateRevenueChart() {
        const chartCanvas = document.getElementById('revenueChart');
        if (!chartCanvas) return;

        const revenueByDay = dataManager.getRevenueByDay();
        const labels = Object.keys(revenueByDay).map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric' });
        });
        const data = Object.values(revenueByDay);

        const ctx = chartCanvas.getContext('2d');
        
        // Clear previous chart if exists
        if (window.revenueChartInstance) {
            window.revenueChartInstance.destroy();
        }

        window.revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh Thu (₫)',
                    data: data,
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#0066cc'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    updateTopProducts() {
        const topProducts = dataManager.getTopProducts(5);
        const container = document.getElementById('topProducts');
        container.innerHTML = '';

        if (topProducts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Chưa có dữ liệu</p>';
            return;
        }

        topProducts.forEach((product, index) => {
            const item = document.createElement('div');
            item.className = 'product-item';
            item.innerHTML = `
                <strong>${index + 1}. ${product.name}</strong>
                <span class="count">${product.count} ${product.unit || 'cái'}</span>
            `;
            container.appendChild(item);
        });
    }

    updateAlerts() {
        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '';

        // Low stock alerts
        const lowStockProducts = dataManager.getLowStockAlerts();
        lowStockProducts.forEach(product => {
            const alert = document.createElement('div');
            alert.className = 'alert-item warning';
            alert.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>${product.name}: Tồn kho thấp (${product.quantity} cái)</span>
            `;
            alertsList.appendChild(alert);
        });

        // Expiring products alerts
        const expiringProducts = dataManager.getExpiringProducts();
        expiringProducts.forEach(product => {
            const alert = document.createElement('div');
            alert.className = 'alert-item warning';
            alert.innerHTML = `
                <i class="fas fa-calendar-times"></i>
                <span>${product.name}: Sắp hết hạn (${product.expiry})</span>
            `;
            alertsList.appendChild(alert);
        });

        // Expired products alerts
        const expiredProducts = dataManager.getExpiredProducts();
        expiredProducts.forEach(product => {
            const alert = document.createElement('div');
            alert.className = 'alert-item danger';
            alert.innerHTML = `
                <i class="fas fa-ban"></i>
                <span>${product.name}: Đã hết hạn sử dụng</span>
            `;
            alertsList.appendChild(alert);
        });

        if (alertsList.children.length === 0) {
            alertsList.innerHTML = '<p style="text-align: center; color: #28a745;">✓ Tất cả bình thường</p>';
        }
    }

    // ========== INVENTORY MANAGEMENT ==========

    loadInventory() {
        this.displayInventory(dataManager.getProducts());
    }

    displayInventory(products) {
        const container = document.getElementById('inventoryTable');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Chưa có sản phẩm nào</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Tên Sản Phẩm</th>
                        <th>Barcode</th>
                        <th>Giá Bán</th>
                        <th>Tồn Kho</th>
                        <th>Mức Cảnh Báo</th>
                        <th>Hạn Sử Dụng</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
        `;

        products.forEach(product => {
            let status = 'active';
            let statusText = '✓ Bình thường';
            let statusClass = 'active';

            if (product.quantity <= product.alertLevel) {
                status = 'warning';
                statusText = '⚠ Tồn kho thấp';
                statusClass = 'warning';
            }

            if (product.expiry) {
                const expiryDate = new Date(product.expiry);
                if (expiryDate < new Date()) {
                    status = 'expired';
                    statusText = '✗ Đã hết hạn';
                    statusClass = 'expired';
                }
            }

            html += `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td>${product.barcode || '-'}</td>
                    <td>${this.formatCurrency(product.price)}</td>
                    <td>${product.quantity}</td>
                    <td>${product.alertLevel}</td>
                    <td>${product.expiry ? product.expiry : '-'}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="uiManager.editProduct('${product.id}')">Sửa</button>
                            <button class="btn-delete" onclick="uiManager.deleteProduct('${product.id}')">Xóa</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    handleInventorySearch(e) {
        const query = e.target.value;
        const results = dataManager.searchProducts(query);
        this.displayInventory(results);
    }

    openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        document.getElementById('productModalTitle').textContent = productId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm';

        // Reset form
        document.getElementById('productForm').reset();

        if (productId) {
            const product = dataManager.getProductById(productId);
            if (product) {
                document.getElementById('productName').value = product.name;
                document.getElementById('productBarcode').value = product.barcode || '';
                document.getElementById('productCostPrice').value = product.costPrice || '';
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productQuantity').value = product.quantity;
                document.getElementById('productAlertLevel').value = product.alertLevel;
                document.getElementById('productIngredients').value = product.ingredients || '';
                document.getElementById('productUses').value = product.uses || '';
                document.getElementById('productExpiry').value = product.expiry || '';
                document.getElementById('productManufacturer').value = product.manufacturer || '';
                document.getElementById('productForm').dataset.editId = productId;
            }
        } else {
            delete document.getElementById('productForm').dataset.editId;
        }

        modal.classList.add('show');
    }

    handleProductSubmit(e) {
        e.preventDefault();

        const product = {
            name: document.getElementById('productName').value,
            barcode: document.getElementById('productBarcode').value,
            costPrice: parseFloat(document.getElementById('productCostPrice').value) || 0,
            price: parseFloat(document.getElementById('productPrice').value),
            quantity: parseInt(document.getElementById('productQuantity').value),
            alertLevel: parseInt(document.getElementById('productAlertLevel').value),
            ingredients: document.getElementById('productIngredients').value,
            uses: document.getElementById('productUses').value,
            expiry: document.getElementById('productExpiry').value,
            manufacturer: document.getElementById('productManufacturer').value
        };

        const editId = e.target.dataset.editId;
        if (editId) {
            dataManager.updateProduct(editId, product);
        } else {
            dataManager.addProduct(product);
        }

        closeProductModal();
        this.loadInventory();
    }

    editProduct(productId) {
        this.openProductModal(productId);
    }

    deleteProduct(productId) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            dataManager.deleteProduct(productId);
            this.loadInventory();
        }
    }

    // ========== CUSTOMER MANAGEMENT ==========

    loadCustomers() {
        this.displayCustomers(dataManager.getCustomers());
    }

    displayCustomers(customers) {
        const container = document.getElementById('customersTable');
        container.innerHTML = '';

        if (customers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Chưa có khách hàng nào</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Tên Khách Hàng</th>
                        <th>Số Điện Thoại</th>
                        <th>Địa Chỉ</th>
                        <th>Số Lần Mua</th>
                        <th>Tổng Chi Tiêu</th>
                        <th>Điểm Tích Lũy</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
        `;

        customers.forEach(customer => {
            html += `
                <tr>
                    <td><strong>${customer.name}</strong></td>
                    <td>${customer.phone || '-'}</td>
                    <td>${customer.address || '-'}</td>
                    <td>${customer.purchaseCount || 0}</td>
                    <td>${this.formatCurrency(customer.totalSpent || 0)}</td>
                    <td><strong>${customer.points || 0}</strong></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="uiManager.editCustomer('${customer.id}')">Sửa</button>
                            <button class="btn-delete" onclick="uiManager.deleteCustomer('${customer.id}')">Xóa</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    handleCustomerSearch(e) {
        const query = e.target.value;
        const results = dataManager.searchCustomers(query);
        this.displayCustomers(results);
    }

    openCustomerModal(customerId = null) {
        const modal = document.getElementById('customerModal');
        document.getElementById('customerModalTitle').textContent = customerId ? 'Sửa Khách Hàng' : 'Thêm Khách Hàng';

        // Reset form
        document.getElementById('customerForm').reset();

        if (customerId) {
            const customer = dataManager.getCustomerById(customerId);
            if (customer) {
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerPhone').value = customer.phone || '';
                document.getElementById('customerAddress').value = customer.address || '';
                document.getElementById('customerPoints').value = customer.points || 0;
                document.getElementById('customerForm').dataset.editId = customerId;
            }
        } else {
            delete document.getElementById('customerForm').dataset.editId;
        }

        modal.classList.add('show');
    }

    handleCustomerSubmit(e) {
        e.preventDefault();

        const customer = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value,
            points: parseInt(document.getElementById('customerPoints').value) || 0
        };

        const editId = e.target.dataset.editId;
        if (editId) {
            dataManager.updateCustomer(editId, customer);
        } else {
            dataManager.addCustomer(customer);
        }

        closeCustomerModal();
        this.loadCustomers();
    }

    editCustomer(customerId) {
        this.openCustomerModal(customerId);
    }

    deleteCustomer(customerId) {
        if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            dataManager.deleteCustomer(customerId);
            this.loadCustomers();
        }
    }

    // ========== REPORTS ==========

    generateReport() {
        const period = document.getElementById('reportPeriod').value;
        const container = document.getElementById('reportsContent');
        container.innerHTML = '';

        let transactions = [];
        let title = '';

        if (period === 'today') {
            transactions = dataManager.getTodayTransactions();
            title = 'Báo Cáo Hôm Nay';
        } else if (period === 'week') {
            transactions = dataManager.getWeekTransactions();
            title = 'Báo Cáo 7 Ngày Qua';
        } else if (period === 'month') {
            transactions = dataManager.getMonthTransactions();
            title = 'Báo Cáo Tháng Này';
        } else {
            transactions = dataManager.getTransactions();
            title = 'Báo Cáo Toàn Bộ';
        }

        let totalRevenue = 0;
        let totalCost = 0;
        let totalProfit = 0;
        const productsSold = {};

        transactions.forEach(transaction => {
            totalRevenue += transaction.finalAmount || 0;
            
            transaction.items.forEach(item => {
                const product = dataManager.getProductById(item.productId);
                if (product) {
                    const cost = (product.costPrice || 0) * item.quantity;
                    totalCost += cost;
                    totalProfit += (item.amount - cost);

                    if (!productsSold[product.id]) {
                        productsSold[product.id] = {
                            name: product.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productsSold[product.id].quantity += item.quantity;
                    productsSold[product.id].revenue += item.amount;
                }
            });
        });

        let html = `
            <div class="report-card">
                <h3>📊 Tóm Tắt Doanh Số</h3>
                <div class="report-row">
                    <span>Tổng Doanh Thu:</span>
                    <strong>${this.formatCurrency(totalRevenue)}</strong>
                </div>
                <div class="report-row">
                    <span>Tổng Chi Phí:</span>
                    <strong>${this.formatCurrency(totalCost)}</strong>
                </div>
                <div class="report-row">
                    <span>Lợi Nhuận:</span>
                    <strong>${this.formatCurrency(totalProfit)}</strong>
                </div>
                <div class="report-row">
                    <span>Tỷ Suất Lợi Nhuận:</span>
                    <strong>${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0}%</strong>
                </div>
                <div class="report-row">
                    <span>Số Đơn Hàng:</span>
                    <strong>${transactions.length}</strong>
                </div>
            </div>
        `;

        // Top selling products
        const topProducts = Object.values(productsSold)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        if (topProducts.length > 0) {
            html += `<div class="report-card">
                <h3>🏆 Sản Phẩm Bán Chạy</h3>`;

            topProducts.forEach((product, index) => {
                html += `
                    <div class="report-row">
                        <span>${index + 1}. ${product.name}</span>
                        <strong>${product.quantity} cái</strong>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Inventory value
        const inventoryValue = dataManager.getTotalInventoryValue();
        html += `
            <div class="report-card">
                <h3>📦 Tồn Kho</h3>
                <div class="report-row">
                    <span>Số Loại Sản Phẩm:</span>
                    <strong>${dataManager.getProducts().length}</strong>
                </div>
                <div class="report-row">
                    <span>Giá Trị Tồn Kho:</span>
                    <strong>${this.formatCurrency(inventoryValue)}</strong>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // ========== SETTINGS ==========

    loadSettings() {
        const settings = dataManager.getSettings();
        document.getElementById('pharmacyName').value = settings.pharmacyName;
        document.getElementById('pharmacyAddress').value = settings.pharmacyAddress;
        document.getElementById('pharmacyPhone').value = settings.pharmacyPhone;
        document.getElementById('taxNumber').value = settings.taxNumber;
        document.getElementById('bankAccount').value = settings.bankAccount;
    }

    saveSettings() {
        const settings = {
            pharmacyName: document.getElementById('pharmacyName').value,
            pharmacyAddress: document.getElementById('pharmacyAddress').value,
            pharmacyPhone: document.getElementById('pharmacyPhone').value,
            taxNumber: document.getElementById('taxNumber').value,
            bankAccount: document.getElementById('bankAccount').value
        };

        dataManager.updateSettings(settings);
        alert('Cài đặt đã được lưu thành công!');
    }

    handleImport(e) {
        const file = e.target.files[0];
        if (file) {
            dataManager.importData(file)
                .then(() => {
                    alert('Dữ liệu đã được nhập thành công!');
                    // Reload current page
                    const activePage = document.querySelector('.page.active').id;
                    if (activePage === 'dashboard') this.loadDashboard();
                    else if (activePage === 'inventory') this.loadInventory();
                    else if (activePage === 'customers') this.loadCustomers();
                })
                .catch(() => alert('Lỗi khi nhập dữ liệu'));
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
}

// Create global UI manager instance
const uiManager = new UIManager();

// Modal helper functions
function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('show');
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('show');
}

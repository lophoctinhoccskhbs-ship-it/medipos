// ========== DATA MANAGER - Handles all data storage and retrieval ==========

class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize data structure if it doesn't exist
    initializeData() {
        if (!this.getData()) {
            const initialData = {
                products: [],
                customers: [],
                transactions: [],
                settings: {
                    pharmacyName: "Nhà Thuốc",
                    pharmacyAddress: "",
                    pharmacyPhone: "",
                    taxNumber: "",
                    bankAccount: ""
                }
            };
            this.saveData(initialData);
        }
    }

    // Get all data from localStorage
    getData() {
        const data = localStorage.getItem('mediposData');
        return data ? JSON.parse(data) : null;
    }

    // Save data to localStorage
    saveData(data) {
        localStorage.setItem('mediposData', JSON.stringify(data));
    }

    // ========== PRODUCT METHODS ==========
    
    addProduct(product) {
        const data = this.getData();
        product.id = Date.now().toString();
        product.createdAt = new Date().toISOString();
        data.products.push(product);
        this.saveData(data);
        return product;
    }

    getProducts() {
        return this.getData().products;
    }

    getProductById(id) {
        const data = this.getData();
        return data.products.find(p => p.id === id);
    }

    updateProduct(id, updatedProduct) {
        const data = this.getData();
        const index = data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            data.products[index] = { ...data.products[index], ...updatedProduct };
            this.saveData(data);
            return data.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const data = this.getData();
        data.products = data.products.filter(p => p.id !== id);
        this.saveData(data);
    }

    searchProducts(query) {
        const data = this.getData();
        query = query.toLowerCase();
        return data.products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.barcode && p.barcode.includes(query))
        );
    }

    getProductsByBarcode(barcode) {
        const data = this.getData();
        return data.products.filter(p => p.barcode === barcode);
    }

    // ========== CUSTOMER METHODS ==========

    addCustomer(customer) {
        const data = this.getData();
        customer.id = Date.now().toString();
        customer.createdAt = new Date().toISOString();
        customer.totalSpent = 0;
        customer.purchaseCount = 0;
        data.customers.push(customer);
        this.saveData(data);
        return customer;
    }

    getCustomers() {
        return this.getData().customers;
    }

    getCustomerById(id) {
        const data = this.getData();
        return data.customers.find(c => c.id === id);
    }

    updateCustomer(id, updatedCustomer) {
        const data = this.getData();
        const index = data.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            data.customers[index] = { ...data.customers[index], ...updatedCustomer };
            this.saveData(data);
            return data.customers[index];
        }
        return null;
    }

    deleteCustomer(id) {
        const data = this.getData();
        data.customers = data.customers.filter(c => c.id !== id);
        this.saveData(data);
    }

    searchCustomers(query) {
        const data = this.getData();
        query = query.toLowerCase();
        return data.customers.filter(c => 
            c.name.toLowerCase().includes(query) || 
            (c.phone && c.phone.includes(query))
        );
    }

    addCustomerPoints(customerId, amount) {
        const customer = this.getCustomerById(customerId);
        if (customer) {
            customer.points = (customer.points || 0) + amount;
            this.updateCustomer(customerId, customer);
        }
    }

    // ========== TRANSACTION METHODS ==========

    addTransaction(transaction) {
        const data = this.getData();
        transaction.id = Date.now().toString();
        transaction.createdAt = new Date().toISOString();
        data.transactions.push(transaction);
        
        // Update inventory
        transaction.items.forEach(item => {
            const product = data.products.find(p => p.id === item.productId);
            if (product) {
                product.quantity -= item.quantity;
            }
        });

        // Update customer info
        if (transaction.customerId) {
            const customer = data.customers.find(c => c.id === transaction.customerId);
            if (customer) {
                customer.totalSpent = (customer.totalSpent || 0) + transaction.totalAmount;
                customer.purchaseCount = (customer.purchaseCount || 0) + 1;
            }
        }

        this.saveData(data);
        return transaction;
    }

    getTransactions() {
        return this.getData().transactions;
    }

    getTransactionById(id) {
        const data = this.getData();
        return data.transactions.find(t => t.id === id);
    }

    getTransactionsByDate(date) {
        const data = this.getData();
        const dateStr = new Date(date).toISOString().split('T')[0];
        return data.transactions.filter(t => t.createdAt.split('T')[0] === dateStr);
    }

    getTransactionsByDateRange(startDate, endDate) {
        const data = this.getData();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return data.transactions.filter(t => {
            const tDate = new Date(t.createdAt).getTime();
            return tDate >= start && tDate <= end;
        });
    }

    getTodayTransactions() {
        const today = new Date();
        return this.getTransactionsByDate(today);
    }

    getWeekTransactions() {
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 7);
        return this.getTransactionsByDateRange(start, end);
    }

    getMonthTransactions() {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return this.getTransactionsByDateRange(start, end);
    }

    // ========== ANALYTICS METHODS ==========

    getTodayRevenue() {
        const transactions = this.getTodayTransactions();
        return transactions.reduce((sum, t) => sum + (t.finalAmount || 0), 0);
    }

    getWeekRevenue() {
        const transactions = this.getWeekTransactions();
        return transactions.reduce((sum, t) => sum + (t.finalAmount || 0), 0);
    }

    getMonthRevenue() {
        const transactions = this.getMonthTransactions();
        return transactions.reduce((sum, t) => sum + (t.finalAmount || 0), 0);
    }

    getRevenueByDay() {
        const transactions = this.getWeekTransactions();
        const revenueByDay = {};
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            revenueByDay[dateStr] = 0;
        }

        transactions.forEach(t => {
            const dateStr = t.createdAt.split('T')[0];
            if (revenueByDay.hasOwnProperty(dateStr)) {
                revenueByDay[dateStr] += t.finalAmount || 0;
            }
        });

        return revenueByDay;
    }

    getTopProducts(limit = 5) {
        const transactions = this.getTodayTransactions();
        const productSales = {};

        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                const product = this.getProductById(item.productId);
                if (product) {
                    if (!productSales[product.id]) {
                        productSales[product.id] = {
                            ...product,
                            count: 0
                        };
                    }
                    productSales[product.id].count += item.quantity;
                }
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    getLowStockAlerts() {
        const data = this.getData();
        return data.products.filter(p => 
            p.quantity <= p.alertLevel
        );
    }

    getExpiringProducts() {
        const data = this.getData();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        return data.products.filter(p => {
            if (!p.expiry) return false;
            const expiryDate = new Date(p.expiry);
            return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
        });
    }

    getExpiredProducts() {
        const data = this.getData();
        const today = new Date();

        return data.products.filter(p => {
            if (!p.expiry) return false;
            const expiryDate = new Date(p.expiry);
            return expiryDate < today;
        });
    }

    // ========== SETTINGS METHODS ==========

    getSettings() {
        return this.getData().settings;
    }

    updateSettings(newSettings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...newSettings };
        this.saveData(data);
        return data.settings;
    }

    // ========== IMPORT/EXPORT METHODS ==========

    exportData() {
        const data = this.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medipos-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // ========== UTILITY METHODS ==========

    clearAllData() {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu?')) {
            localStorage.removeItem('mediposData');
            this.initializeData();
            return true;
        }
        return false;
    }

    getTotalInventoryValue() {
        const data = this.getData();
        return data.products.reduce((sum, p) => {
            return sum + ((p.costPrice || p.price || 0) * (p.quantity || 0));
        }, 0);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
}

// Create global data manager instance
const dataManager = new DataManager();

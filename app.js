// ========== MAIN APP INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

function initApp() {
    // Load demo data if no products exist
    if (dataManager.getProducts().length === 0) {
        loadDemoData();
    }

    // Initialize UI
    uiManager.loadDashboard();

    // Check for updates regularly
    setInterval(() => {
        // Auto-update alerts every minute
        if (document.querySelector('.page.active')?.id === 'dashboard') {
            uiManager.updateAlerts();
        }
    }, 60000);

    // Log app ready
    console.log('MediPOS initialized successfully!');
    console.log('Version: 1.0.0');
}

// ========== DEMO DATA ==========

function loadDemoData() {
    // Add some demo products
    const demoProducts = [
        {
            name: 'Paracetamol 500mg',
            barcode: '8934123456001',
            costPrice: 200,
            price: 5000,
            quantity: 50,
            alertLevel: 10,
            ingredients: 'Paracetamol',
            uses: 'Hạ sốt, giảm đau',
            expiry: '2025-12-31',
            manufacturer: 'Công ty A'
        },
        {
            name: 'Ibuprofen 200mg',
            barcode: '8934123456002',
            costPrice: 250,
            price: 6000,
            quantity: 40,
            alertLevel: 10,
            ingredients: 'Ibuprofen',
            uses: 'Giảm đau, hạ sốt',
            expiry: '2025-11-30',
            manufacturer: 'Công ty B'
        },
        {
            name: 'Vitamin C 1000mg',
            barcode: '8934123456003',
            costPrice: 300,
            price: 8000,
            quantity: 100,
            alertLevel: 20,
            ingredients: 'Vitamin C',
            uses: 'Tăng đề kháng',
            expiry: '2026-06-30',
            manufacturer: 'Công ty C'
        },
        {
            name: 'Aspirin 100mg',
            barcode: '8934123456004',
            costPrice: 150,
            price: 4000,
            quantity: 5,
            alertLevel: 15,
            ingredients: 'Aspirin',
            uses: 'Giảm đau, hạ sốt',
            expiry: '2025-09-30',
            manufacturer: 'Công ty D'
        },
        {
            name: 'Omeprazole 20mg',
            barcode: '8934123456005',
            costPrice: 400,
            price: 10000,
            quantity: 30,
            alertLevel: 10,
            ingredients: 'Omeprazole',
            uses: 'Chống loét',
            expiry: '2025-08-31',
            manufacturer: 'Công ty E'
        },
        {
            name: 'Cough Syrup',
            barcode: '8934123456006',
            costPrice: 500,
            price: 12000,
            quantity: 15,
            alertLevel: 5,
            ingredients: 'Various herbs',
            uses: 'Giảm ho',
            expiry: '2026-01-31',
            manufacturer: 'Công ty F'
        }
    ];

    demoProducts.forEach(product => {
        dataManager.addProduct(product);
    });

    // Add demo customers
    const demoCustomers = [
        {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            address: '123 Đường ABC, Hà Nội',
            points: 100
        },
        {
            name: 'Trần Thị B',
            phone: '0912345678',
            address: '456 Đường XYZ, Hà Nội',
            points: 50
        },
        {
            name: 'Phạm Việt C',
            phone: '0923456789',
            address: '789 Đường DEF, Hà Nội',
            points: 75
        }
    ];

    demoCustomers.forEach(customer => {
        dataManager.addCustomer(customer);
    });

    // Update settings
    dataManager.updateSettings({
        pharmacyName: 'Nhà Thuốc MediCare',
        pharmacyAddress: 'Số 100 Đường Y Tế, Hà Nội',
        pharmacyPhone: '(024) 1234-5678',
        taxNumber: '0123456789',
        bankAccount: '1234567890'
    });

    // Add some demo transactions
    const today = new Date();
    const demoTransactions = [
        {
            items: [
                { productId: dataManager.getProducts()[0].id, name: 'Paracetamol 500mg', price: 5000, quantity: 2, amount: 10000 }
            ],
            subtotal: 10000,
            discountPercent: 0,
            discountAmount: 0,
            finalAmount: 10000,
            paymentMethod: 'cash',
            status: 'completed'
        },
        {
            items: [
                { productId: dataManager.getProducts()[1].id, name: 'Ibuprofen 200mg', price: 6000, quantity: 1, amount: 6000 },
                { productId: dataManager.getProducts()[2].id, name: 'Vitamin C 1000mg', price: 8000, quantity: 1, amount: 8000 }
            ],
            subtotal: 14000,
            discountPercent: 5,
            discountAmount: 700,
            finalAmount: 13300,
            paymentMethod: 'card',
            status: 'completed'
        }
    ];

    demoTransactions.forEach(transaction => {
        dataManager.addTransaction(transaction);
    });

    console.log('Demo data loaded successfully!');
}

// ========== LOAD EXTERNAL LIBRARIES ==========

// Load Chart.js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
script.onload = () => {
    console.log('Chart.js loaded');
};
document.head.appendChild(script);

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 1: Go to Dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        document.querySelector('[data-page="dashboard"]').click();
    }
    // Ctrl/Cmd + 2: Go to POS
    if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        document.querySelector('[data-page="pos"]').click();
    }
    // Ctrl/Cmd + 3: Go to Inventory
    if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        document.querySelector('[data-page="inventory"]').click();
    }
    // Ctrl/Cmd + 4: Go to Customers
    if ((e.ctrlKey || e.metaKey) && e.key === '4') {
        e.preventDefault();
        document.querySelector('[data-page="customers"]').click();
    }
});

// ========== MODAL CLICK OUTSIDE TO CLOSE ==========

window.addEventListener('click', (e) => {
    const productModal = document.getElementById('productModal');
    const customerModal = document.getElementById('customerModal');
    const invoiceModal = document.getElementById('invoiceModal');

    if (e.target === productModal) {
        productModal.classList.remove('show');
    }
    if (e.target === customerModal) {
        customerModal.classList.remove('show');
    }
    if (e.target === invoiceModal) {
        invoiceModal.classList.remove('show');
    }
});

// ========== PREVENT ACCIDENTAL PAGE CLOSE ==========

window.addEventListener('beforeunload', (e) => {
    if (posManager.cart && posManager.cart.length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// ========== SERVICE WORKER FOR OFFLINE SUPPORT ==========

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

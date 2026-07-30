// ========== POS MANAGER - Handles Point of Sale operations ==========

class POSManager {
    constructor() {
        this.cart = [];
        this.selectedPaymentMethod = 'cash';
    }

    initPOS() {
        this.loadProducts();
        this.loadCartUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('clearCartBtn')?.addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn')?.addEventListener('click', () => this.checkout());
        document.getElementById('printBtn')?.addEventListener('click', () => this.printLastInvoice());
        document.getElementById('scanBtn')?.addEventListener('click', () => this.setupBarcodeScanner());
        document.getElementById('discountPercent')?.addEventListener('change', () => this.updateCartUI());
        document.getElementById('paymentMethod')?.addEventListener('change', (e) => this.handlePaymentMethodChange(e));
    }

    // ========== PRODUCT LOADING & SEARCH ==========

    loadProducts() {
        const products = dataManager.getProducts();
        this.displayProducts(products);
    }

    displayProducts(products) {
        const container = document.getElementById('productList');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">Chưa có sản phẩm nào</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => this.addToCart(product);
            
            const availableClass = product.quantity > 0 ? '' : 'style="opacity: 0.5; pointer-events: none;"';
            
            card.innerHTML = `
                <div class="product-card-name">${product.name}</div>
                <div class="product-card-price">${this.formatCurrency(product.price)}</div>
                <div class="product-card-stock">
                    ${product.quantity > 0 ? `Tồn: ${product.quantity}` : 'Hết hàng'}
                </div>
            `;
            container.appendChild(card);
        });
    }

    handleProductSearch(e) {
        const query = e.target.value;
        if (query.length === 0) {
            posManager.loadProducts();
        } else {
            const results = dataManager.searchProducts(query);
            posManager.displayProducts(results);
        }
    }

    // ========== CART MANAGEMENT ==========

    addToCart(product) {
        if (product.quantity <= 0) {
            alert('Sản phẩm này đã hết hàng');
            return;
        }

        const existingItem = this.cart.find(item => item.productId === product.id);
        
        if (existingItem) {
            if (existingItem.quantity < product.quantity) {
                existingItem.quantity++;
                existingItem.amount = existingItem.quantity * existingItem.price;
                this.updateCartUI();
            } else {
                alert('Số lượng không đủ');
            }
        } else {
            this.cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                amount: product.price
            });
            this.updateCartUI();
        }
    }

    updateCartItem(index, change) {
        if (index >= 0 && index < this.cart.length) {
            const item = this.cart[index];
            const product = dataManager.getProductById(item.productId);
            
            if (change > 0) {
                if (item.quantity < product.quantity) {
                    item.quantity += change;
                    item.amount = item.quantity * item.price;
                } else {
                    alert('Số lượng không đủ');
                }
            } else if (item.quantity + change > 0) {
                item.quantity += change;
                item.amount = item.quantity * item.price;
            } else {
                this.removeFromCart(index);
            }
            this.updateCartUI();
        }
    }

    removeFromCart(index) {
        if (index >= 0 && index < this.cart.length) {
            this.cart.splice(index, 1);
            this.updateCartUI();
        }
    }

    clearCart() {
        if (confirm('Xóa tất cả sản phẩm trong giỏ?')) {
            this.cart = [];
            this.updateCartUI();
        }
    }

    updateCartUI() {
        this.displayCartItems();
        this.updateCartTotals();
    }

    displayCartItems() {
        const container = document.getElementById('cartItems');
        container.innerHTML = '';

        if (this.cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Giỏ hàng trống</p>';
            return;
        }

        this.cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${this.formatCurrency(item.price)} × ${item.quantity} = ${this.formatCurrency(item.amount)}</div>
                </div>
                <div class="cart-item-controls">
                    <button onclick="posManager.updateCartItem(${index}, -1)">−</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button onclick="posManager.updateCartItem(${index}, 1)">+</button>
                    <button class="cart-item-remove" onclick="posManager.removeFromCart(${index})">✕</button>
                </div>
            `;
            container.appendChild(cartItem);
        });
    }

    updateCartTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + item.amount, 0);
        const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
        const discountAmount = subtotal * (discountPercent / 100);
        const finalAmount = subtotal - discountAmount;

        document.getElementById('cartTotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('discountAmount').textContent = this.formatCurrency(discountAmount);
        document.getElementById('grandTotal').textContent = this.formatCurrency(finalAmount);

        // Show/hide QR payment based on payment method
        const paymentMethod = document.getElementById('paymentMethod').value;
        if (paymentMethod === 'transfer' && finalAmount > 0) {
            this.generateQRCode(finalAmount);
        }
    }

    // ========== PAYMENT & CHECKOUT ==========

    handlePaymentMethodChange(e) {
        const method = e.target.value;
        const qrPayment = document.getElementById('qrPayment');
        
        if (method === 'transfer') {
            qrPayment.style.display = 'block';
            const finalAmount = parseFloat(document.getElementById('grandTotal').textContent.replace(/[^\d]/g, ''));
            if (finalAmount > 0) {
                this.generateQRCode(finalAmount);
            }
        } else {
            qrPayment.style.display = 'none';
        }
    }

    generateQRCode(amount) {
        const account = dataManager.getSettings().bankAccount || '0123456789';
        const qrText = `Bank|${account}|${amount}`;
        
        // Using QR code API (you can replace with actual QR library)
        const qrContainer = document.getElementById('qrCode');
        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
        qrContainer.innerHTML = `<img src="${qrURL}" alt="QR Code">`;
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Giỏ hàng trống');
            return;
        }

        const subtotal = this.cart.reduce((sum, item) => sum + item.amount, 0);
        const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
        const discountAmount = subtotal * (discountPercent / 100);
        const finalAmount = subtotal - discountAmount;
        const paymentMethod = document.getElementById('paymentMethod').value;

        // Create transaction
        const transaction = {
            items: this.cart,
            subtotal: subtotal,
            discountPercent: discountPercent,
            discountAmount: discountAmount,
            finalAmount: finalAmount,
            paymentMethod: paymentMethod,
            customerId: null,
            status: 'completed'
        };

        const savedTransaction = dataManager.addTransaction(transaction);
        this.lastInvoice = savedTransaction;

        // Clear cart and show message
        this.cart = [];
        this.updateCartUI();
        alert('Giao dịch thành công!');

        // Show invoice
        this.showInvoice(savedTransaction);

        // Refresh dashboard if it's visible
        if (document.querySelector('.page.active').id === 'pos') {
            this.initPOS();
        } else {
            uiManager.loadDashboard();
        }
    }

    // ========== INVOICE ==========

    showInvoice(transaction) {
        const modal = document.getElementById('invoiceModal');
        const invoiceContent = document.getElementById('invoiceContent');
        
        let invoiceHTML = `
            <div class="invoice-header">
                <h2>HÓA ĐƠN BÁN HÀNG</h2>
                <p>MediPOS - Hệ Thống Quản Lý Nhà Thuốc</p>
            </div>

            <div class="invoice-info">
                <div>
                    <div class="invoice-detail">
                        <strong>Nhà Thuốc:</strong>
                        <span>${dataManager.getSettings().pharmacyName}</span>
                    </div>
                    <div class="invoice-detail">
                        <strong>Địa chỉ:</strong>
                        <span>${dataManager.getSettings().pharmacyAddress}</span>
                    </div>
                    <div class="invoice-detail">
                        <strong>ĐT:</strong>
                        <span>${dataManager.getSettings().pharmacyPhone}</span>
                    </div>
                </div>
                <div>
                    <div class="invoice-detail">
                        <strong>Số HĐ:</strong>
                        <span>${transaction.id}</span>
                    </div>
                    <div class="invoice-detail">
                        <strong>Ngày:</strong>
                        <span>${new Date(transaction.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <div class="invoice-detail">
                        <strong>Phương thức:</strong>
                        <span>${this.getPaymentMethodText(transaction.paymentMethod)}</span>
                    </div>
                </div>
            </div>

            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Tên Sản Phẩm</th>
                        <th>ĐVT</th>
                        <th>Số Lượng</th>
                        <th>Đơn Giá</th>
                        <th>Thành Tiền</th>
                    </tr>
                </thead>
                <tbody>
        `;

        transaction.items.forEach(item => {
            invoiceHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>cái</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatCurrency(item.price)}</td>
                    <td>${this.formatCurrency(item.amount)}</td>
                </tr>
            `;
        });

        invoiceHTML += `
                </tbody>
            </table>

            <div class="invoice-total">
                <div>
                    <div class="total-row">
                        <span>Cộng Tiền:</span>
                        <span>${this.formatCurrency(transaction.subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span>Chiết Khấu (${transaction.discountPercent}%):</span>
                        <span>-${this.formatCurrency(transaction.discountAmount)}</span>
                    </div>
                    <div class="total-row" style="color: #0066cc; font-size: 16px; border-top: 2px solid #0066cc; padding-top: 10px;">
                        <span>TỔNG CỘNG:</span>
                        <span>${this.formatCurrency(transaction.finalAmount)}</span>
                    </div>
                </div>
            </div>

            <div class="invoice-footer">
                <p>Cảm ơn quý khách! Hẹn gặp lại.</p>
                <p>Ngày in: ${new Date().toLocaleString('vi-VN')}</p>
            </div>
        `;

        invoiceContent.innerHTML = invoiceHTML;
        modal.classList.add('show');
    }

    printLastInvoice() {
        if (!this.lastInvoice) {
            alert('Chưa có hóa đơn để in');
            return;
        }

        const printWindow = window.open('', '_blank');
        const invoiceContent = document.getElementById('invoiceContent').innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <title>Hóa Đơn</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 10px;
                        font-size: 12px;
                    }
                    .invoice-header { text-align: center; margin-bottom: 15px; }
                    .invoice-header h2 { margin: 0; }
                    .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
                    .invoice-detail { margin-bottom: 5px; }
                    .invoice-detail strong { display: inline-block; width: 120px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                    .invoice-total { display: flex; justify-content: flex-end; gap: 50px; margin-bottom: 15px; }
                    .invoice-footer { text-align: center; border-top: 1px solid #000; padding-top: 10px; }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                ${invoiceContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    downloadInvoice() {
        if (!this.lastInvoice) {
            alert('Chưa có hóa đơn để tải');
            return;
        }

        const invoiceContent = document.getElementById('invoiceContent').innerHTML;
        const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hóa Đơn</title></head><body>${invoiceContent}</body></html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hoa-don-${this.lastInvoice.id}.html`;
        link.click();
        URL.revokeObjectURL(url);
    }

    getPaymentMethodText(method) {
        const methods = {
            'cash': 'Tiền Mặt',
            'card': 'Thẻ',
            'transfer': 'Chuyển Khoản'
        };
        return methods[method] || method;
    }

    // ========== BARCODE SCANNER ==========

    setupBarcodeScanner() {
        // This is a basic implementation. For real barcode scanning, 
        // you would integrate with a camera API or barcode scanner hardware
        const barcode = prompt('Nhập mã barcode sản phẩm:');
        if (barcode) {
            const products = dataManager.getProductsByBarcode(barcode);
            if (products.length > 0) {
                this.addToCart(products[0]);
            } else {
                alert('Không tìm thấy sản phẩm với mã barcode: ' + barcode);
            }
        }
    }

    // ========== UTILITY FUNCTIONS ==========

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
}

// Create global POS manager instance
const posManager = new POSManager();

// Helper functions for invoice actions
function printInvoice() {
    posManager.printLastInvoice();
}

function downloadInvoice() {
    posManager.downloadInvoice();
}

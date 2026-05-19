// Admin Panel JavaScript

// API Helper
class AdminAPI {
    static async request(method, endpoint, data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`/api${endpoint}`, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: error.message };
        }
    }
    
    static get(endpoint) {
        return this.request('GET', endpoint);
    }
    
    static post(endpoint, data) {
        return this.request('POST', endpoint, data);
    }
    
    static put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    }
    
    static delete(endpoint) {
        return this.request('DELETE', endpoint);
    }
}

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const logoutBtn = document.getElementById('logoutBtn');

const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalCancel = document.getElementById('modalCancel');
const modalForm = document.getElementById('modalForm');
const modalTitle = document.getElementById('modalTitle');
const formFields = document.getElementById('formFields');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get page name
        const pageName = item.getAttribute('data-page');
        
        // Update page title
        pageTitle.textContent = item.textContent.trim();
        
        // Show selected page
        pages.forEach(page => page.classList.remove('active'));
        const selectedPage = document.getElementById(pageName);
        if (selectedPage) {
            selectedPage.classList.add('active');
        }
        
        // Load data for the page
        loadPageData(pageName);
        
        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Load page data from API
async function loadPageData(pageName) {
    try {
        switch(pageName) {
            case 'customers':
                await loadCustomers();
                break;
            case 'projects':
                await loadProjects();
                break;
            case 'services':
                await loadServices();
                break;
            case 'orders':
                await loadOrders();
                break;
            case 'testimonials':
                await loadTestimonials();
                break;
            case 'messages':
                await loadMessages();
                break;
            case 'dashboard':
                await loadDashboard();
                break;
        }
    } catch (error) {
        console.error('Error loading page:', error);
    }
}

// Load customers
async function loadCustomers() {
    const response = await AdminAPI.get('/customers');
    if (response.success) {
        const table = document.getElementById('customersTable');
        if (table) {
            table.innerHTML = response.data.map(customer => `
                <tr>
                    <td>${customer.fullname}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.service}</td>
                    <td><span class="badge badge-success">Hoạt động</span></td>
                    <td>${new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="editCustomer(${customer.id})">✏️ Sửa</button>
                        <button class="btn-sm btn-delete" onclick="deleteCustomer(${customer.id})">🗑️ Xóa</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// Load projects
async function loadProjects() {
    const response = await AdminAPI.get('/projects');
    if (response.success) {
        const grid = document.querySelector('.projects-grid');
        if (grid) {
            grid.innerHTML = response.data.map(project => `
                <div class="project-item">
                    <div class="project-img" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <span class="project-status">${project.status}</span>
                    </div>
                    <div class="project-details">
                        <h3>${project.name}</h3>
                        <p class="project-type">${project.type}</p>
                        <p class="project-area">${project.area}m² • Giá: ${(project.budget / 1000000).toFixed(1)}M</p>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${project.progress}%"></div>
                            </div>
                            <span>${project.progress}%</span>
                        </div>
                        <div class="project-actions">
                            <button class="btn-sm btn-edit" onclick="editProject(${project.id})">Sửa</button>
                            <button class="btn-sm btn-delete" onclick="deleteProject(${project.id})">Xóa</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Load services
async function loadServices() {
    const response = await AdminAPI.get('/services');
    if (response.success) {
        const tbody = document.querySelector('#services .data-table tbody');
        if (tbody) {
            tbody.innerHTML = response.data.map(service => `
                <tr>
                    <td>${service.name}</td>
                    <td>${service.price}</td>
                    <td>${service.description}</td>
                    <td><span class="badge badge-success">Hoạt động</span></td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="editService(${service.id})">✏️ Sửa</button>
                        <button class="btn-sm btn-delete" onclick="deleteService(${service.id})">🗑️ Xóa</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// Load orders
async function loadOrders() {
    const response = await AdminAPI.get('/orders');
    if (response.success) {
        const table = document.getElementById('ordersTable');
        if (table) {
            table.innerHTML = response.data.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td>${order.service}</td>
                    <td>${(order.amount / 1000000).toFixed(1)}M</td>
                    <td><span class="badge badge-warning">Đang xử lý</span></td>
                    <td>${new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                        <button class="btn-sm btn-view">👁️ Xem</button>
                        <button class="btn-sm btn-edit">Sửa</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// Load testimonials
async function loadTestimonials() {
    const response = await AdminAPI.get('/testimonials');
    if (response.success) {
        const container = document.querySelector('.testimonials-container');
        if (container) {
            container.innerHTML = response.data.map(testimonial => `
                <div class="testimonial-item">
                    <div class="testimonial-header">
                        <h4>${testimonial.customerName}</h4>
                        <div class="stars">${'⭐'.repeat(testimonial.rating)}</div>
                    </div>
                    <p class="testimonial-text">${testimonial.content}</p>
                    <p class="testimonial-date">Ngày: ${new Date(testimonial.createdAt).toLocaleDateString('vi-VN')}</p>
                    <div class="testimonial-actions">
                        <button class="btn-sm btn-delete" onclick="deleteTestimonial(${testimonial.id})">🗑️ Xóa</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Load messages
async function loadMessages() {
    const response = await AdminAPI.get('/messages');
    if (response.success) {
        const container = document.querySelector('.messages-container');
        if (container) {
            container.innerHTML = response.data.map(msg => `
                <div class="message-item">
                    <div class="message-header">
                        <h4>${msg.senderName}</h4>
                        <span class="message-time">${msg.timeAgo}</span>
                    </div>
                    <p class="message-text">${msg.content}</p>
                    <div class="message-actions">
                        <button class="btn-sm btn-primary">Trả lời</button>
                        <button class="btn-sm btn-secondary">Đánh dấu</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Load dashboard
async function loadDashboard() {
    const response = await AdminAPI.get('/stats');
    if (response.success) {
        const stats = response.data;
        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.stat-card h2');
        if (statCards.length > 0) {
            statCards[0].textContent = stats.totalProjects + '+';
            statCards[1].textContent = stats.totalCustomers;
            statCards[2].textContent = (stats.totalRevenue / 1000000000).toFixed(1) + 'B';
            statCards[3].textContent = stats.averageRating + '/5';
        }
    }
}

// Delete functions
async function deleteCustomer(id) {
    if (confirm('Bạn chắc chắn muốn xóa khách hàng này?')) {
        const response = await AdminAPI.delete(`/customers/${id}`);
        if (response.success) {
            alert('Xóa thành công!');
            loadCustomers();
        }
    }
}

async function deleteProject(id) {
    if (confirm('Bạn chắc chắn muốn xóa dự án này?')) {
        const response = await AdminAPI.delete(`/projects/${id}`);
        if (response.success) {
            alert('Xóa thành công!');
            loadProjects();
        }
    }
}

async function deleteService(id) {
    if (confirm('Bạn chắc chắn muốn xóa dịch vụ này?')) {
        const response = await AdminAPI.delete(`/services/${id}`);
        if (response.success) {
            alert('Xóa thành công!');
            loadServices();
        }
    }
}

async function deleteTestimonial(id) {
    if (confirm('Bạn chắc chắn muốn xóa đánh giá này?')) {
        const response = await AdminAPI.delete(`/testimonials/${id}`);
        if (response.success) {
            alert('Xóa thành công!');
            loadTestimonials();
        }
    }
}

// Sidebar Toggle Mobile
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && 
        !e.target.closest('.sidebar') && 
        !e.target.closest('.sidebar-toggle')) {
        sidebar.classList.remove('active');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
        window.location.href = '/admin/logout';
    }
});

// Modal Functions
function openModal(title, fields = []) {
    modalTitle.textContent = title;
    formFields.innerHTML = '';
    
    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        if (field.type === 'textarea') {
            group.innerHTML = `
                <label>${field.label}</label>
                <textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
            `;
        } else if (field.type === 'select') {
            group.innerHTML = `
                <label>${field.label}</label>
                <select name="${field.name}" ${field.required ? 'required' : ''}>
                    ${field.options.map(opt => `<option>${opt}</option>`).join('')}
                </select>
            `;
        } else {
            group.innerHTML = `
                <label>${field.label}</label>
                <input type="${field.type || 'text'}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
            `;
        }
        formFields.appendChild(group);
    });
    
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    modalForm.reset();
}

// Modal Events
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Add Customer Button
document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
    openModal('Thêm khách hàng', [
        { name: 'fullname', label: 'Họ và tên', placeholder: 'Nhập họ và tên', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email', required: true },
        { name: 'phone', label: 'Điện thoại', placeholder: 'Nhập số điện thoại', required: true },
        { name: 'service', label: 'Dịch vụ', type: 'select', 
          options: ['Thiết kế căn hộ', 'Thiết kế nhà phố', 'Thiết kế biệt thự', 'Thiết kế văn phòng', 'Thi công nội thất'],
          required: true },
        { name: 'message', label: 'Nhu cầu', type: 'textarea', placeholder: 'Nhập nhu cầu' }
    ]);
});

// Add Project Button
document.getElementById('addProjectBtn')?.addEventListener('click', () => {
    openModal('Thêm dự án', [
        { name: 'projectname', label: 'Tên dự án', placeholder: 'Nhập tên dự án', required: true },
        { name: 'type', label: 'Loại hình', type: 'select',
          options: ['Căn hộ', 'Nhà phố', 'Biệt thự', 'Văn phòng', 'Khác'],
          required: true },
        { name: 'customer', label: 'Khách hàng', placeholder: 'Tên khách hàng', required: true },
        { name: 'area', label: 'Diện tích (m²)', type: 'number', placeholder: '0', required: true },
        { name: 'budget', label: 'Ngân sách (VNĐ)', placeholder: '0', required: true },
        { name: 'status', label: 'Trạng thái', type: 'select',
          options: ['Chờ khảo sát', 'Đang thiết kế', 'Đang thi công', 'Hoàn thành'],
          required: true }
    ]);
});

// Add Service Button
document.getElementById('addServiceBtn')?.addEventListener('click', () => {
    openModal('Thêm dịch vụ', [
        { name: 'servicename', label: 'Tên dịch vụ', placeholder: 'Nhập tên dịch vụ', required: true },
        { name: 'price', label: 'Giá tiêu chuẩn', placeholder: 'Nhập giá (vd: 250000)', required: true },
        { name: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Nhập mô tả dịch vụ', required: true }
    ]);
});

// Form Submit
modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(modalForm);
    const data = Object.fromEntries(formData);
    const currentPage = document.querySelector('.page.active').id;
    
    try {
        let endpoint = '';
        let method = 'POST';
        
        if (currentPage === 'customers') {
            endpoint = '/customers';
            await AdminAPI.post(endpoint, data);
            loadCustomers();
        } else if (currentPage === 'projects') {
            endpoint = '/projects';
            await AdminAPI.post(endpoint, data);
            loadProjects();
        } else if (currentPage === 'services') {
            endpoint = '/services';
            await AdminAPI.post(endpoint, data);
            loadServices();
        }
        
        alert('Lưu thành công!');
        closeModal();
    } catch (error) {
        alert('Có lỗi xảy ra: ' + error.message);
    }
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // Search in current table if visible
        const activeTable = document.querySelector('.page.active .data-table');
        if (activeTable) {
            const rows = activeTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        }
    });
}

// Settings Form Submit
document.querySelectorAll('.settings-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            console.log('Settings:', data);
            alert('Cập nhật cài đặt thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra: ' + error.message);
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Panel Ready');
    loadDashboard();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Mobile Responsive
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

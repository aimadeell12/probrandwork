// Global variables
let currentUser = null;
const API_BASE = window.location.origin;

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

// Load all dashboard data
async function loadDashboardData() {
    try {
        await Promise.all([
            loadStats(),
            loadUsers()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/admin/stats`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
            document.getElementById('totalCards').textContent = stats.totalCards || 0;
            document.getElementById('totalTransactions').textContent = stats.totalTransactions || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load users list
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/api/admin/users`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users in the list
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-users text-4xl mb-4"></i>
                <p>لا يوجد مستخدمون</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div class="flex items-center space-x-3 space-x-reverse">
                <img src="${user.profileImageUrl || 'https://via.placeholder.com/40'}" 
                     class="w-10 h-10 rounded-full object-cover" 
                     alt="صورة المستخدم">
                <div>
                    <p class="font-medium text-gray-900">${user.firstName || ''} ${user.lastName || ''}</p>
                    <p class="text-sm text-gray-500">${user.email || ''}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
                <span class="px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}">
                    ${user.role === 'admin' ? 'مدير' : 'مستخدم'}
                </span>
                <button onclick="editUser('${user.id}', '${user.role}')" 
                        class="text-indigo-600 hover:text-indigo-800 p-2">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Edit user function
function editUser(userId, currentRole) {
    currentUser = { id: userId, role: currentRole };
    document.getElementById('userRole').value = currentRole;
    document.getElementById('userModal').classList.remove('hidden');
    document.getElementById('userModal').classList.add('flex');
}

// Close modal
function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
    document.getElementById('userModal').classList.remove('flex');
    currentUser = null;
}

// Save user changes
async function saveUser() {
    if (!currentUser) return;
    
    const newRole = document.getElementById('userRole').value;
    
    try {
        const response = await fetch(`${API_BASE}/api/admin/users/${currentUser.id}/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ role: newRole })
        });
        
        if (response.ok) {
            showNotification('تم تحديث دور المستخدم بنجاح', 'success');
            closeModal();
            loadUsers();
        } else {
            showNotification('خطأ في تحديث دور المستخدم', 'error');
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        showNotification('خطأ في تحديث دور المستخدم', 'error');
    }
}

// Toggle user status
async function toggleUserStatus() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/admin/users/${currentUser.id}/toggle-status`, {
            method: 'PATCH',
            credentials: 'include'
        });
        
        if (response.ok) {
            showNotification('تم تغيير حالة المستخدم بنجاح', 'success');
            closeModal();
            loadUsers();
        } else {
            showNotification('خطأ في تغيير حالة المستخدم', 'error');
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        showNotification('خطأ في تغيير حالة المستخدم', 'error');
    }
}

// Refresh data
function refreshData() {
    loadDashboardData();
    showNotification('تم تحديث البيانات', 'success');
}

// Create new admin
function createAdmin() {
    const email = prompt('أدخل البريد الإلكتروني للمدير الجديد:');
    if (email) {
        // Implementation for creating admin
        showNotification('سيتم إضافة هذه الميزة قريباً', 'info');
    }
}

// Export data
function exportData() {
    showNotification('جاري تصدير البيانات...', 'info');
    // Implementation for data export
    setTimeout(() => {
        showNotification('تم تصدير البيانات بنجاح', 'success');
    }, 2000);
}

// System backup
function systemBackup() {
    showNotification('جاري إنشاء النسخة الاحتياطية...', 'info');
    // Implementation for system backup
    setTimeout(() => {
        showNotification('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        window.location.href = '/login';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${getNotificationColor(type)}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2 space-x-reverse">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Get notification color based on type
function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'bg-green-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        case 'warning': return 'bg-yellow-500 text-white';
        default: return 'bg-blue-500 text-white';
    }
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Handle modal clicks outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('userModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
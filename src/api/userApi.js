import { MOCK_USERS, MOCK_ROLES, MOCK_RESPONSIBILITIES } from '../data/mockData';

const API_BASE_URL = 'http://13.210.33.250';
const USE_MOCK = true; // ✅ Set to false when deploying to Netlify

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage
let mockUsers = [...MOCK_USERS];

// ==================== FETCH USERS ====================
export const fetchUsers = async (status = null) => {
    if (USE_MOCK) {
        await delay(500);
        let filtered = [...mockUsers];
        if (status !== null) {
            filtered = filtered.filter(u => u.status === (status === 1));
        }
        return { status: true, data: filtered };
    }

    // Real API
    const token = localStorage.getItem('token');
    const url = status !== null ? `${API_BASE_URL}/user?status=${status}` : `${API_BASE_URL}/user`;
    
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        }
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
};

// ==================== ADD USER ====================
export const addUser = async (userData) => {
    if (USE_MOCK) {
        await delay(800);
        const newUser = {
            id: Math.max(...mockUsers.map(u => u.id)) + 1,
            first_name: userData.name,
            last_name: null,
            title: userData.title || null,
            initials: userData.initials || null,
            role_type: userData.role,
            email: userData.email,
            phone: userData.phone || null,
            profile_image: userData.user_picture || null,
            status: true,
            profile_image_url: userData.user_picture || `https://ui-avatars.com/api/?name=${userData.name}`,
            role: MOCK_ROLES.find(r => r.id === parseInt(userData.role)) || { id: 5, title: "User" }
        };
        mockUsers.push(newUser);
        return { status: true, message: 'Details saved successfully.' };
    }

    // Real API
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        if (userData[key]) formData.append(key, userData[key]);
    });

    const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        },
        body: formData
    });

    if (!response.ok) throw new Error('Failed to add user');
    return await response.json();
};

// ==================== UPDATE USER ====================
export const updateUser = async (id, userData) => {
    if (USE_MOCK) {
        await delay(800);
        const index = mockUsers.findIndex(u => u.id === id);
        if (index !== -1) {
            mockUsers[index] = {
                ...mockUsers[index],
                first_name: userData.name,
                title: userData.title || mockUsers[index].title,
                initials: userData.initials || mockUsers[index].initials,
                email: userData.email,
                phone: userData.phone || mockUsers[index].phone,
                role_type: userData.role,
                profile_image: userData.user_picture || mockUsers[index].profile_image,
                profile_image_url: userData.user_picture || mockUsers[index].profile_image_url,
                role: MOCK_ROLES.find(r => r.id === parseInt(userData.role)) || mockUsers[index].role
            };
        }
        return { status: true, message: 'Details updated successfully.' };
    }

    // Real API
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        if (userData[key]) formData.append(key, userData[key]);
    });
    formData.append('_method', 'put');

    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        },
        body: formData
    });

    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
};

// ==================== DELETE USER ====================
export const deleteUser = async (id) => {
    if (USE_MOCK) {
        await delay(500);
        mockUsers = mockUsers.filter(u => u.id !== id);
        return { status: true, message: 'Successfully deleted.' };
    }

    // Real API
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        }
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
};

// ==================== CHANGE STATUS ====================
export const changeUserStatus = async (id, status) => {
    if (USE_MOCK) {
        // No delay for instant status change
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            user.status = status === 1;
        }
        return { status: true, message: 'Status changed successfully' };
    }

    // Real API
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('status', status);

    const response = await fetch(`${API_BASE_URL}/user/${id}/status`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        },
        body: formData
    });

    if (!response.ok) throw new Error('Failed to change status');
    return await response.json();
};

// ==================== GET SINGLE USER ====================
export const getUser = async (id) => {
    if (USE_MOCK) {
        await delay(300);
        const user = mockUsers.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        return { status: true, data: user };
    }

    // Real API
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        }
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
};

// ==================== GET ROLES ====================
export const getRoles = async () => {
    if (USE_MOCK) {
        await delay(300);
        return { status: true, data: { owner: 2, admin: 3, other_roles: MOCK_ROLES.filter(r => r.id > 3) } };
    }

    // Real API
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('type', '1');

    const response = await fetch(`${API_BASE_URL}/role/dropdown`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        },
        body: formData
    });

    if (!response.ok) throw new Error('Failed to fetch roles');
    return await response.json();
};

// ==================== GET RESPONSIBILITIES ====================
export const getResponsibilities = async () => {
    if (USE_MOCK) {
        await delay(300);
        return MOCK_RESPONSIBILITIES;
    }

    // Real API
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user/dropdown-responsibility`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'company_id': '4'
        }
    });

    if (!response.ok) throw new Error('Failed to fetch responsibilities');
    return await response.json();
};

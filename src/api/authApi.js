const API_BASE_URL = 'http://13.210.33.250';
const USE_MOCK = true; // Set to false when deploying to Netlify

// Mock login credentials
const MOCK_CREDENTIALS = {
    email: 'admin2@gmail.com',
    password: '12345678'
};

export const loginUser = async (email, password) => {
    if (USE_MOCK) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
            return {
                access_token: 'mock_token_12345',
                user: {
                    id: 1,
                    email: email,
                    name: 'Admin User'
                }
            };
        } else {
            throw new Error('Invalid email or password');
        }
    }

    // Real API
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': `application/json`
            },
            body: formData,
            mode: 'cors', 
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
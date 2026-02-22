export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
};

export const validatePhone = (phone) => {
    if (!phone) return '';
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) return 'Phone number must contain only digits';
    if (phone.length < 10 || phone.length > 15) return 'Phone number must be between 10-15 digits';
    return '';
};

export const validateRequired = (value, fieldName) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return `${fieldName} is required`;
    }
    return '';
};

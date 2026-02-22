import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addUser, updateUser, getUser, getRoles, getResponsibilities } from '../api/userApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ImageUpload from '../components/user/ImageUpload';
import Toast from '../components/common/Toast';
import { validateEmail, validatePhone, validateRequired } from '../utlis/validation';
import { ArrowLeft } from 'lucide-react';

const UserFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [toast, setToast] = useState(null);
    const [roles, setRoles] = useState([]);
    const [responsibilities, setResponsibilities] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        title: '',
        initials: '',
        user_picture: null,
        responsibility: []
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        loadDropdowns();
        if (isEditMode) {
            loadUserData();
        }
    }, [id]);

    const loadDropdowns = async () => {
        try {
            const [rolesData, responsibilitiesData] = await Promise.all([
                getRoles(),
                getResponsibilities()
            ]);
            
            const allRoles = rolesData.data.other_roles || [];
            setRoles(allRoles);
            setResponsibilities(responsibilitiesData);
        } catch (error) {
            console.error('Failed to load dropdowns:', error);
        }
    };

    const loadUserData = async () => {
        try {
            setPageLoading(true);
            const response = await getUser(parseInt(id));
            const user = response.data;
            
            setFormData({
                name: user.first_name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role_type?.toString() || '',
                title: user.title || '',
                initials: user.initials || '',
                user_picture: user.profile_image_url || null,
                responsibility: []
            });
        } catch (error) {
            console.error('Failed to load user:', error);
            setToast({ message: 'Failed to load user data', type: 'error' });
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (touched[field]) {
            validateField(field, value);
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field]);
    };

    const validateField = (field, value) => {
        let error = '';

        switch (field) {
            case 'name':
                error = validateRequired(value, 'Name');
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'phone':
                error = validatePhone(value);
                break;
            case 'role':
                error = validateRequired(value, 'Role');
                break;
            case 'responsibility':
                error = validateRequired(value, 'Responsibility');
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return error;
    };

    const validateForm = () => {
        const newErrors = {};
        newErrors.name = validateRequired(formData.name, 'Name');
        newErrors.email = validateEmail(formData.email);
        newErrors.phone = validatePhone(formData.phone);
        newErrors.role = validateRequired(formData.role, 'Role');
        newErrors.responsibility = validateRequired(formData.responsibility, 'Responsibility');

        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            role: true,
            responsibility: true
        });

        return Object.values(newErrors).every(error => !error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            if (isEditMode) {
                await updateUser(parseInt(id), formData);
                setToast({ message: 'User updated successfully!', type: 'success' });
            } else {
                await addUser(formData);
                setToast({ message: 'User added successfully!', type: 'success' });
            }

            setTimeout(() => {
                navigate('/users');
            }, 1500);
        } catch (error) {
            console.error('Failed to save user:', error);
            setToast({ message: 'Failed to save user', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleResponsibilityChange = (respId) => {
        const currentResp = formData.responsibility;
        const newResp = currentResp.includes(respId)
            ? currentResp.filter(id => id !== respId)
            : [...currentResp, respId];
        
        handleChange('responsibility', newResp);
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/users')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isEditMode ? 'Edit User' : 'Add User'}
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <ImageUpload
                                value={formData.user_picture}
                                onChange={(file) => handleChange('user_picture', file)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Name"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                error={touched.name ? errors.name : ''}
                                placeholder="Enter full name"
                            />

                            <Input
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                error={touched.email ? errors.email : ''}
                                placeholder="Enter email address"
                            />

                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                onBlur={() => handleBlur('phone')}
                                error={touched.phone ? errors.phone : ''}
                                placeholder="Enter phone number"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    onBlur={() => handleBlur('role')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.title}
                                        </option>
                                    ))}
                                </select>
                                {touched.role && errors.role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                                )}
                            </div>

                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Enter job title"
                            />

                            <Input
                                label="Initials"
                                value={formData.initials}
                                onChange={(e) => handleChange('initials', e.target.value)}
                                placeholder="Enter initials"
                                maxLength={3}
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Responsibilities <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {responsibilities.map(resp => (
                                    <label
                                        key={resp.id}
                                        className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.responsibility.includes(resp.id)}
                                            onChange={() => handleResponsibilityChange(resp.id)}
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700">{resp.title}</span>
                                    </label>
                                ))}
                            </div>
                            {touched.responsibility && errors.responsibility && (
                                <p className="text-red-500 text-sm mt-2">{errors.responsibility}</p>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/users')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                            >
                                {isEditMode ? 'Update' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default UserFormPage;

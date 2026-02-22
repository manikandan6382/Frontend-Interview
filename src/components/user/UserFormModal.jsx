import { useState, useEffect } from 'react';
import { addUser, updateUser, getUser, getRoles } from '../../api/userApi';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUpload from '../user/ImageUpload';
import Toast from '../common/Toast';
import { validateEmail, validatePhone, validateRequired } from '../../utlis/validation';
import { X } from 'lucide-react';

const DESIGNATIONS = [
    { id: 1, title: 'Designer' },
    { id: 2, title: 'Project Manager' },
    { id: 3, title: 'Production Manager' },
    { id: 4, title: 'Sales Rep' }
];

const UserFormModal = ({ isOpen, onClose, userId, onSuccess }) => {
    const isEditMode = Boolean(userId);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [toast, setToast] = useState(null);
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        title: '',
        initials: '',
        user_picture: null,
        designation: []
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (isOpen) {
            loadRoles();
            if (isEditMode) {
                loadUserData();
            } else {
                resetForm();
            }
        }
    }, [isOpen, userId]);

    const loadRoles = async () => {
        try {
            const rolesData = await getRoles();
            const allRoles = rolesData.data.other_roles || [];
            setRoles(allRoles);
        } catch (error) {
            console.error('Failed to load roles:', error);
        }
    };

    const loadUserData = async () => {
        try {
            setPageLoading(true);
            const response = await getUser(parseInt(userId));
            const user = response.data;

            setFormData({
                name: user.first_name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role_type?.toString() || '',
                title: user.title || '',
                initials: user.initials || '',
                user_picture: user.profile_image_url || null,
                designation: []
            });
        } catch (error) {
            console.error('Failed to load user:', error);
            setToast({ message: 'Failed to load user data', type: 'error' });
        } finally {
            setPageLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: '',
            title: '',
            initials: '',
            user_picture: null,
            designation: []
        });
        setErrors({});
        setTouched({});
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
            case 'designation':
                error = validateRequired(value, 'Designation');
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
        newErrors.designation = validateRequired(formData.designation, 'Designation');

        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            role: true,
            designation: true
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
                await updateUser(parseInt(userId), formData);
                setToast({ message: 'User updated successfully!', type: 'success' });
            } else {
                await addUser(formData);
                setToast({ message: 'User added successfully!', type: 'success' });
            }

            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Failed to save user:', error);
            setToast({ message: 'Failed to save user', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDesignationChange = (designationId) => {
        const currentDesignation = formData.designation;
        const newDesignation = currentDesignation.includes(designationId)
            ? currentDesignation.filter(id => id !== designationId)
            : [...currentDesignation, designationId];

        handleChange('designation', newDesignation);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditMode ? 'Edit User' : 'Add User'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {pageLoading ? (
                    <div className="p-6 text-center">
                        <div className="text-xl">Loading...</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6">
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
                                Designation <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {DESIGNATIONS.map(designation => (
                                    <label
                                        key={designation.id}
                                        className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.designation.includes(designation.id)}
                                            onChange={() => handleDesignationChange(designation.id)}
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary accent-[#8570ff]"
                                        />
                                        <span className="text-sm text-gray-700">{designation.title}</span>
                                    </label>
                                ))}
                            </div>
                            {touched.designation && errors.designation && (
                                <p className="text-red-500 text-sm mt-2">{errors.designation}</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-8">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                className={`w-full`}
                            >
                                {isEditMode ? 'Save' : 'Add New User'}
                            </Button>
                        </div>
                    </form>
                )}

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default UserFormModal;

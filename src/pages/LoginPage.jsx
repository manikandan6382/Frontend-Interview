import { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { LockKeyhole, Mail } from "lucide-react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from 'react-router-dom';
import CheckBox from "../components/common/CheckBox";
const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    function validate() {
        const newError = {}
        const emailRegex = /\S+@\S+\.\S+/
        if (!formData.email) {
            newError.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newError.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newError.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newError.password = 'Password must be at least 8 characters';
        }

        return newError
    }
    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        setErrors(prev => ({
            ...prev,
            [name]: '',
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate()
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            try {
                const data = await loginUser(formData.email, formData.password);
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/users')
            } catch (error) {
                setErrors({
                    email: error.message || 'Invalid credentials'
                })
            } finally {
                setLoading(false)
            }
        } else {
            setErrors(validationErrors)
        }
    }
    const isFormValid = formData.email && formData.password;
    return (
        <div className="min-h-screen bg-[url('/login-banner.gif')] bg-cover bg-center flex items-center justify-center">
            <div className="max-w-[450px]  text-white-2">
                <h1 className="text-5xl text-center mb-15 font-semibold">LOGO</h1>
                <div className="glass-card p-5">
                    <form className="" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-medium text-[1.5rem]">Sign in</h3>
                                <p className="text-[0.75rem]">Log in to manage your account</p>
                            </div>
                            <div className="">
                                <div className="relative mb-8">
                                    <Mail className={`absolute left-3 top-[40px] w-5 h-5`} />
                                    <Input
                                        name={'email'}
                                        label={'Email'}
                                        onChange={handleChange}
                                        type="email"
                                        value={formData.email}
                                        error={errors.email}
                                        placeholder={'Enter your email'}
                                        className={`border-white-2 bg-transparent pl-10 py-3 placeholder:text-white-2`}
                                    />
                                </div>
                                <div className="relative">
                                    <LockKeyhole className={`absolute left-3 top-[42px] w-5 h-5 text-white-2`} />
                                    <Input
                                        name={'password'}
                                        label={'Password'}
                                        onChange={handleChange}
                                        type="password"
                                        value={formData.password}
                                        error={errors.password}
                                        placeholder={'Enter your password'}
                                        className={`border-white-2 bg-transparent pl-10 py-3 placeholder:text-white-2`}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <CheckBox
                                        id="agree"
                                        label="Remember Me"
                                    />
                                    <Link to="/forgot-password" className="text-sm hover:underline">Forgot Password?</Link>
                                </div>
                            </div>
                            <Button
                                type={'submit'}
                                variant="secondary"
                                className={`w-full text-lg h-[46px]`}
                                loading={loading}
                                disabled={!isFormValid || loading}
                            >
                                Login
                            </Button >
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;
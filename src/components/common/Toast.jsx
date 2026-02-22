import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in`}>
            <Icon size={20} />
            <span>{message}</span>
            <button onClick={onClose} className="hover:opacity-80 rounded p-1">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;

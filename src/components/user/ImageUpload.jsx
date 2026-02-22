import { Upload, Trash2 } from 'lucide-react';
import { useRef } from 'react';

const ImageUpload = ({ value, onChange, error }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            onChange(file);
        }
    };

    const handleClear = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-4xl">👤</span>
                    )}
                </div>
                
                {previewUrl && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <Upload size={18} />
                <span>Upload Image</span>
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default ImageUpload;

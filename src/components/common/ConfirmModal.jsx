import Button from './Button';
import Info from '../../../public/info.svg'
const ConfirmModal = ({ isOpen, title, onConfirm, onCancel, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-scale-in flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-4 flex-col">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center">
                        <img src={Info} alt="icon" />
                    </div>
                    <h2 className="text-xl font-500 text-gray-800">{title}</h2>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        onClick={onCancel}
                        disabled={loading}
                        className={`rounded-[50rem] w-100 bg-transparent hover:bg-transparent !border-danger !text-danger border`}

                    >
                       No, Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        loading={loading}
                        className={`rounded-[50rem] w-100`}
                    >
                       Yes, Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

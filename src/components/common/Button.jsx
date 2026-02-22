const Button = ({ onClick, disabled, className, children, loading, type = "button", Icon, variant = 'primary', isSubmit }) => {
    const disableStyle = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
    const variants = {
        primary: 'bg-primary hover:bg-primary border border-primary text-white',
        secondary: 'bg-secondary hover:bg-secondary border border-secondary text-white',
        danger: 'bg-danger hover:bg-danger border border-danger text-white'
    }
    const variantsStyle = variants[variant];

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`px-4 py-2 rounded-[5px] transition-colors cursor-pointer ${variantsStyle} ${disableStyle} ${className}`}
            onClick={onClick}
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}

            {loading && (
                <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {children}
        </button>
    )
}
export default Button;
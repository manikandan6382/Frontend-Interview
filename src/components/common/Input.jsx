const Input = ({ label, type = 'text', value, onChange, error, placeholder, className, name }) => {
    return (
        <div className='mb-3'>
            <label className="mb-2 inline-block">
                {label}
            </label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 focus:outline-none focus:ring-2 border rounded-lg ${className} ${error ? 'border-danger focus:ring-danger' : 'border-gray-300 focus:ring-primary'}`}
            />
            {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
    )
}
export default Input;
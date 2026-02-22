
const CheckBox = ({ id = '', label = '', ...props }) => {
    return (
        <div className="form-check-parent">
            <input type="checkbox" id={id} className="form-check-input" />
            <label htmlFor={id} className="form-check flex items-center"
            ><span className='form-check-icon'>
                    <svg viewBox="0 0 12 10" height="10px" width="12px">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span>
                <span className='pl-3 pt-1'>{label}</span>
            </label>
        </div>
    )
}

export default CheckBox
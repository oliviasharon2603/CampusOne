const InputField = ({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  helperText,
  required,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`px-4 py-2.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow duration-200 ${
          error 
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-danger-500">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default InputField;

// Form.jsx
export const Form = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};

Form.Item = ({ label, error, children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {children}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

// Input.jsx
export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

Input.TextArea = ({ rows = 4, ...props }) => {
  return (
    <textarea
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  );
};

// TimePicker.jsx
export const TimePicker = ({ value, onChange, className = '' }) => {
  return (
    <input
      type="time"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
};

TimePicker.RangePicker = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="time"
        value={value?.[0] || ''}
        onChange={(e) => onChange?.([e.target.value, value?.[1]])}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <span className="text-gray-500">to</span>
      <input
        type="time"
        value={value?.[1] || ''}
        onChange={(e) => onChange?.([value?.[0], e.target.value])}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// DatePicker.jsx
export const DatePicker = ({ value, onChange, className = '' }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
};

// Select.jsx
export const Select = ({
  options = [],
  value,
  onChange,
  mode,
  placeholder,
  className = '',
}) => {
  if (mode === 'tags') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px]">
          {value?.map((tag, index) => (
            <Tag
              key={index}
              onRemove={() => {
                const newValue = value.filter((_, i) => i !== index);
                onChange?.(newValue);
              }}
            >
              {tag}
            </Tag>
          ))}
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 min-w-[100px] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                e.preventDefault();
                const newValue = [...(value || []), e.target.value];
                onChange?.(newValue);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Button.jsx
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Space.jsx
export const Space = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>{children}</div>
  );
};

// Tag.jsx
export const Tag = ({ children, onRemove, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default {
  Form,
  Input,
  TimePicker,
  DatePicker,
  Select,
  Button,
  Space,
  Tag,
};

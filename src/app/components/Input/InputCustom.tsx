import React from "react";
interface CustomInputProps {
  id?: string,
  label?: string,
  placeholder?: string,
  className?: string,
  name: string,
  value?: number | string,
  readOnly?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: string | undefined;
  touched?: boolean | undefined;
  type: string,
  disabled?: boolean,
}
const InputCustom: React.FC<CustomInputProps> = ({
  id,
  label,
  placeholder,
  className = "",
  name,
  onChange,
  onKeyDown,
  value,
  onBlur,
  error,
  touched,
  readOnly,
  type = "text",
  disabled,
}) => {
  // id, label, placeholder sẽ khác nhau giữa các input

  return (
    
      <div >
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        <input
          onBlur={onBlur}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type={type}
          name={name}
          readOnly={readOnly ? true : false}
          id={id}
          disabled={disabled ? true : false}
          className={`${readOnly || disabled ? "bg-gray-200" : "bg-gray-50 border"}     border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className} ${error && touched ? "border-red-500" : ""
            }`}
          placeholder={placeholder}
        />
        {error && touched ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : null}
      </div>
    

  );
};

export default InputCustom;

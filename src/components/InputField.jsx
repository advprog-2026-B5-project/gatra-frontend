const InputField = ({ label, type, placeholder, onChange, required = true }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      required={required}
      className="w-full bg-dark-sky-600 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
      onChange={onChange}
    />
  </div>
);
export default InputField;
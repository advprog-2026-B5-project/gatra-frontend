const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg",
    secondary: "bg-lilac-sky-700 hover:bg-[#6A74A0] text-white",
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
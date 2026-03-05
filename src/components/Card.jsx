const Card = ({ children, title, className = "" }) => {
  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className={`bg-dark-sky-800/80 backdrop-blur-md p-10 rounded-3xl w-full max-w-md ${className}`}>
        {title && (
          <h2 className="font-display text-3xl font-bold text-center mb-8 text-white">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
import logoFull from '../assets/logo-gatra-full.svg';
import logoIcon from '../assets/logo-gatra-icon.svg';

const Logo = ({ variant = 'full', className = 'h-10' }) => {
  const src = variant === 'icon' ? logoIcon : logoFull;

  return (
    <img 
      src={src} 
      alt="Gatra Logo" 
      className={`${className} w-auto object-contain`} 
    />
  );
};

export default Logo;
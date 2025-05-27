import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  className?: string;
  src_logo?: string;
}

const Logo: React.FC<LogoProps> = ({ className, src_logo }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="my-4">
        <img src={src_logo} width={'200px'} />
      </div>
    </div>
  );
};

export default Logo;
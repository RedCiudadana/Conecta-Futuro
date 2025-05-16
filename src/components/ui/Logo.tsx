import React from 'react';
import { BookOpen } from 'lucide-react';
import LogoRedNegro from '../../assets/logorednegro.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="my-4">
        <img src={LogoRedNegro} />
      </div>
    </div>
  );
};

export default Logo;
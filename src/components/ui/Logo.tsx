import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-primary-600 text-white p-2 rounded-md">
        <BookOpen size={24} />
      </div>
    </div>
  );
};

export default Logo;
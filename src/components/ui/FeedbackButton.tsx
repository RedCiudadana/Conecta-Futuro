import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeedbackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/contact')}
      className="fixed right-4 top-1/2 -translate-y-1/2 bg-black2 text-white p-3 rounded-l-lg shadow-lg transition-colors group z-50"
    >
      <MessageSquare className="w-6 h-6" />
      <span className="absolute right-full top-1/2 -translate-y-1/2 bg-black2 text-white py-2 px-4 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ayúdanos a mejorar
      </span>
    </button>
  );
};

export default FeedbackButton;

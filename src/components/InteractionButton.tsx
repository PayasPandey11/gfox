import { FC } from 'react';

interface InteractionButtonProps {
  id: string;
  text: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  isActive: boolean;
  onClick: () => void;
}

const InteractionButton: FC<InteractionButtonProps> = ({
  id,
  text,
  position,
  isActive,
  onClick,
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        position: 'fixed',
        ...position, // Spread the position object to apply styles
      }}
      className={`
        w-48 p-3 rounded-lg text-white transition-all duration-300 
        ${isActive ? 'bg-blue-700 scale-105' : 'bg-blue-500 hover:bg-blue-600'}
      `}
    >
      {text}
    </button>
  );
};

export default InteractionButton;
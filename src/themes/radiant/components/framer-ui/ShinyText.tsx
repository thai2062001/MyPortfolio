import * as React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 40,
}) => {
  // Use CSS custom property for dynamic speed while enjoying CSS performance
  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(120deg, ${color} 40%, ${shineColor} 50%, ${color} 60%)`,
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    // @ts-ignore
    '--shiny-speed': `${speed}s`,
  };

  return (
    <span 
      className={`shiny-text ${!disabled ? 'shiny-text-animated' : ''} ${className}`} 
      style={style}
    >
      {text}
    </span>
  );
};

export default ShinyText;

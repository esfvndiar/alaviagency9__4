import React, { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animation?: 'words' | 'chars' | 'lines';
  staggerDelay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '',
  animation = 'words',
  staggerDelay = 0.05
}) => {
  const [visible, setVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = textRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const renderWords = () => {
    const words = text.split(' ');
    
    return (
      <div className="flex flex-wrap">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="mr-1.5 mb-1 overflow-hidden">
            <div
              className="transition-all duration-500"
              style={{
                transform: visible ? 'translateY(0)' : 'translateY(100%)',
                opacity: visible ? 1 : 0,
                transitionDelay: `${wordIndex * (staggerDelay * 1000)}ms`,
              }}
            >
              {word}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChars = () => {
    const chars = text.split('');
    
    return (
      <div className="flex flex-wrap">
        {chars.map((char, charIndex) => (
          <div 
            key={charIndex} 
            className="overflow-hidden"
            style={{ 
              height: char === ' ' ? 'auto' : undefined,
              width: char === ' ' ? '0.25em' : 'auto',
            }}
          >
            <div
              className="transition-all duration-300 inline-block"
              style={{
                transform: visible 
                  ? 'translateY(0) rotate(0deg)' 
                  : 'translateY(100%) rotate(10deg)',
                opacity: visible ? 1 : 0,
                transitionDelay: `${charIndex * (staggerDelay * 1000)}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLines = () => {
    // Split by periods, commas, or line breaks to create "lines"
    const lines = text.split(/[.,\n]+/).filter(Boolean);
    
    return (
      <div className="flex flex-col">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="overflow-hidden mb-2">
            <div
              className="transition-all duration-700"
              style={{
                transform: visible ? 'translateX(0)' : 'translateX(-5%)',
                opacity: visible ? 1 : 0,
                transitionDelay: `${lineIndex * (staggerDelay * 2000)}ms`,
              }}
            >
              {line}{lineIndex < lines.length - 1 ? '.' : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAnimation = () => {
    switch (animation) {
      case 'words':
        return renderWords();
      case 'chars':
        return renderChars();
      case 'lines':
        return renderLines();
      default:
        return renderWords();
    }
  };

  return (
    <div ref={textRef} className={`overflow-hidden ${className}`}>
      {renderAnimation()}
    </div>
  );
};

export default AnimatedText;

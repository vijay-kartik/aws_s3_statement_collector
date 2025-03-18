import { useEffect, useRef } from 'react';

interface InstagramReelProps {
  embedHtml: string;
  className?: string;
}

/**
 * Component for displaying an embedded Instagram reel
 */
export default function InstagramReel({ embedHtml, className = '' }: InstagramReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Instagram embed script and process embeds when the component mounts
  useEffect(() => {
    // Add Instagram embed script if it doesn't exist
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // If script already exists, process this embed
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    }

    // Set up event listener for when Instagram script loads
    const handleScriptLoad = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    window.addEventListener('load', handleScriptLoad);

    return () => {
      window.removeEventListener('load', handleScriptLoad);
    };
  }, [embedHtml]);

  return (
    <div 
      ref={containerRef}
      className={`instagram-reel-container ${className}`}
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
}

// Add type declaration for the Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
} 
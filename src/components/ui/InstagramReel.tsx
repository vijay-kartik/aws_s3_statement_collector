import { useEffect, useRef } from 'react';

interface InstagramReelProps {
  embedHtml: string;
  className?: string;
  maxHeight?: number; // Option to set max height
  borderRadius?: number; // Option to set border radius
}

/**
 * Component for displaying an embedded Instagram reel with constrained height
 */
export default function InstagramReel({ 
  embedHtml, 
  className = '',
  maxHeight = 450, // Default max height in pixels
  borderRadius = 12 // Default border radius in pixels
}: InstagramReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Process the embedHtml to add maxHeight constraint and rounded corners
  const processedHtml = embedHtml.replace(
    'class="instagram-media"',
    `class="instagram-media" style="max-height: ${maxHeight}px; overflow-y: hidden; border-radius: ${borderRadius}px !important;"`
  );

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

    // Add additional styling to Instagram containers after they're processed
    const styleEmbeds = () => {
      if (containerRef.current) {
        // Find all Instagram iframe containers after they've been processed
        const iframes = containerRef.current.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          // Add height constraint and rounded corners to iframes
          iframe.style.maxHeight = `${maxHeight}px`;
          iframe.style.borderRadius = `${borderRadius}px`;
        });

        // Also find any blockquote and div elements that need styling
        const instagramElements = containerRef.current.querySelectorAll('.instagram-media, .instagram-media-rendered');
        instagramElements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.borderRadius = `${borderRadius}px`;
            element.style.overflow = 'hidden';
          }
        });
      }
    };

    // Add a mutation observer to detect when Instagram processes the embed
    const observer = new MutationObserver(styleEmbeds);
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true 
      });
    }

    // Style embeds on initial load too
    setTimeout(styleEmbeds, 1000);
    
    return () => {
      window.removeEventListener('load', handleScriptLoad);
      observer.disconnect();
    };
  }, [embedHtml, maxHeight, borderRadius]);

  return (
    <div 
      ref={containerRef}
      className={`instagram-reel-container relative overflow-hidden ${className}`}
      style={{ 
        maxHeight: `${maxHeight}px`,
        borderRadius: `${borderRadius}px` 
      }}
    >
      <div 
        className="instagram-content rounded-lg overflow-hidden" 
        dangerouslySetInnerHTML={{ __html: processedHtml }} 
      />
      {/* Optional overlay at the bottom to indicate there's more content */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg"></div>
    </div>
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
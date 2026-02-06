import React, { useState, useRef } from 'react';

const MemoryCard = ({ memory }) => {
  const { guest_name, message, type, url, created_at } = memory;
  const guestName = guest_name || 'Anonymous';
  const timestamp = created_at;
  
  console.log('🖼️ Rendering MemoryCard:', {
    guestName,
    url,
    type,
    message: message.substring(0, 20) + '...'
  });
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();

  // Intersection Observer for lazy loading
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current || audioRef.current || videoRef.current) {
      const element = type === 'image' ? imgRef.current : type === 'audio' ? audioRef.current : videoRef.current;
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [type]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleAudioLoad = () => {
    setAudioLoaded(true);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {type === 'image' && url && (
        <div className="aspect-w-16 aspect-h-12 bg-gray-100 relative">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-2 sm:p-4">
                <div className="text-red-500 text-xs sm:text-sm mb-1 sm:mb-2">❌ Image Failed to Load</div>
                <div className="text-gray-600 text-xs mb-1 sm:mb-2">URL: {url}</div>
                <div className="text-gray-600 text-xs">Please try refreshing the page</div>
              </div>
            </div>
          )}
          <img 
            ref={imgRef}
            src={isInView ? url : undefined}
            data-src={url}
            alt={`Memory from ${guestName}`}
            className={`w-full h-32 sm:h-48 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={(e) => {
              console.error('🖼️ Image load error:', {
                url,
                error: e,
                guestName
              });
              setImageError(true);
            }}
          />
        </div>
      )}
      
      {type === 'audio' && url && (
        <div className="p-3 sm:p-4 bg-gray-50">
          {!audioLoaded && (
            <div className="flex items-center justify-center mb-2">
              <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
            </div>
          )}
          <audio 
            ref={audioRef}
            controls 
            className="w-full"
            preload="metadata"
            onLoadedData={handleAudioLoad}
            onError={() => console.log('Audio loading error for:', url)}
          >
            {isInView && <source src={url} type="audio/wav" />}
            {isInView && <source src={url} type="audio/mpeg" />}
            {isInView && <source src={url} type="audio/mp3" />}
            {isInView && <source src={url} type="audio/webm" />}
            {isInView && <source src={url} type="audio/webm;codecs=opus" />}
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      {type === 'video' && url && (
        <div className="aspect-w-16 aspect-h-12 bg-gray-100 relative">
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          <video 
            ref={videoRef}
            src={isInView ? url : undefined}
            data-src={url}
            className={`w-full h-32 sm:h-48 object-cover transition-opacity duration-300 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            controls
            preload="metadata"
            onLoadStart={() => {
              console.log('🎥 Video loading started:', url);
              // Set a timeout to handle cases where video doesn't load properly
              setTimeout(() => {
                if (!videoLoaded) {
                  console.log('🎥 Video load timeout, showing video anyway');
                  setVideoLoaded(true);
                }
              }, 3000);
            }}
            onLoadedData={() => {
              console.log('🎥 Video loaded data:', url);
              handleVideoLoad();
            }}
            onCanPlay={() => {
              console.log('🎥 Video can play:', url);
              handleVideoLoad();
            }}
            onError={(e) => {
              console.error('🎥 Video load error:', {
                url,
                error: e,
                guestName
              });
              // Show video even on error so user can see controls
              setVideoLoaded(true);
            }}
          >
            Your browser does not support the video element.
          </video>
        </div>
      )}
      
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{guestName}</h3>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-2">
            {timestamp ? new Date(timestamp).toLocaleDateString() : 'Today'}
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">{message}</p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            {type === 'image' ? '📷 Photo' : type === 'video' ? '🎥 Video' : '🎵 Audio'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;

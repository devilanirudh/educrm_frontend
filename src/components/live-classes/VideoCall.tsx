import React, { useEffect, useRef } from 'react';

const VideoCall: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // This is where you would integrate your WebRTC solution.
    // For now, we'll just use the webcam.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    }
  }, []);

  return (
    <div className="w-full h-full bg-black">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full" />
    </div>
  );
};

export default VideoCall;
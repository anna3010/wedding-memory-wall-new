import React, { useState, useRef, useEffect } from 'react';
import { memoriesApi } from '../lib/supabase';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    message: '',
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = [
      // Image formats
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      // Audio formats
      'audio/mpeg', 
      'audio/mp3',
      'audio/wav', 
      'audio/ogg', 
      'audio/m4a',
      'audio/webm', // Add support for recorded audio
      'audio/webm;codecs=opus', // Chrome recording format
      // Video formats
      'video/mp4',
      'video/webm',
      'video/quicktime', // .mov files
      'video/x-msvideo' // .avi files
    ];
    const maxSize = 15 * 1024 * 1024; // 15MB for videos (larger than images/audio)
    
    if (!validTypes.includes(file.type)) {
      return 'Please upload an image (JPG, PNG, GIF, WebP), audio file (MP3, WAV, OGG, M4A, WebM), or video file (MP4, WebM, MOV, AVI)';
    }
    
    // Larger size limit for video files
    const fileSizeLimit = file.type.startsWith('video/') ? maxSize : 10 * 1024 * 1024; // 10MB for images/audio
    
    if (file.size > fileSizeLimit) {
      const limitMB = file.type.startsWith('video/') ? '15MB' : '10MB';
      return `File size must be less than ${limitMB}`;
    }
    
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'files') {
      const validationErrors = {};
      const newFiles = Array.from(files);
      newFiles.forEach((file, index) => {
        const validationError = validateFile(file);
        if (validationError) {
          validationErrors[`file${index}`] = validationError;
        }
      });
      
      setErrors(prev => ({
        ...prev,
        ...validationErrors
      }));
      
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles],
        type: newFiles.length > 0 && newFiles[0].type.startsWith('audio/') ? 'audio' : 
              newFiles[0].type.startsWith('video/') ? 'video' : 'image'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Name is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (!formData.files || formData.files.length === 0) {
      newErrors.file = 'Please select at least one file';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setErrors({});

    try {
      const uploadedMemories = [];
      
      // Upload each file separately
      for (const file of formData.files) {
        const fileUrl = await memoriesApi.uploadMemory(
          file,
          formData.guestName,
          formData.message
        );
        
        uploadedMemories.push({
          file_url: fileUrl,
          file_type: file.type.startsWith('audio') ? 'audio' : 'image',
          guest_name: formData.guestName,
          message: formData.message,
          created_at: new Date().toISOString()
        });
      }
      
      // Save to session storage for gallery
      const currentMemories = JSON.parse(sessionStorage.getItem('weddingMemories') || '[]');
      const updatedMemories = [...uploadedMemories, ...currentMemories];
      
      console.log('💾 Saving to session storage:', {
        currentCount: currentMemories.length,
        uploadedMemories: uploadedMemories,
        updatedCount: updatedMemories.length
      });
      
      sessionStorage.setItem('weddingMemories', JSON.stringify(updatedMemories));
      
      setSubmitMessage(`${uploadedMemories.length} memory(ies) uploaded successfully! 🎉`);
      setFormData({ guestName: '', message: '', files: [] });
      document.getElementById('files').value = '';
      
    } catch (error) {
      setSubmitMessage('Sorry, something went wrong. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.guestName.trim() && formData.message.trim() && formData.files && formData.files.length > 0 && !Object.values(errors).some(error => error);

  // Delete file function
  const deleteFile = (indexToDelete) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToDelete)
    }));
    
    // Clear file-related errors when deleting files
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.file;
      // Remove specific file errors
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('file')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      // Check if HTTPS or localhost (for development)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isSecure = window.location.protocol === 'https:' || isLocalhost;
      
      if (!isSecure) {
        alert('Audio recording requires HTTPS in production. For development, use localhost or deploy to HTTPS.');
        return;
      }

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Audio recording is not supported on this device/browser. Please try a modern browser like Chrome, Firefox, or Safari.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: mimeType });
        
        setFormData(prev => ({
          ...prev,
          files: [...prev.files, audioFile]
        }));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      
      if (error.name === 'NotAllowedError') {
        alert('Microphone access was denied. Please allow microphone permissions in your browser settings and try again.\n\nOn mobile: Look for the permission prompt or check browser settings.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError') {
        alert('Microphone is already in use by another application. Please close other apps using the microphone and try again.');
      } else {
        alert('Could not access microphone. Please ensure you have granted microphone permissions and try using a different browser if the issue persists.');
      }
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  
  // Camera functions
  const startCamera = async () => {
    try {
      console.log('📷 Requesting camera access...');
      
      // Check if HTTPS or localhost (for development)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isSecure = window.location.protocol === 'https:' || isLocalhost;
      
      if (!isSecure) {
        alert('Camera access requires HTTPS in production. For development, use localhost or deploy to HTTPS.');
        return;
      }

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not supported on this device/browser. Please try a modern browser like Chrome, Firefox, or Safari.');
        return;
      }
      
      // Stop any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      
      // Try user camera first, then environment camera
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        }
      };
      
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (userError) {
        // Try environment camera (back camera) if user camera fails
        console.log('📷 User camera failed, trying environment camera...');
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              facingMode: 'environment'
            }
          });
        } catch (envError) {
          // Try basic constraints as fallback
          console.log('📷 Environment camera failed, trying basic constraints...');
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }
      
      console.log('📷 Camera access granted, setting up stream...');
      setCameraStream(stream);
      setIsCameraOn(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('📷 Video play error:', err);
            // Try to play with user interaction
            videoRef.current.muted = true;
            videoRef.current.play().catch(playErr => {
              console.error('📷 Video play failed even with mute:', playErr);
            });
          });
        }
      }, 100);
      
    } catch (error) {
      console.error('📷 Error accessing camera:', error);
      setIsCameraOn(false);
      
      if (error.name === 'NotAllowedError') {
        alert('Camera access was denied. Please allow camera permissions in your browser settings and try again.\n\nOn mobile: Look for the permission prompt or check browser settings > Site permissions > Camera.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        alert('Camera is already in use by another application. Please close other apps using the camera and try again.');
      } else if (error.name === 'OverconstrainedError') {
        alert('Camera does not support the required settings. Please try a different device or browser.');
      } else {
        alert('Could not access camera. Please ensure you have granted camera permissions and try using a different browser if the issue persists.');
      }
    }
  };
  
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraOn(false);
    }
  };
  
  const capturePhoto = () => {
    console.log('📸 Capturing photo...');
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Check if video is ready
      if (video.readyState !== 4) { // HAVE_ENOUGH_DATA
        console.error('📸 Video not ready yet');
        alert('Camera not ready. Please wait a moment and try again.');
        return;
      }
      
      try {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const imageFile = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            console.log('📸 Photo captured:', imageFile.name, 'Size:', blob.size);
            
            setFormData(prev => ({
              ...prev,
              files: [...prev.files, imageFile]
            }));
            
            stopCamera();
            alert('Photo captured successfully! 📸');
          } else {
            console.error('📸 Failed to create blob');
            alert('Failed to capture photo. Please try again.');
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        console.error('📸 Error capturing photo:', error);
        alert('Failed to capture photo. Please try again.');
      }
    } else {
      console.error('📸 Video or canvas not available');
      alert('Camera not ready. Please try again.');
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      stopCamera();
    };
  }, []);
  
  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Share Your Memory</h2>
      
      {submitMessage && (
        <div className={`mb-4 p-3 sm:p-4 border rounded-md ${
          submitMessage.includes('successfully') 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`${submitMessage.includes('successfully') ? 'text-green-800' : 'text-red-800'} text-sm sm:text-base`}>
            {submitMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.guestName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your name"
          />
          {errors.guestName && (
            <p className="mt-1 text-xs text-red-600">{errors.guestName}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Share your wedding wishes, memories, or thoughts..."
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Media *
          </label>
          
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              id="files"
              name="files"
              multiple
              onChange={handleInputChange}
              required={formData.files.length === 0}
              accept="image/*,audio/*,video/*"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
                errors.file ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{
                fontSize: '16px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `1px solid ${errors.file ? '#ef4444' : '#d1d5db'}`,
                outline: 'none'
              }}
            />
            <label 
              htmlFor="files" 
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                margin: '0 8px',
                padding: '6px 12px'
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choose Files
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Upload files from your device - Supported formats: Images (JPG, PNG, GIF, WebP), Audio (MP3, WAV, OGG, M4A), and Videos (MP4, WebM, MOV, AVI) - Max size: 10MB for images/audio, 15MB for videos
          </p>
          {errors.file && (
            <p className="mt-1 text-xs text-red-600">{errors.file}</p>
          )}
        </div>

        {formData.files && formData.files.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                Selected {formData.files.length} file(s):
              </p>
              {formData.files.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, files: [] }));
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.file;
                      Object.keys(newErrors).forEach(key => {
                        if (key.startsWith('file')) {
                          delete newErrors[key];
                        }
                      });
                      return newErrors;
                    });
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {formData.files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.type.startsWith('audio/') ? '🎤 Audio' : file.type.startsWith('video/') ? '🎥 Video' : '📷 Image'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteFile(index)}
                    className="ml-2 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-base font-medium min-h-[48px]"
            style={{ minHeight: '48px' }}
          >
            {isSubmitting ? 'Uploading...' : 'Share Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;

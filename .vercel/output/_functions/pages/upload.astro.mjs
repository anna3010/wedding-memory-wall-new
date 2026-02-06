import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B-2LxKLH.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DUYuiAs7.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    guestName: "",
    message: "",
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  useRef([]);
  useRef(null);
  useRef(null);
  const recordingIntervalRef = useRef(null);
  const validateFile = (file) => {
    const validTypes = [
      // Image formats
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      // Audio formats
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/webm",
      // Add support for recorded audio
      "audio/webm;codecs=opus",
      // Chrome recording format
      // Video formats
      "video/mp4",
      "video/webm",
      "video/quicktime",
      // .mov files
      "video/x-msvideo"
      // .avi files
    ];
    const maxSize = 15 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      return "Please upload an image (JPG, PNG, GIF, WebP), audio file (MP3, WAV, OGG, M4A, WebM), or video file (MP4, WebM, MOV, AVI)";
    }
    const fileSizeLimit = file.type.startsWith("video/") ? maxSize : 10 * 1024 * 1024;
    if (file.size > fileSizeLimit) {
      const limitMB = file.type.startsWith("video/") ? "15MB" : "10MB";
      return `File size must be less than ${limitMB}`;
    }
    return null;
  };
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      const validationErrors = {};
      const newFiles = Array.from(files);
      newFiles.forEach((file, index) => {
        const validationError = validateFile(file);
        if (validationError) {
          validationErrors[`file${index}`] = validationError;
        }
      });
      setErrors((prev) => ({
        ...prev,
        ...validationErrors
      }));
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
        type: newFiles.length > 0 && newFiles[0].type.startsWith("audio/") ? "audio" : newFiles[0].type.startsWith("video/") ? "video" : "image"
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: ""
        }));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.guestName.trim()) {
      newErrors.guestName = "Name is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    if (!formData.files || formData.files.length === 0) {
      newErrors.file = "Please select at least one file";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage("");
    setErrors({});
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("guestName", formData.guestName);
      formDataToSend.append("message", formData.message);
      formData.files.forEach((file) => {
        formDataToSend.append("files", file);
      });
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const result = await response.json();
      if (result.success) {
        const currentMemories = JSON.parse(sessionStorage.getItem("weddingMemories") || "[]");
        const newMemories = Array.isArray(result.data) ? result.data : [result.data];
        const updatedMemories = [...newMemories, ...currentMemories];
        console.log("💾 Saving to session storage:", {
          currentCount: currentMemories.length,
          newMemories,
          updatedCount: updatedMemories.length
        });
        sessionStorage.setItem("weddingMemories", JSON.stringify(updatedMemories));
        setSubmitMessage(`${newMemories.length} memory(ies) uploaded successfully! 🎉`);
        setFormData({ guestName: "", message: "", files: [] });
      } else {
        throw new Error(result.message || "Upload failed");
      }
      document.getElementById("files").value = "";
    } catch (error) {
      setSubmitMessage("Sorry, something went wrong. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const isFormValid = formData.guestName.trim() && formData.message.trim() && formData.files && formData.files.length > 0 && !Object.values(errors).some((error) => error);
  const deleteFile = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToDelete)
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.file;
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("file")) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraOn(false);
    }
  };
  useEffect(() => {
    return () => {
      stopRecording();
      stopCamera();
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6", children: "Share Your Memory" }),
    submitMessage && /* @__PURE__ */ jsx("div", { className: `mb-4 p-3 sm:p-4 border rounded-md ${submitMessage.includes("successfully") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`, children: /* @__PURE__ */ jsx("p", { className: `${submitMessage.includes("successfully") ? "text-green-800" : "text-red-800"} text-sm sm:text-base`, children: submitMessage }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "guestName", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Name *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "guestName",
            name: "guestName",
            value: formData.guestName,
            onChange: handleInputChange,
            required: true,
            className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${errors.guestName ? "border-red-500" : "border-gray-300"}`,
            placeholder: "Enter your name"
          }
        ),
        errors.guestName && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.guestName })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Message *" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "message",
            name: "message",
            value: formData.message,
            onChange: handleInputChange,
            required: true,
            rows: 4,
            className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${errors.message ? "border-red-500" : "border-gray-300"}`,
            placeholder: "Share your wedding wishes, memories, or thoughts..."
          }
        ),
        errors.message && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Add Media *" }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            id: "files",
            name: "files",
            multiple: true,
            onChange: handleInputChange,
            required: formData.files.length === 0,
            accept: "image/*,audio/*,video/*",
            className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 ${errors.file ? "border-red-500" : "border-gray-300"}`
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Upload files from your device - Supported formats: Images (JPG, PNG, GIF, WebP), Audio (MP3, WAV, OGG, M4A), and Videos (MP4, WebM, MOV, AVI) - Max size: 10MB for images/audio, 15MB for videos" }),
        errors.file && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.file })
      ] }),
      formData.files && formData.files.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-gray-50 rounded-md", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            "Selected ",
            formData.files.length,
            " file(s):"
          ] }),
          formData.files.length > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setFormData((prev) => ({ ...prev, files: [] }));
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.file;
                  Object.keys(newErrors).forEach((key) => {
                    if (key.startsWith("file")) {
                      delete newErrors[key];
                    }
                  });
                  return newErrors;
                });
              },
              className: "text-xs text-red-600 hover:text-red-800 font-medium",
              children: "Clear All"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: formData.files.map((file, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between p-2 bg-white rounded border border-gray-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: file.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "(",
                (file.size / 1024 / 1024).toFixed(2),
                " MB)"
              ] }),
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: file.type.startsWith("audio/") ? "🎤 Audio" : file.type.startsWith("video/") ? "🎥 Video" : "📷 Image" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => deleteFile(index),
              className: "ml-2 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors",
              title: "Remove file",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: !isFormValid || isSubmitting,
          className: "w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200",
          children: isSubmitting ? "Uploading..." : "Share Memory"
        }
      ) })
    ] })
  ] });
};

const $$Upload = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Upload Memory - Wedding Memory Wall" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="text-center mb-8"> <h1 class="text-3xl font-bold text-gray-900 mb-4">Share Your Memory</h1> <p class="text-lg text-gray-600">Help us build our wedding memory wall with your photos and messages</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div class="lg:col-span-2"> ${renderComponent($$result2, "UploadForm", UploadForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/components/UploadForm.jsx", "client:component-export": "default" })} </div> <div class="lg:col-span-1"> <div class="bg-white rounded-lg shadow-md p-6 sticky top-8"> <h3 class="text-lg font-semibold text-gray-900 mb-4">Guidelines</h3> <ul class="space-y-3 text-sm text-gray-600"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span>Share photos from the ceremony, reception, or other wedding moments</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span>Record audio messages with your wedding wishes or favorite memories</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span>Keep messages heartfelt and appropriate for all guests</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span>File size should be under 10MB for best performance</span> </li> </ul> <div class="mt-6 p-4 bg-pink-50 rounded-md"> <h4 class="text-sm font-medium text-pink-900 mb-2">💝 Tip</h4> <p class="text-sm text-pink-700">
The best memories include both a photo/audio and a personal message. Share what made the wedding special to you!
</p> </div> </div> </div> </div> <div class="mt-12 text-center"> <a href="/" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to Gallery
</a> </div> </div> ` })}`;
}, "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/upload.astro", void 0);

const $$file = "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/upload.astro";
const $$url = "/upload";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Upload,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

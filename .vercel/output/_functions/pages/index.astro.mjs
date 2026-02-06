import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../chunks/astro/server_B-2LxKLH.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DUYuiAs7.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const MemoryCard = ({ memory }) => {
  const { guest_name, message, type, url, created_at } = memory;
  const guestName = guest_name || "Anonymous";
  const timestamp = created_at;
  console.log("🖼️ Rendering MemoryCard:", {
    guestName,
    url,
    type,
    message: message.substring(0, 20) + "..."
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();
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
      const element = type === "image" ? imgRef.current : type === "audio" ? audioRef.current : videoRef.current;
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300", children: [
    type === "image" && url && /* @__PURE__ */ jsxs("div", { className: "aspect-w-16 aspect-h-12 bg-gray-100 relative", children: [
      !imageLoaded && !imageError && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" }) }) }),
      imageError && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-2 sm:p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs sm:text-sm mb-1 sm:mb-2", children: "❌ Image Failed to Load" }),
        /* @__PURE__ */ jsxs("div", { className: "text-gray-600 text-xs mb-1 sm:mb-2", children: [
          "URL: ",
          url
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-600 text-xs", children: "Please try refreshing the page" })
      ] }) }),
      /* @__PURE__ */ jsx(
        "img",
        {
          ref: imgRef,
          src: isInView ? url : void 0,
          "data-src": url,
          alt: `Memory from ${guestName}`,
          className: `w-full h-32 sm:h-48 object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`,
          loading: "lazy",
          onLoad: handleImageLoad,
          onError: (e) => {
            console.error("🖼️ Image load error:", {
              url,
              error: e,
              guestName
            });
            setImageError(true);
          }
        }
      )
    ] }),
    type === "audio" && url && /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-4 bg-gray-50", children: [
      !audioLoaded && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 sm:w-6 sm:h-6 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" }) }),
      /* @__PURE__ */ jsxs(
        "audio",
        {
          ref: audioRef,
          controls: true,
          className: "w-full",
          preload: "metadata",
          onLoadedData: handleAudioLoad,
          onError: () => console.log("Audio loading error for:", url),
          children: [
            isInView && /* @__PURE__ */ jsx("source", { src: url, type: "audio/wav" }),
            isInView && /* @__PURE__ */ jsx("source", { src: url, type: "audio/mpeg" }),
            isInView && /* @__PURE__ */ jsx("source", { src: url, type: "audio/mp3" }),
            isInView && /* @__PURE__ */ jsx("source", { src: url, type: "audio/webm" }),
            isInView && /* @__PURE__ */ jsx("source", { src: url, type: "audio/webm;codecs=opus" }),
            "Your browser does not support the audio element."
          ]
        }
      )
    ] }),
    type === "video" && url && /* @__PURE__ */ jsxs("div", { className: "aspect-w-16 aspect-h-12 bg-gray-100 relative", children: [
      !videoLoaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" }) }) }),
      /* @__PURE__ */ jsx(
        "video",
        {
          ref: videoRef,
          src: isInView ? url : void 0,
          "data-src": url,
          className: `w-full h-32 sm:h-48 object-cover transition-opacity duration-300 ${videoLoaded ? "opacity-100" : "opacity-0"}`,
          controls: true,
          preload: "metadata",
          onLoadStart: () => {
            console.log("🎥 Video loading started:", url);
            setTimeout(() => {
              if (!videoLoaded) {
                console.log("🎥 Video load timeout, showing video anyway");
                setVideoLoaded(true);
              }
            }, 3e3);
          },
          onLoadedData: () => {
            console.log("🎥 Video loaded data:", url);
            handleVideoLoad();
          },
          onCanPlay: () => {
            console.log("🎥 Video can play:", url);
            handleVideoLoad();
          },
          onError: (e) => {
            console.error("🎥 Video load error:", {
              url,
              error: e,
              guestName
            });
            setVideoLoaded(true);
          },
          children: "Your browser does not support the video element."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 text-sm sm:text-base truncate", children: guestName }),
        /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-2", children: timestamp ? new Date(timestamp).toLocaleDateString() : "Today" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs sm:text-sm line-clamp-3", children: message }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800", children: type === "image" ? "📷 Photo" : type === "video" ? "🎥 Video" : "🎵 Audio" }) })
    ] })
  ] });
};

const supabaseUrl = "https://dwzcdegrrtfmvxcxgeey.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3emNkZWdycnRmbXZ4Y3hnZWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTY0MjMsImV4cCI6MjA4NTk3MjQyM30.iFPReJ0XZD9c6fTOrH4-OOwaEB1Cuo3w87CNtp_aiwg";
const supabase = createClient(supabaseUrl, supabaseAnonKey) ;
const isSupabaseAvailable = () => {
  return supabase !== null;
};
const memoriesApi = {
  // Subscribe to realtime updates
  subscribeToMemories: (callback) => {
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available for realtime updates");
      return null;
    }
    const subscription = supabase.channel("memories_changes").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "memories" },
      (payload) => {
        console.log("New memory received:", payload.new);
        callback(payload.new);
      }
    ).subscribe();
    return subscription;
  },
  // Unsubscribe from realtime updates
  unsubscribeFromMemories: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },
  // Fetch all memories
  fetchMemories: async () => {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available");
    }
    const { data, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  }
};

const MemoryGallery = () => {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  useEffect(() => {
    const savedMemories = JSON.parse(sessionStorage.getItem("weddingMemories") || "[]");
    if (savedMemories.length > 0) {
      console.log("📋 Loading saved memories from session:", savedMemories.length);
      console.log("📋 Session memories:", savedMemories);
      setMemories(savedMemories);
      setLoading(false);
      return;
    }
  }, []);
  const fetchMemories = async () => {
    try {
      setLoading(true);
      console.log("🔍 FetchMemories called, current session:", JSON.parse(sessionStorage.getItem("weddingMemories") || "[]"));
      let data;
      if (isSupabaseAvailable()) {
        data = await memoriesApi.fetchMemories();
      } else {
        const response = await fetch("/api/memories");
        if (!response.ok) {
          throw new Error("Failed to fetch memories");
        }
        const result = await response.json();
        data = result.memories || [];
      }
      console.log("🔍 Fetched data:", data);
      if (data.length > 0) {
        console.log("💾 Saving fetched data to session storage");
        sessionStorage.setItem("weddingMemories", JSON.stringify(data));
      }
      setMemories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching memories:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let filtered = memories;
    switch (activeFilter) {
      case "photo":
        filtered = memories.filter((memory) => memory.type === "image");
        break;
      case "video":
        filtered = memories.filter((memory) => memory.type === "video");
        break;
      default:
        filtered = memories;
    }
    setFilteredMemories(filtered);
  }, [memories, activeFilter]);
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const savedMemories = JSON.parse(sessionStorage.getItem("weddingMemories") || "[]");
      console.log("🔍 Poll check:", {
        savedCount: savedMemories.length,
        currentCount: memories.length,
        shouldUpdate: savedMemories.length > memories.length
      });
      if (savedMemories.length > memories.length) {
        console.log("🔄 New memories detected, refreshing...");
        setMemories(savedMemories);
      }
    }, 2e3);
    return () => {
      clearInterval(interval);
    };
  }, [memories]);
  useEffect(() => {
    const savedMemories = JSON.parse(sessionStorage.getItem("weddingMemories") || "[]");
    if (savedMemories.length === 0) {
      console.log("🔄 No session data, fetching from API...");
      fetchMemories();
    } else {
      console.log("📋 Using session data, skipping API fetch");
      setRealtimeEnabled(isSupabaseAvailable());
    }
  }, []);
  if (loading && memories.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 sm:mb-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-900 mb-2", children: "Wedding Memories" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm sm:text-base mb-2", children: "Share in the joy and celebration" }),
        realtimeEnabled && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" }),
          "Live updates enabled"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6", children: memories.map((memory) => /* @__PURE__ */ jsx(MemoryCard, { memory }, memory.id)) }),
      memories.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 sm:mt-8 text-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: fetchMemories,
          disabled: loading,
          className: "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
            loading ? "Refreshing..." : "Refresh Memories"
          ]
        }
      ) })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8", children: /* @__PURE__ */ jsx("div", { className: "text-center py-8 sm:py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-red-800 font-semibold text-sm sm:text-base mb-2", children: "Unable to load memories" }),
      /* @__PURE__ */ jsx("p", { className: "text-red-600 text-xs sm:text-sm", children: error })
    ] }) }) });
  }
  if (memories.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8", children: /* @__PURE__ */ jsx("div", { className: "text-center py-12 sm:py-20", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 sm:w-8 sm:h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-semibold text-gray-900 mb-2", children: "No memories yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm sm:text-base mb-4 sm:mb-6", children: "Be the first to share a memory from the wedding!" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/upload",
          className: "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
            "Add Your Memory"
          ]
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 sm:mb-8 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-900 mb-2", children: "Wedding Memories" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm sm:text-base mb-4", children: "Share in the joy and celebration" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleFilterChange("all"),
            className: `px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${activeFilter === "all" ? "bg-pink-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`,
            children: [
              "All (",
              memories.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleFilterChange("photo"),
            className: `px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${activeFilter === "photo" ? "bg-pink-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`,
            children: [
              "📸 Photos (",
              memories.filter((m) => m.type === "image").length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleFilterChange("video"),
            className: `px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${activeFilter === "video" ? "bg-pink-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`,
            children: [
              "🎥 Videos (",
              memories.filter((m) => m.type === "video").length,
              ")"
            ]
          }
        )
      ] }),
      realtimeEnabled && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" }),
        "Live updates enabled"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6", children: filteredMemories.map((memory) => /* @__PURE__ */ jsx(MemoryCard, { memory }, memory.id)) }),
    filteredMemories.length === 0 && memories.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 sm:py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4", children: [
        activeFilter === "photo" && "📸",
        activeFilter === "video" && "🎥"
      ] }),
      /* @__PURE__ */ jsxs("h3", { className: "text-lg sm:text-xl font-semibold text-gray-900 mb-2", children: [
        "No ",
        activeFilter === "photo" ? "photos" : "videos",
        " yet"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm sm:text-base mb-4", children: [
        "Be the first to share a ",
        activeFilter === "photo" ? "photo" : "video",
        "!"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleFilterChange("all"),
          className: "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors",
          children: "View All Memories"
        }
      )
    ] }) }),
    memories.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 sm:mt-8 text-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: fetchMemories,
        disabled: loading,
        className: "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
          loading ? "Refreshing..." : "Refresh Memories"
        ]
      }
    ) })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Wedding Memory Wall - Gallery", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden" data-astro-cid-j7pv25f6> <!-- Animated Background Effects --> <div class="fixed inset-0 pointer-events-none" data-astro-cid-j7pv25f6> <!-- Floating Hearts --> <div class="absolute top-10 left-10 text-pink-300 animate-float text-2xl opacity-60" data-astro-cid-j7pv25f6>💕</div> <div class="absolute top-20 right-20 text-purple-300 animate-float text-3xl opacity-60" style="animation-delay: 2s" data-astro-cid-j7pv25f6>💖</div> <div class="absolute bottom-20 left-20 text-pink-300 animate-float text-xl opacity-60" style="animation-delay: 4s" data-astro-cid-j7pv25f6>💗</div> <div class="absolute bottom-10 right-10 text-purple-300 animate-float text-2xl opacity-60" style="animation-delay: 6s" data-astro-cid-j7pv25f6>💝</div> <div class="absolute top-1/3 left-1/4 text-pink-200 animate-float text-2xl opacity-40" style="animation-delay: 8s" data-astro-cid-j7pv25f6>💕</div> <div class="absolute top-1/2 right-1/4 text-purple-200 animate-float text-3xl opacity-40" style="animation-delay: 10s" data-astro-cid-j7pv25f6>💖</div> <!-- Sparkle Effects --> <div class="absolute top-1/4 left-1/3 text-yellow-300 animate-sparkle text-lg opacity-80" style="animation-delay: 1s" data-astro-cid-j7pv25f6>✨</div> <div class="absolute top-3/4 right-1/3 text-yellow-300 animate-sparkle text-lg opacity-80" style="animation-delay: 3s" data-astro-cid-j7pv25f6>✨</div> <div class="absolute top-1/2 left-1/2 text-yellow-300 animate-sparkle text-lg opacity-80" style="animation-delay: 5s" data-astro-cid-j7pv25f6>✨</div> </div> <!-- Hero Section --> <div class="relative overflow-hidden" data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50" data-astro-cid-j7pv25f6></div> <div class="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12" data-astro-cid-j7pv25f6> <div class="text-center" data-astro-cid-j7pv25f6> <!-- Animated Hearts Background - Mobile Optimized --> <div class="absolute inset-0 overflow-hidden pointer-events-none" data-astro-cid-j7pv25f6> <span class="absolute top-5 left-3 text-pink-300 animate-pulse text-lg sm:text-2xl" data-astro-cid-j7pv25f6>💕</span> <span class="absolute top-10 right-3 text-purple-300 animate-pulse text-xl sm:text-3xl" style="animation-delay: 0.5s" data-astro-cid-j7pv25f6>💖</span> <span class="absolute bottom-10 left-3 text-pink-300 animate-pulse text-base sm:text-xl" style="animation-delay: 1s" data-astro-cid-j7pv25f6>💗</span> <span class="absolute bottom-5 right-3 text-purple-300 animate-pulse text-lg sm:text-2xl" style="animation-delay: 1.5s" data-astro-cid-j7pv25f6>💝</span> <!-- Additional hearts for larger screens --> <span class="hidden sm:block absolute top-1/3 left-1/4 text-pink-200 animate-pulse text-2xl" style="animation-delay: 2s" data-astro-cid-j7pv25f6>💕</span> <span class="hidden sm:block absolute top-1/2 right-1/4 text-purple-200 animate-pulse text-3xl" style="animation-delay: 2.5s" data-astro-cid-j7pv25f6>💖</span> </div> <!-- Couple Names - Mobile First --> <div class="mb-4 sm:mb-6 lg:mb-8 animate-fade-in" data-astro-cid-j7pv25f6> <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 leading-tight" data-astro-cid-j7pv25f6>
Daniel & Husna
</h1> <div class="flex items-center justify-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base lg:text-lg" data-astro-cid-j7pv25f6> <span class="text-pink-500 text-sm sm:text-base" data-astro-cid-j7pv25f6>💑</span> <span class="whitespace-nowrap" data-astro-cid-j7pv25f6>Together Forever</span> <span class="text-pink-500 text-sm sm:text-base" data-astro-cid-j7pv25f6>💑</span> </div> </div> <!-- Wedding Memory Wall Title --> <div class="mb-4 sm:mb-6 lg:mb-8 animate-fade-in" style="animation-delay: 0.2s" data-astro-cid-j7pv25f6> <h2 class="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4" data-astro-cid-j7pv25f6>
Wedding Memory Wall
</h2> <p class="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4 max-w-lg sm:max-w-2xl mx-auto leading-relaxed" data-astro-cid-j7pv25f6>
Share and cherish the beautiful memories from our special day. Every photo, video, and message tells a part of our love story.
</p> </div> <!-- Hashtag --> <div class="mb-6 sm:mb-8 lg:mb-10 animate-fade-in" style="animation-delay: 0.4s" data-astro-cid-j7pv25f6> <div class="inline-flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200" data-astro-cid-j7pv25f6> <span class="text-pink-600 font-semibold text-xs sm:text-sm lg:text-base" data-astro-cid-j7pv25f6>#HusnaHeartsDaniel</span> </div> </div> <!-- Music Player --> <div class="mb-6 sm:mb-8 lg:mb-10 animate-fade-in" style="animation-delay: 0.6s" data-astro-cid-j7pv25f6> <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-pink-200 p-4 max-w-md mx-auto shadow-sm" data-astro-cid-j7pv25f6> <div class="flex items-center justify-between mb-3" data-astro-cid-j7pv25f6> <div class="flex items-center gap-2" data-astro-cid-j7pv25f6> <span class="text-pink-500" data-astro-cid-j7pv25f6>🎵</span> <span class="text-sm font-medium text-gray-700" data-astro-cid-j7pv25f6>Wedding Music</span> </div> <div class="flex items-center gap-2" data-astro-cid-j7pv25f6> <button id="musicToggle" class="text-pink-500 hover:text-pink-600 transition-colors" title="Play/Pause" data-astro-cid-j7pv25f6> <svg id="playIcon" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-j7pv25f6> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" data-astro-cid-j7pv25f6></path> </svg> <svg id="pauseIcon" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-j7pv25f6> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" data-astro-cid-j7pv25f6></path> </svg> </button> <button id="musicStop" class="text-gray-400 hover:text-gray-600 transition-colors" title="Stop" data-astro-cid-j7pv25f6> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-j7pv25f6> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" data-astro-cid-j7pv25f6></path> </svg> </button> </div> </div> <div class="text-xs text-gray-600 text-center mb-3" data-astro-cid-j7pv25f6> <span id="songTitle" data-astro-cid-j7pv25f6>Romantic Piano - Bensound</span> </div> <!-- Progress Bar --> <div class="mb-2" data-astro-cid-j7pv25f6> <div class="flex items-center justify-between text-xs text-gray-500 mb-1" data-astro-cid-j7pv25f6> <span id="currentTime" data-astro-cid-j7pv25f6>0:00</span> <span id="duration" data-astro-cid-j7pv25f6>0:00</span> </div> <div class="w-full bg-gray-200 rounded-full h-1.5" data-astro-cid-j7pv25f6> <div id="progressBar" class="bg-pink-500 h-1.5 rounded-full transition-all duration-100" style="width: 0%" data-astro-cid-j7pv25f6></div> </div> </div> <!-- Volume Control --> <div class="flex items-center gap-2" data-astro-cid-j7pv25f6> <span class="text-xs text-gray-500" data-astro-cid-j7pv25f6>🔊</span> <input type="range" id="volumeControl" min="0" max="100" value="50" class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" data-astro-cid-j7pv25f6> <span id="volumeValue" class="text-xs text-gray-500 w-8" data-astro-cid-j7pv25f6>50%</span> </div> </div> </div> <!-- Action Buttons --> <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in" style="animation-delay: 0.8s" data-astro-cid-j7pv25f6> <a href="/upload" class="inline-flex items-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-pink-300 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg hover:confetti" data-astro-cid-j7pv25f6> <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-astro-cid-j7pv25f6></path> </svg> <span class="whitespace-nowrap" data-astro-cid-j7pv25f6>Add Your Memory</span> </a> </div> </div> </div> </div> <!-- Memory Gallery Section --> <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12" data-astro-cid-j7pv25f6> <div class="text-center mb-6 sm:mb-8 lg:mb-12" data-astro-cid-j7pv25f6> <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4" data-astro-cid-j7pv25f6>Memories Shared</h3> <div class="flex items-center justify-center flex-wrap gap-2 sm:gap-3 text-gray-600 text-xs sm:text-sm" data-astro-cid-j7pv25f6> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span class="text-pink-500" data-astro-cid-j7pv25f6>📸</span> <span data-astro-cid-j7pv25f6>Photos</span> </span> <span class="hidden sm:inline" data-astro-cid-j7pv25f6>•</span> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span class="text-purple-500" data-astro-cid-j7pv25f6>🎥</span> <span data-astro-cid-j7pv25f6>Videos</span> </span> <span class="hidden sm:inline" data-astro-cid-j7pv25f6>•</span> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span class="text-pink-500" data-astro-cid-j7pv25f6>🎤</span> <span data-astro-cid-j7pv25f6>Messages</span> </span> <span class="hidden sm:inline" data-astro-cid-j7pv25f6>•</span> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span class="text-purple-500" data-astro-cid-j7pv25f6>💕</span> <span data-astro-cid-j7pv25f6>Love</span> </span> </div> </div> ${renderComponent($$result2, "MemoryGallery", MemoryGallery, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/components/MemoryGallery.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <!-- Footer Section --> <div class="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-pink-100 to-purple-100" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 text-center" data-astro-cid-j7pv25f6> <div class="mb-3 sm:mb-4" data-astro-cid-j7pv25f6> <span class="text-2xl sm:text-3xl lg:text-4xl" data-astro-cid-j7pv25f6>💕</span> </div> <h4 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3" data-astro-cid-j7pv25f6>Thank You!</h4> <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2 sm:px-0 leading-relaxed" data-astro-cid-j7pv25f6>
For being part of our special day and sharing these precious memories.
</p> <div class="flex items-center justify-center gap-1 sm:gap-2 text-pink-600 font-semibold text-sm sm:text-base" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>💖</span> <span class="whitespace-nowrap" data-astro-cid-j7pv25f6>Daniel & Husna</span> <span data-astro-cid-j7pv25f6>💖</span> </div> <div class="mt-3 sm:mt-4" data-astro-cid-j7pv25f6> <span class="text-pink-600 font-medium text-xs sm:text-sm" data-astro-cid-j7pv25f6>#HusnaHeartsDaniel</span> </div> </div> </div> </div>  ${renderScript($$result2, "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/index.astro", void 0);

const $$file = "C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

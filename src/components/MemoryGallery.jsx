import React, { useState, useEffect } from 'react';
import MemoryCard from './MemoryCard';
import { supabase, isSupabaseAvailable, memoriesApi } from '../lib/supabase';

const MemoryGallery = () => {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Load memories from session storage on component mount
  useEffect(() => {
    const savedMemories = JSON.parse(sessionStorage.getItem('weddingMemories') || '[]');
    if (savedMemories.length > 0) {
      console.log('📋 Loading saved memories from session:', savedMemories.length);
      console.log('📋 Session memories:', savedMemories);
      setMemories(savedMemories);
      setLoading(false);
      return;
    }
  }, []);

  // Fetch memories from Supabase
  const fetchMemories = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 FetchMemories called, current session:', JSON.parse(sessionStorage.getItem('weddingMemories') || '[]'));
      
      const data = await memoriesApi.fetchMemories();
      
      console.log('🔍 Fetched data:', data);
      
      // Only save to session storage if we have new data
      if (data.length > 0) {
        console.log('💾 Saving fetched data to session storage');
        sessionStorage.setItem('weddingMemories', JSON.stringify(data));
      }
      
      setMemories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching memories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter memories based on active filter (photos and videos only)
  useEffect(() => {
    let filtered = memories;
    
    switch (activeFilter) {
      case 'photo':
        filtered = memories.filter(memory => memory.file_type === 'image');
        break;
      case 'video':
        filtered = memories.filter(memory => memory.file_type === 'video');
        break;
      default:
        filtered = memories;
    }
    
    setFilteredMemories(filtered);
  }, [memories, activeFilter]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Poll for new memories every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const savedMemories = JSON.parse(sessionStorage.getItem('weddingMemories') || '[]');
      console.log('🔍 Poll check:', {
        savedCount: savedMemories.length,
        currentCount: memories.length,
        shouldUpdate: savedMemories.length > memories.length
      });
      
      if (savedMemories.length > memories.length) {
        console.log('🔄 New memories detected, refreshing...');
        setMemories(savedMemories);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [memories]);

  // Initial fetch - only if no session data
  useEffect(() => {
    const savedMemories = JSON.parse(sessionStorage.getItem('weddingMemories') || '[]');
    if (savedMemories.length === 0) {
      console.log('🔄 No session data, fetching from API...');
      fetchMemories();
    } else {
      console.log('📋 Using session data, skipping API fetch');
      setRealtimeEnabled(isSupabaseAvailable());
    }
  }, []);

  if (loading && memories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Wedding Memories</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-2">Share in the joy and celebration</p>
          {realtimeEnabled && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live updates enabled
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>

        {memories.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center">
            <button 
              onClick={fetchMemories}
              disabled={loading}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Memories'}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center py-8 sm:py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold text-sm sm:text-base mb-2">Unable to load memories</h3>
            <p className="text-red-600 text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center py-12 sm:py-20">
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No memories yet</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Be the first to share a memory from the wedding!</p>
            <a 
              href="/upload" 
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your Memory
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Wedding Memories</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">Share in the joy and celebration</p>
        
        {/* Filter Buttons - Photos and Videos Only */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All ({memories.length})
          </button>
          <button
            onClick={() => handleFilterChange('photo')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
              activeFilter === 'photo'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            📸 Photos ({memories.filter(m => m.file_type === 'image').length})
          </button>
          <button
            onClick={() => handleFilterChange('video')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
              activeFilter === 'video'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🎥 Videos ({memories.filter(m => m.file_type === 'video').length})
          </button>
        </div>
        
        {realtimeEnabled && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live updates enabled
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredMemories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>

      {filteredMemories.length === 0 && memories.length > 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeFilter === 'photo' && '📸'}
              {activeFilter === 'video' && '🎥'}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No {activeFilter === 'photo' ? 'photos' : 'videos'} yet
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Be the first to share a {activeFilter === 'photo' ? 'photo' : 'video'}!
            </p>
            <button
              onClick={() => handleFilterChange('all')}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Memories
            </button>
          </div>
        </div>
      )}

      {memories.length > 0 && (
        <div className="mt-6 sm:mt-8 text-center">
          <button 
            onClick={fetchMemories}
            disabled={loading}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Memories'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGallery;

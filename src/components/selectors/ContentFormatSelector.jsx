import React from 'react';
import { Type, ChevronDown } from 'lucide-react';

const CONTENT_FORMATS = {
  youtube: [
    { value: 'long-form', label: 'Long-form Video' },
    { value: 'short', label: 'YouTube Short' },
    { value: 'live', label: 'Live Stream' }
  ],
  instagram: [
    { value: 'reel', label: 'Reels' },
    { value: 'feed', label: 'Feed Post' },
    { value: 'story', label: 'Story' }
  ],
  tiktok: [
    { value: 'video', label: 'Standard Video' },
    { value: 'live', label: 'LIVE Stream' }
  ],
  facebook: [
    { value: 'feed', label: 'Feed Post' },
    { value: 'reel', label: 'Reels' },
    { value: 'story', label: 'Story' }
  ]
};

const ContentFormatSelector = ({ platform, value, onChange, showDropdown, setShowDropdown }) => {
  const formats = CONTENT_FORMATS[platform] || [];
  const selectedFormat = formats.find(format => format.value === value);

  return (
    <div className="relative dropdown-container">
      <label htmlFor="content-format-selector" className="block text-sm font-semibold mb-2" style={{color: '#1f2937'}}>Content Format</label>
      <button
        id="content-format-selector"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full p-3 rounded-md text-left focus:outline-none transition-all duration-200 flex items-center justify-between"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          color: '#1f2937'
        }}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        aria-label={`Select content format for ${platform}, currently ${selectedFormat?.label || 'none selected'}`}
      >
        <div className="flex items-center">
          <Type className="h-4 w-4 mr-2" style={{color: '#4b5563'}} aria-hidden="true" />
          <span>{selectedFormat?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} style={{color: '#4b5563'}} aria-hidden="true" />
      </button>
      
      {showDropdown && (
        <div className="absolute z-[9999] w-full mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto" style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(15px)'
        }} role="listbox" aria-label="Content format options">
          {formats.map((format) => (
            <button
              key={format.value}
              onClick={() => {
                onChange(format.value);
                setShowDropdown(false);
              }}
              role="option"
              aria-selected={value === format.value}
              className="w-full text-left px-3 py-2 focus:outline-none transition-colors duration-200"
              style={{
                color: '#1f2937',
                backgroundColor: value === format.value ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                fontWeight: value === format.value ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (value !== format.value) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== format.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {format.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentFormatSelector;

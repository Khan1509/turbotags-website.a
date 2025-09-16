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
      <label htmlFor="content-format-selector" className="block text-sm font-semibold text-gray-700 mb-2">Content Format</label>
      <button
        id="content-format-selector"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full p-3 border border-gray-300 rounded-md text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-tt-medium-violet focus:border-transparent transition-all duration-200 flex items-center justify-between"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        aria-label={`Select content format for ${platform}, currently ${selectedFormat?.label || 'none selected'}`}
      >
        <div className="flex items-center">
          <Type className="h-4 w-4 text-gray-500 mr-2" aria-hidden="true" />
          <span>{selectedFormat?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      
      {showDropdown && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto" role="listbox" aria-label="Content format options">
          {formats.map((format) => (
            <button
              key={format.value}
              onClick={() => {
                onChange(format.value);
                setShowDropdown(false);
              }}
              role="option"
              aria-selected={value === format.value}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                value === format.value ? 'bg-tt-medium-violet/10 text-tt-medium-violet font-medium' : ''
              }`}
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

import React, { useState, useMemo } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const REGIONS = [
  { value: 'global', label: 'Global', flag: '🌍' },
  { value: 'usa', label: 'United States', flag: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'india', label: 'India', flag: '🇮🇳' },
  { value: 'germany', label: 'Germany', flag: '🇩🇪' },
  { value: 'france', label: 'France', flag: '🇫🇷' },
  { value: 'brazil', label: 'Brazil', flag: '🇧🇷' },
  { value: 'japan', label: 'Japan', flag: '🇯🇵' },
  { value: 'mexico', label: 'Mexico', flag: '🇲🇽' },
  { value: 'spain', label: 'Spain', flag: '🇪🇸' },
  { value: 'italy', label: 'Italy', flag: '🇮🇹' },
  { value: 'south_korea', label: 'South Korea', flag: '🇰🇷' },
  { value: 'indonesia', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'nigeria', label: 'Nigeria', flag: '🇳🇬' },
  { value: 'south_africa', label: 'South Africa', flag: '🇿🇦' },
  { value: 'uae', label: 'UAE', flag: '🇦🇪' },
  { value: 'saudi_arabia', label: 'Saudi Arabia', flag: '🇸🇦' },
  { value: 'turkey', label: 'Turkey', flag: '🇹🇷' },
  { value: 'russia', label: 'Russia', flag: '🇷🇺' },
  { value: 'netherlands', label: 'Netherlands', flag: '🇳🇱' },
  { value: 'poland', label: 'Poland', flag: '🇵🇱' },
  { value: 'argentina', label: 'Argentina', flag: '🇦🇷' },
  { value: 'colombia', label: 'Colombia', flag: '🇨🇴' },
  { value: 'philippines', label: 'Philippines', flag: '🇵🇭' },
  { value: 'egypt', label: 'Egypt', flag: '🇪🇬' },
  { value: 'thailand', label: 'Thailand', flag: '🇹🇭' },
  { value: 'vietnam', label: 'Vietnam', flag: '🇻🇳' },
];

const RegionSelector = ({ value, onChange, showDropdown, setShowDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegions = useMemo(() => {
    if (!searchTerm) return REGIONS;
    return REGIONS.filter(region =>
      region.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedRegion = REGIONS.find(region => region.value === value);

  return (
    <div className="relative dropdown-container">
      <label htmlFor="region-selector" className="block text-sm font-semibold text-gray-700 mb-2">Target Region</label>
      <button
        id="region-selector"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full p-3 border border-gray-300 rounded-md text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent transition-all duration-200 flex items-center justify-between"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        aria-label={`Select target region, currently ${selectedRegion?.label || 'none selected'}`}
      >
        <div className="flex items-center">
          <Globe className="h-4 w-4 text-gray-500 mr-2" aria-hidden="true" />
          <span className="mr-1" aria-hidden="true">{selectedRegion?.flag}</span>
          <span>{selectedRegion?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      
      {showDropdown && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#475569]"
              aria-label="Search regions by name"
            />
          </div>
          <div className="max-h-48 overflow-y-auto" role="listbox" aria-label="Region options">
            {filteredRegions.map((region) => (
              <button
                key={region.value}
                onClick={() => {
                  onChange(region.value);
                  setShowDropdown(false);
                  setSearchTerm('');
                }}
                role="option"
                aria-selected={value === region.value}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center"
              >
                <span className="mr-2" aria-hidden="true">{region.flag}</span>
                <span>{region.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;

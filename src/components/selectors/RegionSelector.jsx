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
      <label htmlFor="region-selector" className="block text-sm font-semibold mb-2" style={{color: '#1f2937'}}>Target Region</label>
      <button
        id="region-selector"
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
        aria-label={`Select target region, currently ${selectedRegion?.label || 'none selected'}`}
      >
        <div className="flex items-center">
          <Globe className="h-4 w-4 mr-2" style={{color: '#4b5563'}} aria-hidden="true" />
          <span className="mr-1" aria-hidden="true">{selectedRegion?.flag}</span>
          <span>{selectedRegion?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} style={{color: '#4b5563'}} aria-hidden="true" />
      </button>
      
      {showDropdown && (
        <div className="absolute z-[9999] w-full mt-1 rounded-md shadow-lg max-h-60 overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(15px)'
        }}>
          <div className="p-2" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
            <input
              type="text"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded text-sm focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                color: '#1f2937'
              }}
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
                className="w-full text-left px-3 py-2 focus:outline-none flex items-center transition-colors duration-200"
                style={{color: '#1f2937'}}
                onMouseEnter={(e) => {
                  if (value !== region.value) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== region.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
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

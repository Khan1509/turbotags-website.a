import React, { useState, useMemo } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { value: 'english', label: 'English', code: 'en', flag: '🇺🇸' },
  { value: 'hindi', label: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
  { value: 'spanish', label: 'Español', code: 'es', flag: '🇪🇸' },
  { value: 'french', label: 'Français', code: 'fr', flag: '🇫🇷' },
  { value: 'german', label: 'Deutsch', code: 'de', flag: '🇩🇪' },
  { value: 'tamil', label: 'தமிழ்', code: 'ta', flag: '🇮🇳' },
  { value: 'telugu', label: 'తెలుగు', code: 'te', flag: '🇮🇳' },
  { value: 'bengali', label: 'বাংলা', code: 'bn', flag: '🇮🇳' },
  { value: 'italian', label: 'Italiano', code: 'it', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Português', code: 'pt', flag: '🇵🇹' },
  { value: 'japanese', label: '日本語', code: 'ja', flag: '🇯🇵' },
  { value: 'korean', label: '한국어', code: 'ko', flag: '🇰🇷' },
  { value: 'chinese', label: '中文', code: 'zh', flag: '🇨🇳' },
  { value: 'arabic', label: 'العربية', code: 'ar', flag: '🇸🇦' },
  { value: 'russian', label: 'Русский', code: 'ru', flag: '🇷🇺' },
  { value: 'dutch', label: 'Nederlands', code: 'nl', flag: '🇳🇱' },
  { value: 'turkish', label: 'Türkçe', code: 'tr', flag: '🇹🇷' },
  { value: 'thai', label: 'ไทย', code: 'th', flag: '🇹🇭' },
  { value: 'vietnamese', label: 'Tiếng Việt', code: 'vi', flag: '🇻🇳' },
  { value: 'indonesian', label: 'Bahasa Indonesia', code: 'id', flag: '🇮🇩' },
  { value: 'polish', label: 'Polski', code: 'pl', flag: '🇵🇱' }
];

const LanguageSelector = ({ value, onChange, showDropdown, setShowDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return LANGUAGES;
    return LANGUAGES.filter(language =>
      language.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedLanguage = LANGUAGES.find(lang => lang.value === value);

  return (
    <div className="relative dropdown-container">
      <label htmlFor="language-selector" className="block text-sm font-semibold mb-2" style={{color: '#1f2937'}}>Language</label>
      <button
        id="language-selector"
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
        aria-label={`Select content language, currently ${selectedLanguage?.label || 'none selected'}`}
      >
        <div className="flex items-center">
          <Globe className="h-4 w-4 mr-2" style={{color: '#4b5563'}} aria-hidden="true" />
          <span className="mr-1" aria-hidden="true">{selectedLanguage?.flag}</span>
          <span>{selectedLanguage?.label}</span>
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
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded text-sm focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                color: '#1f2937'
              }}
              aria-label="Search languages by name"
            />
          </div>
          <div className="max-h-48 overflow-y-auto" role="listbox" aria-label="Language options">
            {filteredLanguages.map((language) => (
              <button
                key={language.value}
                onClick={() => {
                  onChange(language.value);
                  setShowDropdown(false);
                  setSearchTerm('');
                }}
                role="option"
                aria-selected={value === language.value}
                className="w-full text-left px-3 py-2 focus:outline-none flex items-center transition-colors duration-200"
                style={{color: '#1f2937'}}
                onMouseEnter={(e) => {
                  if (value !== language.value) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== language.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span className="mr-2" aria-hidden="true">{language.flag}</span>
                <span>{language.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

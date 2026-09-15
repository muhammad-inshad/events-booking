import React, { useState, useEffect, useRef } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ value, onChange }) => {
  const [searchInput, setSearchInput] = useState(value);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const provider = useRef(new OpenStreetMapProvider());

  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchInput && searchInput !== value && searchInput.length > 2) {
        setIsSearching(true);
        try {
          const results = await provider.current.search({ query: searchInput });
          setSearchResults(results.slice(0, 5));
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, value]);

  const handleSelect = (result: any) => {
    setSearchInput(result.label);
    setSearchResults([]);
    onChange(result.label);
  };

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <input
        type="text"
        name="location"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          if (e.target.value === '') {
            onChange('');
          }
        }}
        placeholder="City or region"
        className="filter-input"
        style={{ width: '100%' }}
      />
      {isSearching && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '12px', color: 'var(--user-text-muted)' }}>
          Searching...
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          backgroundColor: '#1f2937', 
          zIndex: 1000, 
          border: '1px solid #374151', 
          borderRadius: '4px', 
          maxHeight: '250px', 
          overflowY: 'auto',
          marginTop: '4px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        }}>
          {searchResults.map((res, i) => (
            <div 
              key={i} 
              onClick={() => handleSelect(res)}
              style={{ 
                padding: '12px', 
                cursor: 'pointer', 
                borderBottom: i < searchResults.length - 1 ? '1px solid #374151' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                color: '#e5e7eb',
                fontSize: '0.9rem'
              }}
            >
              <MapPin size={16} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: '1.4' }}>{res.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;

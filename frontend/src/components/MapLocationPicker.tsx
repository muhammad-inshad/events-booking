import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface MapLocationPickerProps {
  locationData: LocationData;
  onChange: (location: LocationData) => void;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({ locationData, onChange }) => {
  const [searchInput, setSearchInput] = useState(locationData.address || '');
  const [position, setPosition] = useState<[number, number] | null>(
    locationData.lat && locationData.lng ? [locationData.lat, locationData.lng] : null
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    if (locationData.address !== searchInput && !searchResults.length) {
      setSearchInput(locationData.address);
    }
  }, [locationData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    const results = await provider.search({ query: searchInput });
    setSearchResults(results);
  };

  const handleSelectResult = (result: any) => {
    const lat = result.y;
    const lng = result.x;
    setPosition([lat, lng]);
    setSearchInput(result.label);
    setSearchResults([]);
    onChange({ address: result.label, lat, lng });
  };

  // Click event on map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        // Reverse geocoding (optional, but complex without an API). We'll just save coords.
        onChange({ address: searchInput || 'Custom Map Location', lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for an address..."
          className="admin-input"
          style={{ flex: 1 }}
        />
        <button onClick={handleSearch} type="button" className="btn-primary" style={{ padding: '0 15px' }}>Search</button>
        
        {searchResults.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-lighter)', zIndex: 1000, border: '1px solid var(--border-color)', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
            {searchResults.map((res, i) => (
              <div 
                key={i} 
                onClick={() => handleSelectResult(res)}
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
              >
                {res.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <MapContainer center={position || [51.505, -0.09]} zoom={position ? 13 : 2} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {position && <Marker position={position} />}
          <MapClickHandler />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapLocationPicker;

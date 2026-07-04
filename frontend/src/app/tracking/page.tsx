'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bus, MapPin, Navigation2, Clock } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Mumbai to Goa coords
const MUMBAI = { lat: 19.0760, lng: 72.8777 };
const GOA = { lat: 15.2993, lng: 74.1240 };

export default function TrackingPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8' // Fallback for demo
  });

  const [directionsResponse, setDirectionsResponse] = useState<any>(null);
  const [busPosition, setBusPosition] = useState(MUMBAI);
  const [progress, setProgress] = useState(0);

  // Directions callback
  const directionsCallback = useCallback((response: any) => {
    if (response !== null && response.status === 'OK') {
      setDirectionsResponse(response);
    }
  }, []);

  // Simulate Bus Movement along the straight line for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.01;
        return next > 1 ? 0 : next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Interpolate lat/lng based on progress
    const lat = MUMBAI.lat + (GOA.lat - MUMBAI.lat) * progress;
    const lng = MUMBAI.lng + (GOA.lng - MUMBAI.lng) * progress;
    setBusPosition({ lat, lng });
  }, [progress]);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
  }), []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8 pt-12">
          <h1 className="text-3xl font-black text-black tracking-tight mb-2">Live Trip Tracking</h1>
          <p className="text-gray-500 font-medium">Tracking Trip ID: #MN-847291 (Mumbai to Goa)</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {/* Map Area */}
          <div className="relative h-[500px] w-full">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={busPosition}
                zoom={7}
                options={mapOptions}
              >
                {/* Request directions between Mumbai and Goa */}
                {!directionsResponse && (
                  <DirectionsService
                    options={{
                      destination: GOA,
                      origin: MUMBAI,
                      travelMode: 'DRIVING' as any
                    }}
                    callback={directionsCallback}
                  />
                )}

                {/* Render the route line */}
                {directionsResponse && (
                  <DirectionsRenderer
                    options={{
                      directions: directionsResponse,
                      suppressMarkers: true, // We will use our own markers
                      polylineOptions: {
                        strokeColor: '#000000',
                        strokeWeight: 4,
                      }
                    }}
                  />
                )}

                {/* Origin Marker */}
                <Marker position={MUMBAI} label="MUMBAI" />
                
                {/* Destination Marker */}
                <Marker position={GOA} label="GOA" />

                {/* Moving Bus Marker */}
                <Marker 
                  position={busPosition} 
                  icon={{
                    url: 'https://cdn-icons-png.flaticon.com/512/3448/3448338.png', // A bus icon URL
                    scaledSize: isLoaded ? new window.google.maps.Size(40, 40) : undefined,
                  }}
                />

              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 font-bold text-gray-500">
                Loading Google Maps...
              </div>
            )}
          </div>

          {/* Status Panel */}
          <div className="p-8 bg-white border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  <Navigation2 size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Next Stop</p>
                  <p className="font-black text-black text-lg">Pune Toll Plaza</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 md:border-l border-gray-100 md:pl-6">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Estimated Arrival</p>
                  <p className="font-black text-black text-lg">08:45 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:border-l border-gray-100 md:pl-6">
                <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Status</p>
                  <p className="font-black text-green-600 text-lg">On Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

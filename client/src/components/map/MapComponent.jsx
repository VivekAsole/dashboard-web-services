import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import coords_data from '../../../public/coords'

// Function to get marker color based on customer count
const getMarkerColor = (count) => {
    if (count > 12) return 'red';
    if (count > 9) return 'orange';
    if (count > 6) return 'pink';
    if (count > 3) return 'yellow';
    return 'green';
};

const MapComponent = ({ cityData }) => {
    const [markers, setMarkers] = useState([])

    useEffect(() => {
        if (!cityData[0].city) {
            return
        }

        const data = cityData.map(cityObj => {
            const match = coords_data.find(data => data.city === cityObj.city)
            if (match) {
                return { ...cityObj, coords: match.coords }
            } else {
                return
            }
        })
        setMarkers(data)
    }, [cityData])

    return (
        <MapContainer center={[36.153982, -95.992775]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map(({ coords, customer_count, city }) => (
                <Marker
                    key={city}
                    position={coords}
                    icon={L.divIcon({
                        className: 'custom-icon',
                        html: `<div style="background-color: ${getMarkerColor(customer_count)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid black;"></div>`,
                        iconSize: [20, 20],
                    })}
                >
                    <Popup>
                        <strong>{city}</strong><br />
                        Customers: {customer_count}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default MapComponent;

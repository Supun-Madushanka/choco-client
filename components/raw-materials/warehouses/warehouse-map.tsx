"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useRef, useState, useEffect } from "react";
import { WarehouseResponse } from "@/types/warehouse";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getIcon = (active: boolean) =>
    new L.Icon({
        iconUrl: active
            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        iconSize: [30, 30],
    });

export default function WarehouseMap({
    warehouses,
    selected,
    onSelect,
}: {
    warehouses: WarehouseResponse[];
    selected: WarehouseResponse | null;
    onSelect: (w: WarehouseResponse) => void;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                setMapKey((k) => k + 1);
            }
        };
    }, []);

    return (
        <div className="h-full w-full relative" style={{ zIndex: 0 }}>
            <MapContainer
                key={mapKey}
                center={[7.8731, 80.7718]}
                zoom={8}
                className="h-full w-full"
                ref={mapRef}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {warehouses.map((w) => (
                    <Marker
                        key={w.id}
                        position={[w.latitude, w.longitude]}
                        icon={getIcon(w.isActive)}
                        eventHandlers={{ click: () => onSelect(w) }}
                    >
                        <Popup>
                            <b className="text-text-primary">{w.name}</b>
                            <br />
                            <span className="text-text-muted">{w.location}</span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
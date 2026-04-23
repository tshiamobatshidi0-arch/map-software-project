import { MapClusterLayer, MapPopup } from "../components/ui/map"
import { useState } from "react";

interface CrimeProperties {
   id :number,
   name :string,
   creationDate :string,
}

export default function CrimeMap() {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: CrimeProperties;
  } | null>(null);

  return (
    <>
        <MapClusterLayer<CrimeProperties>
          // 2. Use your DC Gov URL here
          data={`http://localhost:8002/mapper/api/history`}
          clusterRadius={40}
          pointColor="#ff4d4d"
          onPointClick={(feature, coordinates) => {
            setSelectedPoint({
              coordinates,
              properties: feature.properties,
            });
          }}
        />

        {selectedPoint && (
          <MapPopup
            longitude={selectedPoint.coordinates[0]}
            latitude={selectedPoint.coordinates[1]}
            onClose={() => setSelectedPoint(null)}
          >
            <div className="p-2">
              {/* 3. Update the UI to show Crime details */}
              <h4 className="font-bold border-b mb-1">{selectedPoint.properties.severity}</h4>
              <p className="text-xs">Method: {selectedPoint.properties.creationDate}</p>
              <p className="text-xs text-muted-foreground">
                Location: {selectedPoint.properties.name}
                <br/>
                Vehicles Involved: {selectedPoint.properties.vehiclesInvolved}
              </p>
            </div>
          </MapPopup>
        )}
    </>
  );
}

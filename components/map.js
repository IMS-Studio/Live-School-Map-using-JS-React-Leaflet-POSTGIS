import React, { useRef, useEffect, useState } from 'react'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'

export default function MapComponent(props) {
  const leafletMap = useRef()
  const { items, activeItem, onSelectItem, onViewChange } = props
  const [markers, setMarkers] = useState({})

  useEffect(() => {
    onViewChange(getBounds())
  }, [])

  useEffect(() => {
    if (activeItem) {
      markers[activeItem.ID].openPopup()
    }
  }, [activeItem])

  useEffect(() => {
    setMarkers(
      items
        .filter(({ lat, long }) => lat && long)
        .reduce((a, item) => {
          const marker = L.marker([item.lat, item.long])
          marker.on('click', () => onSelectItem(item))
          marker.bindPopup(
            `<div>${item.SchoolName}</div>
            <div>${item.AddressStreet}</div>
            <div>${item.AddressCity}, ${item.AddressState} ${item.AddressZip}</div>`
          )
          leafletMap.current.leafletElement.addLayer(marker)
          return {
            ...a,
            [item.ID]: marker
          }
        }, {})
    )
  }, [items])

  const getBounds = () => {
    const bounds = leafletMap.current.leafletElement.getBounds()
    return [
      bounds.getEast(),
      bounds.getSouth(),
      bounds.getWest(),
      bounds.getNorth()
    ]
  }

  return (
    <div className="map-root">
      <LeafletMap
        center={[39.7118185, -104.9309452]}
        zoom={11}
        minZoom={13}
        ref={leafletMap}
        onViewportChanged={() => onViewChange(getBounds())}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* TODO: Add schools to the map */}
        {/* TODO: add click event when a school is clicked */}
        {/* TODO: Add popup on click with school info */}
      </LeafletMap>
      <style jsx>
        {`
          .map-root {
            width: 80%;
          }
          :global(.leaflet-container) {
            height: 100vh !important;
            width: 100%%;
            margin: 0 auto 0 0;
          }
        `}
      </style>
    </div>
  )
}

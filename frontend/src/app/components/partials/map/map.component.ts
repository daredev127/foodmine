import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  icon,
  LatLng,
  latLng,
  LatLngExpression,
  LatLngTuple,
  map,
  Map,
  marker,
  Marker,
  tileLayer,
  LeafletMouseEvent,
} from 'leaflet';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62];

  @ViewChild('map', { static: true })
  mapRef!: ElementRef;

  map!: Map;
  currentMarker!: Marker;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    if (this.map) return;
    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    });
  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latLng) => {
        this.map.setView(latLng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latLng);
      },
    });
  }

  setMarker(latLng: LatLngExpression) {
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latLng);
      return;
    }

    this.currentMarker = marker(latLng, {
      draggable: true,
      icon: this.MARKER_ICON,
    }).addTo(this.map);
  }
}
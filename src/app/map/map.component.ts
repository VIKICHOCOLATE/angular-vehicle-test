import { VehiclePosition } from '../models/vehiclePosition';
import { Component, SimpleChanges, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user-service/user.service';

import { VehicleMapView } from '../models/vehicleMapView';
import { Vehicle } from '../models/vehicle';

import * as _ from 'lodash';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.css' ]
})
export class MapComponent implements OnChanges {

  public lat: number;
  public lng: number;

  zoom: number = 10;

  markers: VehicleMapView[];
  currentIntervalId: any;

  @Input() user: User;
  @Input() selectedVehicle: Vehicle;
  @Output() selectedVehicleChange = new EventEmitter<Vehicle>();

  intervalDuration = 60 * 1000;

  constructor(private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {
    var userValues = changes.user;
    if (!_.isNil(userValues) && !_.isNil(userValues.currentValue)) {
        var user = <User>userValues.currentValue;

        if (!_.isNil(this.currentIntervalId)) {
            clearInterval(this.currentIntervalId);
        }
        this.currentIntervalId = setInterval(() => {
            this.updateLocations(this.user);
        }, this.intervalDuration);

        this.updateLocations(this.user);
    }

    var selectedVehicleValues = changes.selectedVehicle;
    if (!_.isNil(selectedVehicleValues) && !_.isNil(selectedVehicleValues.currentValue)) {
        var selectedVehicle = selectedVehicleValues.currentValue;

        _.forEach(this.markers, (marker) => {
            var isSelected = marker.vehicleid === selectedVehicle.vehicleid;
            marker.isOpened = isSelected;

            if (_.isNil(marker.address)){
                this.userService.getAddress(marker.lat, marker.lng).subscribe(
                    data => {
                        marker.address = !_.isNil(data) && data.length > 0 ? data[0].formatted_address : '';
                    },
                    (error) => {
                        console.log('Can not load vehicle address');
                    });
            }            

            if (isSelected) {
                this.lat = marker.lat;
                this.lng = marker.lng;
            }
        });
    }
  }

  onMarkerClick(label: string, index: number) {
    var marker = this.markers[index];
    this.userService.getAddress(marker.lat, marker.lng).subscribe(
        data => {
            marker.address = !_.isNil(data) && data.length > 0 ? data[0].formatted_address : '';
            marker.isOpened = true;
            this.selectedVehicleChange.emit(marker.vehicle);
        },
        (error) => {
            console.log('Can not load vehicle address');
        });
}

  updateLocations(user: User): void {
    this.userService.getVehicleLocations(user.userid).subscribe(
        data => {
            var locations = data;
            if (!_.isNil(locations)) {
                this.markers = _.map(locations, (location) => {
                    var vehicle = _.find(user.vehicles, (v) => {
                        return v.vehicleid === location.vehicleid;
                    });
                    return new VehicleMapView(<VehiclePosition>location, vehicle);
                });
                if (!_.isNil(this.markers) && this.markers.length > 0) {
                    this.lat = this.markers[0].lat;
                    this.lng = this.markers[0].lng;
                } else {
                  // some default values
                    this.lat = 50;
                    this.lng = 27;
                }
            }
        },
        (error) => {
          console.log('Can not load vehicle position');
        });
  }
}

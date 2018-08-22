import { Vehicle } from './vehicle';
import { VehiclePosition } from './vehiclePosition';

export class VehicleMapView {

    constructor(position: VehiclePosition, vehicle: Vehicle) {
        this.vehicleid = position.vehicleid;
        this.lat = position.lat;
        this.lng = position.lon;
        this.isOpened = false;
        this.label = position.vehicleid.toString();
        this.vehicle = vehicle;
    }

    vehicleid: number;
    lat: number;
    lng: number;
    label?: string;
    isOpened: boolean;
    address: string;
    vehicle: Vehicle;
}

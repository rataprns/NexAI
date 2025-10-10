
import { AppointmentStatus } from "@/lib/types";
import type { Location } from "@/modules/locations/domain/entities/location.entity";

export class Appointment {
  id: string;
  clientId: string;
  locationId: string;
  serviceId?: string;
  location?: Location;
  date: Date;
  status: AppointmentStatus;
  name?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    clientId: string,
    locationId: string,
    date: Date,
    status: AppointmentStatus,
    createdAt: Date,
    updatedAt: Date,
    name?: string,
    email?: string,
    location?: Location,
    serviceId?: string
  ) {
    this.id = id;
    this.clientId = clientId;
    this.locationId = locationId;
    this.serviceId = serviceId;
    this.date = date;
    this.status = status;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.location = location;
  }
}

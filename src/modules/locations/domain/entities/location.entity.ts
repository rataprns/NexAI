
export interface Availability {
    availableDays: number[];
    availableTimes: string[];
    disabledDates: (string | Date)[];
}

export class Location {
    id: string;
    name: string;
    isActive: boolean;
    availability: Availability;
    address?: string;
    phone?: string;
    serviceIds: string[];
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      name: string,
      isActive: boolean,
      availability: Availability,
      serviceIds: string[],
      createdAt: Date,
      updatedAt: Date,
      address?: string,
      phone?: string
    ) {
      this.id = id;
      this.name = name;
      this.isActive = isActive;
      this.availability = availability;
      this.address = address;
      this.phone = phone;
      this.serviceIds = serviceIds;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

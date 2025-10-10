
import dbConnect from '@/lib/db';
import { IAppointmentRepository } from '@/modules/scheduling/domain/repositories/appointment.repository';
import { Appointment } from '@/modules/scheduling/domain/entities/appointment.entity';
import { AppointmentModel, IAppointment } from '../models/appointment.model';
import { AppointmentMapper } from '@/modules/scheduling/application/mappers/appointment.mapper';
import mongoose from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';

export class MongooseAppointmentRepository implements IAppointmentRepository {

  public async create(dto: { date: Date; clientId: string; locationId: string; serviceId?: string; name: string; email: string; }): Promise<Appointment> {
    await dbConnect();
    const appointmentData: any = {
      ...dto,
      clientId: new mongoose.Types.ObjectId(dto.clientId),
      locationId: new mongoose.Types.ObjectId(dto.locationId)
    };
    if (dto.serviceId) {
      appointmentData.serviceId = new mongoose.Types.ObjectId(dto.serviceId);
    }
    const newAppointment = new AppointmentModel(appointmentData);
    const savedAppointment = await newAppointment.save();
    return AppointmentMapper.toDomain(savedAppointment);
  }

  public async findById(id: string): Promise<Appointment | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const appointment = await AppointmentModel.findById(id).populate('locationId');
    return appointment ? AppointmentMapper.toDomain(appointment) : null;
  }

  public async findByClientId(clientId: string): Promise<Appointment[]> {
    await dbConnect();
    const appointments = await AppointmentModel.find({ clientId: new mongoose.Types.ObjectId(clientId) }).populate('locationId').sort({ date: 'asc' });
    return appointments.map(doc => AppointmentMapper.toDomain(doc as IAppointment & { createdAt: Date, updatedAt: Date }));
  }

  public async findByClientIdAndDate(clientId: string, date: Date): Promise<Appointment | null> {
    await dbConnect();
    const appointment = await AppointmentModel.findOne({
      clientId: new mongoose.Types.ObjectId(clientId),
      date: date,
    }).populate('locationId');
    return appointment ? AppointmentMapper.toDomain(appointment) : null;
  }

  public async findAll(): Promise<Appointment[]> {
    await dbConnect();
    const appointments = await AppointmentModel.find({}).populate('locationId').sort({ date: 'asc' });
    return appointments.map(doc => AppointmentMapper.toDomain(doc as IAppointment & { createdAt: Date, updatedAt: Date }));
  }

  public async findByDate(date: Date, locationId?: string): Promise<Appointment[]> {
    await dbConnect();
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const query: any = {
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    };
    if (locationId) {
      query.locationId = new mongoose.Types.ObjectId(locationId);
    }

    const appointments = await AppointmentModel.find(query).populate('locationId');
    return appointments.map(doc => AppointmentMapper.toDomain(doc as IAppointment & { createdAt: Date, updatedAt: Date }));
  }
  
  public async save(appointment: Appointment): Promise<Appointment> {
    await dbConnect();
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointment.id,
      { status: appointment.status },
      { new: true }
    ).populate('locationId');
    if (!updatedAppointment) {
      throw new Error('Appointment not found for saving');
    }
    return AppointmentMapper.toDomain(updatedAppointment);
  }

  public async update(appointment: Appointment): Promise<Appointment> {
    await dbConnect();
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointment.id,
      { date: appointment.date, status: appointment.status },
      { new: true }
    ).populate('locationId');
    if (!updatedAppointment) {
        throw new Error('Appointment not found for update');
    }
    return AppointmentMapper.toDomain(updatedAppointment);
  }
}

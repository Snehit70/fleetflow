import { z } from 'zod'

const driverStatusSchema = z.enum(['ON_DUTY', 'OFF_DUTY', 'SUSPENDED'])
const vehicleStatusSchema = z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'])
const vehicleTypeSchema = z.enum(['TRUCK', 'VAN', 'BIKE'])

const trimmedString = (label: string, max = 255) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be ${max} characters or fewer`)

const optionalText = (max = 500) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer`).optional()

const optionalDate = z.coerce.date().optional()

export const loginSchema = z.object({
  email: z.string().trim().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
}).strict()

export const registerSchema = z.object({
  email: z.string().trim().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: trimmedString('Name', 100).optional(),
}).strict()

export const vehicleCreateSchema = z.object({
  name: trimmedString('Vehicle name', 100),
  licensePlate: trimmedString('License plate', 32),
  type: vehicleTypeSchema,
  maxCapacity: z.coerce.number().int('Max capacity must be a whole number').positive('Max capacity must be greater than zero'),
  odometer: z.coerce.number().int('Odometer must be a whole number').nonnegative('Odometer cannot be negative').default(0),
  region: optionalText(100),
}).strict()

export const vehicleUpdateSchema = z.object({
  name: trimmedString('Vehicle name', 100).optional(),
  licensePlate: trimmedString('License plate', 32).optional(),
  type: vehicleTypeSchema.optional(),
  maxCapacity: z.coerce.number().int('Max capacity must be a whole number').positive('Max capacity must be greater than zero').optional(),
  odometer: z.coerce.number().int('Odometer must be a whole number').nonnegative('Odometer cannot be negative').optional(),
  region: optionalText(100),
  status: vehicleStatusSchema.optional(),
}).strict().refine(body => Object.keys(body).length > 0, {
  message: 'At least one field must be provided',
})

export const driverCreateSchema = z.object({
  name: trimmedString('Name', 100),
  email: z.string().trim().email('A valid email is required'),
  phone: optionalText(32),
  licenseNumber: trimmedString('License number', 64),
  licenseExpiry: z.coerce.date(),
  licenseCategory: trimmedString('License category', 100),
  status: driverStatusSchema.default('ON_DUTY'),
  safetyScore: z.coerce.number().int('Safety score must be a whole number').min(0, 'Safety score cannot be negative').max(100, 'Safety score cannot exceed 100').default(100),
}).strict()

export const driverUpdateSchema = z.object({
  name: trimmedString('Name', 100).optional(),
  email: z.string().trim().email('A valid email is required').optional(),
  phone: optionalText(32),
  licenseNumber: trimmedString('License number', 64).optional(),
  licenseExpiry: z.coerce.date().optional(),
  licenseCategory: trimmedString('License category', 100).optional(),
  status: driverStatusSchema.optional(),
  safetyScore: z.coerce.number().int('Safety score must be a whole number').min(0, 'Safety score cannot be negative').max(100, 'Safety score cannot exceed 100').optional(),
}).strict().refine(body => Object.keys(body).length > 0, {
  message: 'At least one field must be provided',
})

export const tripCreateSchema = z.object({
  vehicleId: trimmedString('Vehicle ID', 64),
  driverId: trimmedString('Driver ID', 64),
  origin: trimmedString('Origin', 120),
  destination: trimmedString('Destination', 120),
  cargoWeight: z.coerce.number().int('Cargo weight must be a whole number').positive('Cargo weight must be greater than zero'),
  cargoDescription: optionalText(500),
}).strict()

export const tripCompleteSchema = z.object({
  endOdometer: z.coerce.number().int('End odometer must be a whole number').nonnegative('End odometer cannot be negative'),
}).strict()

export const maintenanceCreateSchema = z.object({
  vehicleId: trimmedString('Vehicle ID', 64),
  description: trimmedString('Description', 200),
  cost: z.coerce.number().positive('Cost must be greater than zero'),
  date: optionalDate,
  notes: optionalText(500),
}).strict()

export const fuelLogCreateSchema = z.object({
  vehicleId: trimmedString('Vehicle ID', 64),
  liters: z.coerce.number().positive('Liters must be greater than zero'),
  cost: z.coerce.number().positive('Cost must be greater than zero'),
  odometer: z.coerce.number().int('Odometer must be a whole number').nonnegative('Odometer cannot be negative'),
  date: optionalDate,
}).strict()

export const expenseCreateSchema = z.object({
  vehicleId: trimmedString('Vehicle ID', 64),
  category: trimmedString('Category', 100),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  description: optionalText(500),
  date: optionalDate,
}).strict()

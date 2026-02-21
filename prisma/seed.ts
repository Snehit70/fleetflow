import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../lib/generated/prisma/client'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.expense.deleteMany()
  await prisma.fuelLog.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.createMany({
    data: [
      { email: 'admin@fleetflow.com', password: hashedPassword, name: 'Admin User', role: 'MANAGER' },
      { email: 'dispatch@fleetflow.com', password: hashedPassword, name: 'Dispatch User', role: 'DISPATCHER' },
      { email: 'safety@fleetflow.com', password: hashedPassword, name: 'Safety User', role: 'SAFETY_OFFICER' },
      { email: 'finance@fleetflow.com', password: hashedPassword, name: 'Finance User', role: 'FINANCIAL_ANALYST' },
    ]
  })

  await prisma.vehicle.createMany({
    data: [
      { name: 'Van-01', licensePlate: 'GJ01AB1234', type: 'VAN', maxCapacity: 500, odometer: 25000, status: 'AVAILABLE', region: 'Ahmedabad' },
      { name: 'Van-02', licensePlate: 'GJ01CD5678', type: 'VAN', maxCapacity: 500, odometer: 18500, status: 'ON_TRIP', region: 'Ahmedabad' },
      { name: 'Truck-01', licensePlate: 'GJ05EF9012', type: 'TRUCK', maxCapacity: 2000, odometer: 45000, status: 'AVAILABLE', region: 'Surat' },
      { name: 'Truck-02', licensePlate: 'GJ05GH3456', type: 'TRUCK', maxCapacity: 2500, odometer: 32000, status: 'IN_SHOP', region: 'Surat' },
      { name: 'Bike-01', licensePlate: 'GJ01JK7890', type: 'BIKE', maxCapacity: 30, odometer: 8000, status: 'AVAILABLE', region: 'Ahmedabad' },
    ]
  })

  await prisma.driver.createMany({
    data: [
      { name: 'Alex Kumar', email: 'alex@fleetflow.com', phone: '+91 9876543210', licenseNumber: 'DL-GJ-2020-001234', licenseExpiry: new Date('2027-06-15'), licenseCategory: 'VAN', status: 'ON_DUTY', safetyScore: 95 },
      { name: 'Priya Sharma', email: 'priya@fleetflow.com', phone: '+91 9876543211', licenseNumber: 'DL-GJ-2019-005678', licenseExpiry: new Date('2026-12-31'), licenseCategory: 'VAN, TRUCK', status: 'ON_DUTY', safetyScore: 88 },
      { name: 'Raj Patel', email: 'raj@fleetflow.com', phone: '+91 9876543212', licenseNumber: 'DL-GJ-2021-009012', licenseExpiry: new Date('2026-03-10'), licenseCategory: 'TRUCK', status: 'ON_DUTY', safetyScore: 92 },
      { name: 'Sara Singh', email: 'sara@fleetflow.com', phone: '+91 9876543213', licenseNumber: 'DL-GJ-2018-003456', licenseExpiry: new Date('2026-02-15'), licenseCategory: 'VAN', status: 'OFF_DUTY', safetyScore: 85 },
      { name: 'Mike Johnson', email: 'mike@fleetflow.com', phone: '+91 9876543214', licenseNumber: 'DL-GJ-2022-007890', licenseExpiry: new Date('2027-09-20'), licenseCategory: 'BIKE', status: 'ON_DUTY', safetyScore: 98 },
    ]
  })

  const allVehicles = await prisma.vehicle.findMany()
  const allDrivers = await prisma.driver.findMany()
  
  const van01 = allVehicles.find(v => v.name === 'Van-01')!
  const van02 = allVehicles.find(v => v.name === 'Van-02')!
  const truck01 = allVehicles.find(v => v.name === 'Truck-01')!
  const truck02 = allVehicles.find(v => v.name === 'Truck-02')!
  const bike01 = allVehicles.find(v => v.name === 'Bike-01')!
  
  const alex = allDrivers.find(d => d.name === 'Alex Kumar')!
  const priya = allDrivers.find(d => d.name === 'Priya Sharma')!
  const raj = allDrivers.find(d => d.name === 'Raj Patel')!
  const mike = allDrivers.find(d => d.name === 'Mike Johnson')!

  await prisma.trip.createMany({
    data: [
      { origin: 'Ahmedabad', destination: 'Surat', cargoWeight: 450, cargoDescription: 'Electronics', status: 'DISPATCHED', vehicleId: van02.id, driverId: priya.id, startOdometer: 18000, startedAt: new Date('2026-02-21T09:00:00Z') },
      { origin: 'Surat', destination: 'Vadodara', cargoWeight: 1800, cargoDescription: 'Textiles', status: 'COMPLETED', vehicleId: truck01.id, driverId: raj.id, startOdometer: 44000, endOdometer: 45000, startedAt: new Date('2026-02-20T08:00:00Z'), completedAt: new Date('2026-02-20T14:00:00Z') },
      { origin: 'Ahmedabad', destination: 'Rajkot', cargoWeight: 300, cargoDescription: 'Documents', status: 'DRAFT', vehicleId: van01.id, driverId: alex.id },
      { origin: 'Vadodara', destination: 'Ahmedabad', cargoWeight: 480, cargoDescription: 'Machinery parts', status: 'COMPLETED', vehicleId: van01.id, driverId: alex.id, startOdometer: 24500, endOdometer: 25000, startedAt: new Date('2026-02-18T10:00:00Z'), completedAt: new Date('2026-02-18T16:00:00Z') },
      { origin: 'Surat', destination: 'Mumbai', cargoWeight: 2000, cargoDescription: 'Chemicals', status: 'COMPLETED', vehicleId: truck01.id, driverId: raj.id, startOdometer: 42000, endOdometer: 44000, startedAt: new Date('2026-02-15T06:00:00Z'), completedAt: new Date('2026-02-15T20:00:00Z') },
      { origin: 'Ahmedabad', destination: 'Gandhinagar', cargoWeight: 25, cargoDescription: 'Food delivery', status: 'CANCELLED', vehicleId: bike01.id, driverId: mike.id },
    ]
  })

  await prisma.maintenance.createMany({
    data: [
      { description: 'Engine Repair', cost: 15000, date: new Date('2026-02-20'), notes: 'Major repair', vehicleId: truck02.id },
      { description: 'Oil Change', cost: 2500, date: new Date('2026-02-18'), notes: 'Synthetic oil', vehicleId: van01.id },
      { description: 'Tire Replacement', cost: 8000, date: new Date('2026-02-15'), notes: 'All 6 tires', vehicleId: truck01.id },
      { description: 'AC Repair', cost: 3500, date: new Date('2026-02-10'), notes: 'Compressor fixed', vehicleId: van02.id },
    ]
  })

  await prisma.fuelLog.createMany({
    data: [
      { liters: 45, cost: 4500, odometer: 18500, date: new Date('2026-02-20'), vehicleId: van02.id },
      { liters: 80, cost: 8000, odometer: 45000, date: new Date('2026-02-19'), vehicleId: truck01.id },
      { liters: 40, cost: 4000, odometer: 25000, date: new Date('2026-02-18'), vehicleId: van01.id },
      { liters: 90, cost: 9000, odometer: 32000, date: new Date('2026-02-17'), vehicleId: truck02.id },
      { liters: 42, cost: 4200, odometer: 18150, date: new Date('2026-02-15'), vehicleId: van02.id },
      { liters: 5, cost: 500, odometer: 8000, date: new Date('2026-02-14'), vehicleId: bike01.id },
      { liters: 38, cost: 3800, odometer: 24650, date: new Date('2026-02-12'), vehicleId: van01.id },
      { liters: 85, cost: 8500, odometer: 44500, date: new Date('2026-02-10'), vehicleId: truck01.id },
    ]
  })

  await prisma.expense.createMany({
    data: [
      { category: 'Insurance', amount: 12000, description: 'Annual renewal', date: new Date('2026-02-01'), vehicleId: van01.id },
      { category: 'Insurance', amount: 12000, description: 'Annual renewal', date: new Date('2026-02-01'), vehicleId: van02.id },
      { category: 'Insurance', amount: 25000, description: 'Annual renewal', date: new Date('2026-02-01'), vehicleId: truck01.id },
      { category: 'Toll', amount: 500, description: 'Highway toll', date: new Date('2026-02-15'), vehicleId: truck02.id },
      { category: 'Parking', amount: 200, description: 'Monthly parking', date: new Date('2026-02-18'), vehicleId: van01.id },
    ]
  })

  console.log('✅ Seed data created!')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

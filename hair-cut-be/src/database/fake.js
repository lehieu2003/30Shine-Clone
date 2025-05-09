import { faker } from "@faker-js/faker/locale/vi";
import { PrismaClient } from "./generated/client.js";

const db = new PrismaClient();

await db.user.deleteMany({});
await db.bookingService.deleteMany({});
await db.booking.deleteMany({});

const admin = await db.user.create({
	data: {
		email: "admin@admin.com",
		phone: "admin",
		fullName: "admin",
		role: "admin",
		availabilityStatus: "available",
		status: "active",
		password: "admin",
		createdAt: faker.date.past({}),
	},
});
const baberId = [];
const customerId = [];
for (let i = 0; i < 20; i++) {
	const user = await db.user.create({
		data: {
			email: faker.internet.email(),
			password: "Password",
			fullName: faker.person.fullName(),
			phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
			address: faker.location.streetAddress(),
			role: "customer",
			availabilityStatus: "available",
			birthDate: faker.date.past({}),

			CCCD: faker.helpers.fromRegExp(
				/^(0[0-9]{2}|1[0-9]{2}|2[0-9]{2})[0-9][0-9]{2}[0-9]{6}/
			),
			gender: faker.helpers.arrayElement([true, false]),
			createdAt: faker.date.past({}),
			status: "active",
			loyaltyPoints: faker.number.int({ min: 0, max: 500 }),
		},
	});
	customerId.push(user.id);
}

for (let i = 0; i < 10; i++) {
	const user = await db.user.create({
		data: {
			email: faker.internet.email(),
			password: "Password",
			fullName: faker.person.fullName(),
			phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
			address: faker.location.streetAddress(),
			role: "barber",
			availabilityStatus: "available",
			birthDate: faker.date.past({}),

			CCCD: faker.helpers.fromRegExp(
				/^(0[0-9]{2}|1[0-9]{2}|2[0-9]{2})[0-9][0-9]{2}[0-9]{6}/
			),
			gender: faker.helpers.arrayElement([true, false]),
			createdAt: faker.date.past({}),
			status: "active",
		},
	});
	baberId.push(user.id);
}

for (let i = 0; i < 2; i++) {
	const user = await db.user.create({
		data: {
			email: faker.internet.email(),
			password: "Password",
			fullName: faker.person.fullName(),
			phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
			address: faker.location.streetAddress(),
			role: "receptionist",
			availabilityStatus: "available",
			birthDate: faker.date.past({}),

			CCCD: faker.helpers.fromRegExp(
				/^(0[0-9]{2}|1[0-9]{2}|2[0-9]{2})[0-9][0-9]{2}[0-9]{6}/
			),
			gender: faker.helpers.arrayElement([true, false]),
			createdAt: faker.date.past({}),
			status: "active",
		},
	});
}
function randomBookingDateTime(date) {
	const hour = faker.number.int({ min: 7, max: 22 });
	const minute = faker.helpers.arrayElement([0, 20, 40]);
	const dateTime = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		hour,
		minute
	);
	return dateTime;
}
// fake customer booking
const services = await db.service.findMany({});

for await (const customer of customerId) {
	let numberOfBookings = faker.number.int({ min: 1, max: 5 });

	// booking in past 1 year
	for (let i = 0; i < numberOfBookings; i++) {
		const randomServices = faker.helpers.arrayElements(services, {
			max: 3,
			min: 1,
		});
		const total = randomServices.reduce((acc, service) => {
			return acc + Number(service.price);
		}, 0);
		const estimatedDuration = randomServices.reduce((acc, service) => {
			return acc + service.estimatedTime;
		}, 0);
		
		const appointmentDate = randomBookingDateTime(
			faker.date.past({
				years: 1,
			})
		);
		const checkInTime = new Date(appointmentDate);
		const checkOutTime = new Date(appointmentDate.getTime() + estimatedDuration * 60000);
		
		const booking = await db.booking.create({
			data: {
				appointmentDate: appointmentDate,
				createdAt: faker.date.past({
					years: 1,
				}),
				customer: {
					connect: {
						id: customer,
					},
				},
				employee: {
					connect: {
						id: faker.helpers.arrayElement(baberId),
					},
				},
				status: "completed",
				totalPrice: total,
				notes: faker.lorem.paragraph(),
				estimatedDuration: estimatedDuration,
				checkInTime: checkInTime,
				checkOutTime: checkOutTime,
				rating: faker.number.int({ min: 3, max: 5 }),
				review: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
			},
		});
		
		await db.bookingService.createMany({
			data: randomServices.map((service) => {
				return {
					bookingId: booking.id,
					serviceId: service.id,
					servicePrice: service.price,
				};
			}),
		});
	}

	// booking in future 1 week
	numberOfBookings = faker.number.int({ min: 0, max: 1 });
	for (let i = 0; i < numberOfBookings; i++) {
		const randomServices = faker.helpers.arrayElements(services, {
			max: 3,
			min: 1,
		});
		const total = randomServices.reduce((acc, service) => {
			return acc + Number(service.price);
		}, 0);
		const estimatedDuration = randomServices.reduce((acc, service) => {
			return acc + service.estimatedTime;
		}, 0);
		
		const booking = await db.booking.create({
			data: {
				appointmentDate: randomBookingDateTime(
					faker.date.between({
						from: new Date(),
						to: new Date(
							new Date().getTime() + 7 * 24 * 60 * 60 * 1000
						),
					})
				),
				createdAt: faker.date.recent({
					days: 7,
				}),
				customer: {
					connect: {
						id: customer,
					},
				},
				totalPrice: total,
				status: faker.helpers.arrayElement(["pending", "confirmed"]),
				employee: {
					connect: {
						id: faker.helpers.arrayElement(baberId),
					},
				},
				notes: faker.lorem.paragraph(),
				estimatedDuration: estimatedDuration,
			},
		});
		
		await db.bookingService.createMany({
			data: randomServices.map((service) => {
				return {
					bookingId: booking.id,
					serviceId: service.id,
					servicePrice: service.price,
				};
			}),
		});
	}
}

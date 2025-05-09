import { PrismaClient } from "./generated/client.js";

const db = new PrismaClient({
	log: [
		{
			emit: "stdout",
			level: "query",
		},
		{
			emit: "stdout",
			level: "error",
		},
		{
			emit: "stdout",
			level: "info",
		},
		{
			emit: "stdout",
			level: "warn",
		},
	],
});

export default db;

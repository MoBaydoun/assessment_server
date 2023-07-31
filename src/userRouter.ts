import express from "express";
import { v4 as uuid } from "uuid";

import { prisma } from "./db";

type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    city: string;
    postal: string;
};

type LoginCredentials = Pick<User, "email" | "password">;

const router = express.Router();

router.get("/", (req, res) => res.send("Ayoooo"));

router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password, address, postal, city } =
        req.body as User;

    const accessToken = uuid();
    try {
        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                address,
                postal,
                city,
                accessToken,
            },
        });
        res.status(200).send({ message: "Success!" });
    } catch {
        res.status(400).send({ message: "Email already in use." });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body as LoginCredentials;
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            password: true,
            accessToken: true,
        },
    });
    if (user?.password === password) {
        res.status(200).send({ accessToken: user.accessToken });
    } else {
        res.status(404).send({ message: "Invalid Credentials." });
    }
});

router.post("/getUserDetails", async (req, res) => {
    const { accessToken } = req.body as { accessToken: string };
    const user = await prisma.user.findUnique({
        where: { accessToken },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            address: true,
            city: true,
            postal: true,
        },
    });
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: "User does not exist." });
    }
});

export default router;

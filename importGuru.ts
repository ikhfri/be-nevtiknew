import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcrypt";
import prisma from "./src/libs/prisma";

const importUsers = async (csvFilePath: string) => {
  const users: {
    nis: string;
    kelas?: string;
    name: string;
    password: string;
    role?: "ADMIN" | "USER";
  }[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      users.push({
        nis: row.nis,
        kelas: row.kelas || "",
        name: row.name,
        password: row.password,
        role: row.role === "ADMIN" ? "ADMIN" : "USER",
      });
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");

      try {
        for (const user of users) {
          if (user.password && user.password.length > 0) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const existingUser = await prisma.user.findUnique({
              where: { nis: user.nis },
            });

            console.log(`Teachers with NIP ${user.nis} successfully imported`);
            if (!existingUser) {
              await prisma.user.create({
                data: {
                  nis: user.nis,
                  kelas: user.kelas,
                  categorie: "Guru",
                  name: user.name,
                  password: hashedPassword,
                  role: user.role,
                },
              });
            } else {
              console.log(
                `Teacher with NIP ${user.nis} already exists. Skipping...`
              );
            }
          }
        }
        console.log(`${users.length} imported successfully!`);
      } catch (error) {
        console.error("Error importing users:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

const csvFilePath = "./src/data/teachers.csv";
importUsers(csvFilePath);

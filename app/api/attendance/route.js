import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { qrId, matricNumber, name } = await req.json();
    const today = new Date().toISOString().split("T")[0]; // Get only the date (YYYY-MM-DD)

    if (!qrId || !matricNumber || !name) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Find the class using the QR ID
    const foundClass = await prisma.class.findUnique({
      where: { qrId },
    });

    if (!foundClass) {
      return NextResponse.json({ error: "Invalid QR code." }, { status: 404 });
    }

    // Check if the student has already marked attendance today
    const existingAttendance = await prisma.attendance.findFirst({
      where: { classId: foundClass.id, matricNumber, date: today },
    });

    if (existingAttendance) {
      return NextResponse.json({ error: "Attendance already marked for today." }, { status: 409 });
    }

    // Save attendance
    const newAttendance = await prisma.attendance.create({
      data: {
        classId: foundClass.id,
        matricNumber,
        name,
        date: today,
      },
    });

    return NextResponse.json(
      { message: "Attendance marked successfully.", attendance: newAttendance },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark attendance." }, { status: 500 });
  }
}

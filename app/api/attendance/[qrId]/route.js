import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch attendance list for a specific class (by QR ID)
export async function GET(req, { params }) {
  try {
    const { qrId } = params;

    // Find class by QR ID
    const foundClass = await prisma.class.findUnique({
      where: { qrId },
      include: { Attendance: true }, // Include attendance records
    });
    if (!foundClass) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 });
    }

    return NextResponse.json(foundClass, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch attendance." }, { status: 500 });
  }
}

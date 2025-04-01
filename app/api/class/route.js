import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";


const prisma = new PrismaClient();
const generateQRId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5); // 5-character alphanumeric

// Fetch all classes
export async function GET() {
   try {
     const classes = await prisma.class.findMany({
       orderBy: { createdAt: "desc" },
     });
 
     return NextResponse.json({ classes }, { status: 200 });
   } catch (error) {
     return NextResponse.json({ error: "Failed to fetch classes." }, { status: 500 });
   }
 }

 
export async function POST(req) {
  try {
    const {  courseCode, date, startTime, endTime } = await req.json();
    // Generate a unique 5-character QR ID
    const qrId = generateQRId();

    if ( !courseCode || !qrId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {  courseCode, qrId, date, startTime, endTime },
    });

    return NextResponse.json({ message: "Class created successfully.", class: newClass }, { status: 201 });
  } catch (error) {
   console.log(error)
    return NextResponse.json({ error: "Failed to create class." }, { status: 500 });
  }
}

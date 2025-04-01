import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch a single class by QR ID
export async function GET(req, { params }) {
  try {
    const { qrid} = params;
    const foundClass = await prisma.class.findUnique({
      where: { qrId:qrid },
    });

    if (!foundClass) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 });
    }

    return NextResponse.json({ class: foundClass }, { status: 200 });
  } catch (error) {
   console.log(error)
    return NextResponse.json({ error: "Failed to fetch class." }, { status: 500 });
  }
}

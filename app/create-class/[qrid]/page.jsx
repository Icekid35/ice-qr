"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import { Helmet } from "react-helmet";
import Link from "next/link";

export default function ClassDetails() {
  const { qrid } = useParams();
  const [classData, setClassData] = useState(null);
  const [message, setMessage] = useState("Loading class details...");
  const qrRef = useRef(null);

  useEffect(() => {
    if (!qrid) return;

    const fetchClassDetails = async () => {
      try {
        const res = await fetch(`/api/class/${qrid}`);
        const data = await res.json();
        if (res.ok) {
          setClassData(data.class);
        } else {
          setMessage(
            data.error ||
              "An unexpected error occurred. Please try again later."
          );
          console.error("Failed to fetch class details");
        }
      } catch (error) {
        setMessage("An unexpected error occurred. Please try again later.");
        console.error("Error fetching class details", error);
      }
    };

    fetchClassDetails();
  }, [qrid]);
  const generatePDF = (download = false) => {
    if (!classData || !qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const doc = new jsPDF();

    // Reduce text size for better formatting
    doc.setFontSize(10);

    // Left align values properly
    const labelX = 14;
    const valueX = 35; // Consistent spacing

    // Course Details
    doc.setFont("helvetica", "bold");
    doc.text("Course:", labelX, 20);
    doc.setFont("helvetica", "normal");
    doc.text(classData.courseCode, valueX, 20);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", labelX, 30);
    doc.setFont("helvetica", "normal");
    doc.text(classData.date, valueX, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Start Time:", labelX, 40);
    doc.setFont("helvetica", "normal");
    doc.text(classData.startTime, valueX, 40);

    doc.setFont("helvetica", "bold");
    doc.text("End Time:", labelX, 50);
    doc.setFont("helvetica", "normal");
    doc.text(classData.endTime, valueX, 50);

    doc.setFont("helvetica", "bold");
    doc.text("QR ID:", labelX, 60);
    doc.setFont("helvetica", "normal");
    doc.text(classData.qrId, valueX, 60);

    // Class QR Code Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Class QR Code", 80, 70);

    // Add QR Code Image to PDF (placed at the bottom)
    doc.addImage(canvas.toDataURL("image/png"), "PNG", 60, 80, 80, 80);

    if (download) {
      doc.save(`QRCode_${classData.qrId}_${classData.date}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  if (!classData) {
    return (
      <p className="text-center m-auto flex justify-center items-center h-screen w-screen text-gray-600">
        {message}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Helmet>
        <title>class details for -{classData.courseCode || ""}</title>
      </Helmet>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center flex flex-col align-middle items-center">
        <h1 className="text-2xl font-bold mb-4">Class Details</h1>
        <p className="text-lg">
          <strong>Course Code:</strong> {classData.courseCode}
        </p>
        <p className="text-lg">
          <strong>Qr Id:</strong> {classData.qrId}
        </p>
        <p className="text-lg">
          <strong>Date:</strong> {classData.date}
        </p>
        <p className="text-lg">
          <strong>Start Time:</strong> {classData.startTime}
        </p>
        <p className="text-lg">
          <strong>End Time:</strong> {classData.endTime}
        </p>

        <div className="my-4" ref={qrRef}>
          <h2 className="text-lg font-semibold">QR Code</h2>
          <QRCodeCanvas
            value={`${window.location.origin}/attendance/${classData.qrId}`}
            level="M"
            size={300}
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => generatePDF(true)}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download QR Code as PDF
          </button>
          <button
            onClick={() => generatePDF(false)}
            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Print QR Code
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/attendance/${classData.qrId}`)}
            className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Copy Attendance Link
          </button>
         <Link href={`/view-attendance`}>
         
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-green-700"
          >
           Check Attendance
          </button>
         </Link>
        </div>
      </div>
    </div>
  );
}

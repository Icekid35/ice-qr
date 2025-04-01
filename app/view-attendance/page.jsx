"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Helmet } from "react-helmet";

export default function ViewAttendance() {
  const [classInfo, setClassInfo] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [inputQrId, setInputQrId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    setClassInfo(null);
    setAttendanceList([]);

    if (!inputQrId.trim()) {
      setError("QR ID cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/attendance/${inputQrId.trim()}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      if (!data || !data.qrId || !Array.isArray(data.Attendance)) {
        throw new Error("Invalid response from server.");
      }

      setClassInfo({
        id: data.id,
        courseCode: data.courseCode,
        qrId: data.qrId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        createdAt: data.createdAt
      });

      setAttendanceList(data.Attendance);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportAsPDF = () => {
    if (!attendanceList.length) {
      alert("No attendance records to export.");
      return;
    }
  
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Class Attendance", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.text(`Course Code: ${classInfo.courseCode}`, 14, 30);
    doc.text(`QR ID: ${classInfo.qrId}`, 14, 38);
    doc.text(`Date: ${classInfo.date}`, 14, 46);
    doc.text(`Time: ${classInfo.startTime} - ${classInfo.endTime}`, 14, 54);
  
    // Convert attendance data into proper format
    const formattedData = attendanceList.map(({ matricNumber, name }) => ({
      "Matric Number": matricNumber,
      "Name": name
    }));
  
    // Generate table
    doc.table(14, 55, formattedData, ["Matric Number", "Name"], {
      printHeaders: true,
      autoSize: true,
      fontSize: 10,
      margins: { left: 14, top: 55, bottom: 10, width: 500 }
    });
  
    doc.save(`Attendance_${classInfo.qrId}_${classInfo.date}.pdf`);
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                 <Helmet>
        <title>View Attendance</title>
      </Helmet>
       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">View Attendance</h1>

        {/* QR ID Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter QR ID"
            value={inputQrId}
            onChange={(e) => setInputQrId(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={fetchAttendance}
            className="w-full py-3 mt-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Attendance"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Class Info */}
        {classInfo && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg text-center font-semibold">
              Class Information
            </h2>
            <p>
              <strong>Course Code:</strong> {classInfo.courseCode}
            </p>
            <p>
              <strong>QR ID:</strong> {classInfo.qrId}
            </p>
            <p>
              <strong>Date:</strong> {classInfo.date}
            </p>
            <p>
              <strong>Time:</strong> {classInfo.startTime} - {classInfo.endTime}
            </p>
          </div>
        )}

        {/* Attendance Table */}
        {classInfo &&
          !loading &&
          (attendanceList.length > 0 ? (
            <>
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Matric Number</th>
                    <th className="border p-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((record, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{record.matricNumber}</td>
                      <td className="border p-2">{record.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Export as PDF Button */}
              <button
                onClick={exportAsPDF}
                className="w-full py-3 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Export as PDF
              </button>
            </>
          ) : (
            <div className="text-center text-2xl m-3">Attendance is empty..</div>
          ))}
      </div>
    </div>
  );
}

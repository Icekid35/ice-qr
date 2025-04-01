"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Helmet } from "react-helmet";
import Link from "next/link";
export default function AttendanceForm() {
  const { qrid } = useParams();

  const [matricNumber, setMatricNumber] = useState("");
  const [name, setName] = useState("");
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [disabled, setdisabled] = useState(false);

  useEffect(() => {
    if (!qrid) return;

    const fetchClassDetails = async () => {
      try {
        const res = await fetch(`/api/class/${qrid}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Class not found");

        setClassData(data.class);
        setLoading(false);
        if (!isWithinAttendanceTime(data.class)) {
          setError("Attendance is closed..");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClassDetails();

    // Retrieve saved details from localStorage
    const savedData = JSON.parse(
      localStorage.getItem(`attendance_${qrid}`) || "{}"
    );
    if (savedData?.submitted) {
      setError("You have already submitted attendance for today.");
    } else {
      setMatricNumber(savedData.matricNumber || "");
      setName(savedData.name || "");
    }
  }, [qrid]);

  const isWithinAttendanceTime = (cs) => {
    if (!classData && !cs) return false;

    let classDataa = cs || classData;

    const now = new Date();
    const classDate = new Date(classDataa.date);
    const startTime = new Date(`${classDataa.date}T${classDataa.startTime}`);
    const endTime = new Date(`${classDataa.date}T${classDataa.endTime}`);
    const correct =
      now >= startTime &&
      now <= endTime &&
      now.toDateString() === classDate.toDateString();
    return correct;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setdisabled(true);
    setError("");
    setSuccess("");

    if (!matricNumber || !name) {
      setError("Please fill in all fields.");
      setdisabled(false);
      return;
    }

    if (!isWithinAttendanceTime()) {
      setError("Attendance is not open at this time.");
      setdisabled(false);
      return;
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrId: qrid, matricNumber, name })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit attendance");

      // Save submission status in localStorage
      localStorage.setItem(
        `attendance_${qrid}`,
        JSON.stringify({ matricNumber, name, submitted: true })
      );

      setSuccess("Attendance submitted successfully.");
      setMatricNumber("");
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setdisabled(false);
    }
  };

  if (loading)
    return (
      <p className="text-center m-auto flex justify-center items-center h-screen w-screen text-gray-600">
        Loading class details...
      </p>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Helmet>
        <title>Marrk Attendance -{classData.courseCode || ""}</title>
      </Helmet>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Submit Attendance
        </h1>

        {classData ? (
          <div className="mb-4 p-4 ">
            <p>
              <strong>Course:</strong> {classData.courseCode}
            </p>
            <p>
            <p>
          <strong>Qr Id:</strong> {classData.qrId}
        </p>
              <strong>Date:</strong> {classData.date}
            </p>
            <p>
              <strong>Start Time:</strong> {classData.startTime}
            </p>
            <p>
              <strong>End Time:</strong> {classData.endTime}
            </p>
          </div>
        ) : (
          <p className="text-center text-red-500">Class not found.</p>
        )}
        {success ? (<>
        
         <p className="text-green-500 text-center">{success}</p>
         <Link href="/">
            <button className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Go TO Home Screen
            </button>
          </Link>
        </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Matric Number"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            {classData && error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={error || !isWithinAttendanceTime() || disabled}
            >
              Submit Attendance
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

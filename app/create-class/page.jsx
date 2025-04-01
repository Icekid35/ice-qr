"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Helmet } from "react-helmet";

export default function CreateClass() {
  const router = useRouter();
  const [courseCode, setCourseCode] = useState("");
  const [startTime, setStartTime] = useState(
    new Date().toISOString().slice(11, 16)
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [duration, setDuration] = useState(2); // Default to 2 hours
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Function to calculate End Time
  const calculateEndTime = (startTime, duration) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = (hours + duration) % 24; // Ensure it wraps around 24 hours
    return `${endHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseCode || !startTime || !startDate || !duration) {
      setMessage("Please fill all fields!");
      return;
    }

    setLoading(true);
    setMessage("");

    const endTime = calculateEndTime(startTime, duration); // Auto-calculate end time

    try {
      const res = await fetch("/api/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode,
          startTime,
          endTime,
          date: startDate
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Class created successfully! redirecting...");
        setCourseCode("");
        setStartTime("");
        setStartDate("");
        setDuration(2);
        router.push(`/create-class/${data.class.qrId}`);
      } else {
        setMessage(data.error || "Failed to create class");
      }
    } catch (error) {
      console.log(error);
      setMessage("Error creating class!");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Helmet>
        <title>Create class</title>
      </Helmet>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Create a Class</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-700 font-medium">Course Code</label>
          <input
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-gray-700 font-medium">Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-gray-700 font-medium">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-gray-700 font-medium">Duration (hours)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {message && message == "Class created successfully! redirecting..." ? (
            <p className="text-center text-green-600">{message}</p>
          ) : (
            <p className="text-center text-red-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 cursor-pointer disabled:cursor-not-allowed text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Creating..." : "Create Class"}
          </button>
        </form>
      </div>
    </div>
  );
}

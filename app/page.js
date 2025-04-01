import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Attendance System</h1>
        
        <div className="flex flex-col gap-4">
          <Link href="/create-class">
            <button className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              ➕ Create Class
            </button>
          </Link>

          <Link href="/scan-qr">
            <button className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
              📷 Scan QR Code
            </button>
          </Link>

          <Link href="/view-attendance">
            <button className="w-full py-4 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900">
              📜 View Attendance
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

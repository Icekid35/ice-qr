"use client";
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Link from "next/link";
import { Helmet } from "react-helmet";

export default function ScanQR() {
  const [scanner, setScanner] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = () => {
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning && !scanner) {
      const newScanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      });

      newScanner.render(
        (decodedText) => {
          setScannedData(decodedText);
          newScanner.clear(); // Stop scanning after a successful scan
          setScanner(null);
          setIsScanning(false);
        },
        (errorMessage) => {
          console.log(errorMessage);
        }
      );

      setScanner(newScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((err) => console.log("Cleanup error:", err));
        setScanner(null);
        setIsScanning(false);
      }
    };
  }, [isScanning]); // Runs only when isScanning changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Helmet>
          <title>Scan QR Code</title>
        </Helmet>

        <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>

        {/* Start Scanning Button */}
        {!isScanning && (
          <button
            onClick={startScanner}
            className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Start Scanning
          </button>
        )}

        {/* Scanner appears only when Start Scanning is clicked */}
        {isScanning && <div id="reader" className="w-full mb-4"></div>}

        {/* Display scanned data */}
        {scannedData && (
          <>
            <p className="text-center text-green-600 font-semibold">✅ QR Scanned Successfully!</p>
            <Link href={scannedData}>
              <button className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Go to Page
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

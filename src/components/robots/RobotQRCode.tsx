"use client";

import { useState, useEffect } from "react";
import { QrCode, Download, Printer, X, Copy, Check } from "lucide-react";
import { Robot } from "@/lib/robotData";
import { motion, AnimatePresence } from "framer-motion";

interface RobotQRCodeProps {
  robot: Robot;
  size?: "sm" | "md" | "lg";
  showActions?: boolean;
}

export function RobotQRCode({ robot, size = "md", showActions = true }: RobotQRCodeProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only use window.location.origin on client after mount to avoid hydration mismatch
  const robotUrl = isMounted && typeof window !== 'undefined' 
    ? `${window.location.origin}/robots/${robot.id}`
    : `/robots/${robot.id}`;
  
  // Generate QR code URL using a free QR code API
  const qrSize = size === "sm" ? 100 : size === "md" ? 150 : 200;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(robotUrl)}&bgcolor=ffffff&color=1a1f36&margin=8`;
  const printQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(robotUrl)}&bgcolor=ffffff&color=1a1f36&margin=16`;

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(robotUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${robot.name}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
              }
              .container {
                text-align: center;
                max-width: 400px;
              }
              .qr-code {
                border: 2px solid #e5e7eb;
                border-radius: 16px;
                padding: 20px;
                background: white;
                margin-bottom: 20px;
              }
              .qr-code img {
                display: block;
              }
              h1 {
                font-size: 24px;
                color: #1a1f36;
                margin: 0 0 8px 0;
              }
              .serial {
                font-size: 14px;
                color: #6b7280;
                font-family: monospace;
                margin-bottom: 16px;
              }
              .model {
                font-size: 16px;
                color: #51A6D6;
                font-weight: 600;
                margin-bottom: 8px;
              }
              .facility {
                font-size: 14px;
                color: #6b7280;
              }
              .url {
                font-size: 10px;
                color: #9ca3af;
                word-break: break-all;
                margin-top: 16px;
              }
              .bear-logo {
                font-size: 12px;
                color: #51A6D6;
                font-weight: 700;
                margin-top: 24px;
                letter-spacing: 2px;
              }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="qr-code">
                <img src="${printQrCodeUrl}" alt="QR Code for ${robot.name}" />
              </div>
              <h1>${robot.name}</h1>
              <div class="serial">${robot.serialNumber}</div>
              <div class="model">${robot.model}</div>
              <div class="facility">${robot.facility}</div>
              <div class="url">${robotUrl}</div>
              <div class="bear-logo">BEAR ROBOTICS</div>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  const handleDownload = async () => {
    const response = await fetch(printQrCodeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${robot.serialNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* QR Code Display */}
      <div 
        className="group cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative bg-white rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <img 
            src={qrCodeUrl} 
            alt={`QR Code for ${robot.name}`}
            className="block"
            width={qrSize}
            height={qrSize}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors flex items-center justify-center">
            <QrCode className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        {showActions && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-400 group-hover:text-bear-blue transition-colors">
              Click to expand
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1f36] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-bear-blue/20">
                    <QrCode className="w-5 h-5 text-bear-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Robot QR Code</h3>
                    <p className="text-xs text-gray-400">Scan to access robot details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl p-6 mb-6 flex items-center justify-center">
                <img 
                  src={printQrCodeUrl} 
                  alt={`QR Code for ${robot.name}`}
                  className="block max-w-full"
                />
              </div>

              {/* Robot Info */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <div className="text-center mb-3">
                  <h4 className="font-bold text-white text-lg">{robot.name}</h4>
                  <p className="text-sm text-gray-400 font-mono">{robot.serialNumber}</p>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-bear-blue font-medium">{robot.model}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{robot.facility}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-400">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Download className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">Download</span>
                </button>
                
                <button
                  onClick={handlePrint}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bear-blue/20 border border-bear-blue/30 hover:bg-bear-blue/30 transition-all"
                >
                  <Printer className="w-5 h-5 text-bear-blue" />
                  <span className="text-xs text-bear-blue">Print</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Simple inline QR display for cards
export function RobotQRBadge({ robot }: { robot: Robot }) {
  const robotUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/robots/${robot.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(robotUrl)}&bgcolor=ffffff&color=1a1f36&margin=4`;
  
  return (
    <div className="bg-white rounded-lg p-1.5 shadow-md">
      <img 
        src={qrCodeUrl} 
        alt={`QR for ${robot.name}`}
        className="block"
        width={60}
        height={60}
      />
    </div>
  );
}

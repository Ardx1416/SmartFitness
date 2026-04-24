import { Check, Copy, Download, QrCode, Share2, X } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { getQRCodeImageUrl } from "../lib/qrCodeGenerator";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_URL = window.location.origin;

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const qrImageUrl = getQRCodeImageUrl(APP_URL, 240);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = APP_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!imgLoaded) return;
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "smartfit-qrcode.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab for manual save
      window.open(qrImageUrl, "_blank");
    }
  }, [qrImageUrl, imgLoaded]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-auto share-modal-card rounded-2xl overflow-hidden">
        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none share-modal-border" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-4 border-b border-surface-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-electric-500/20 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-electric-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base leading-tight">
                Share SmartFit
              </h2>
              <p className="text-surface-400 text-xs">Scan or copy the link</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-800/60 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
            aria-label="Close"
            data-ocid="share_modal.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code */}
        <div className="relative px-5 pt-5 pb-4 flex flex-col items-center">
          <div className="relative">
            {/* QR container with glow */}
            <div className="qr-container rounded-xl p-3 flex items-center justify-center bg-white">
              {imgError ? (
                <div className="w-[240px] h-[240px] flex flex-col items-center justify-center gap-2 bg-white rounded-lg">
                  <QrCode className="w-10 h-10 opacity-40 text-gray-400" />
                  <span className="text-xs text-gray-400">QR unavailable</span>
                  <span className="text-[10px] text-gray-400 text-center px-4">
                    Visit: {APP_URL}
                  </span>
                </div>
              ) : (
                <div className="relative w-[240px] h-[240px] flex items-center justify-center">
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-electric-500/40 border-t-electric-400 rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={qrImageUrl}
                    alt={`QR code for ${APP_URL}`}
                    width={240}
                    height={240}
                    className={`rounded-lg transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => {
                      setImgLoaded(true);
                      setImgError(false);
                    }}
                    onError={() => {
                      setImgError(true);
                      setImgLoaded(false);
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              )}
            </div>

            {/* Electric corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-electric-400/60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-electric-400/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-electric-400/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-electric-400/60 rounded-br-lg" />
          </div>

          <p className="text-surface-500 text-xs mt-3 text-center">
            Point your camera at the QR code to open the app
          </p>
        </div>

        {/* URL + Copy */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 bg-surface-800/60 border border-surface-700/50 rounded-xl px-3 py-2.5">
            <span className="flex-1 text-surface-300 text-xs font-mono truncate select-all">
              {APP_URL}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              data-ocid="share_modal.copy_button"
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? "bg-neon-500/20 text-neon-400 border border-neon-500/30"
                  : "bg-electric-500/20 hover:bg-electric-500/30 text-electric-400 border border-electric-500/30"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Download Button */}
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!imgLoaded}
            data-ocid="share_modal.download_button"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-electric-500 hover:bg-electric-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-glow hover:shadow-glow-lg"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}

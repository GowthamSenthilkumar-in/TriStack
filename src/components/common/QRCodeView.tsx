import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeViewProps {
  value: string;
  size?: number;
  className?: string;
  label?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 120,
  className = '',
  label = 'SCAN TO VERIFY'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      const fullUrl = value.startsWith('http')
        ? value
        : `${window.location.origin}${value.startsWith('/') ? '' : '/'}${value}`;

      QRCode.toCanvas(
        canvasRef.current,
        fullUrl,
        {
          width: size,
          margin: 1,
          color: {
            dark: '#1e3a8a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-xs text-center ${className}`}>
      <canvas ref={canvasRef} className="rounded" />
      {label && (
        <span className="text-[9px] font-bold tracking-wider text-[#1e3a8a] mt-1 uppercase">
          {label}
        </span>
      )}
    </div>
  );
};

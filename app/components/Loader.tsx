import { useEffect } from "react";

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = "Loading..." }: LoaderProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-reverse {
          animation: reverse-spin 1s linear infinite;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-900 via-primary-700 to-accent-600 animate-pulse"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-accent-500 animate-spin"></div>
        <div className="absolute inset-2 w-12 h-12 rounded-full border-2 border-transparent border-b-primary-700 animate-spin animate-reverse"></div>
      </div>

      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-primary-700 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gradient">{message}</p>
        <p className="text-sm text-neutral-500 mt-1">Please wait while we process your request</p>
      </div>

      <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-900 via-accent-500 to-primary-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

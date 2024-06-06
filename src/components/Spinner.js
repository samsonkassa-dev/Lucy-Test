// components/LoadingSpinner.js

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-500 h-12 w-12"></div>
      <style jsx>{`
        .loader {
          border-top-color: #6b46c1; // solid purple color
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
  
  export default LoadingSpinner;
  
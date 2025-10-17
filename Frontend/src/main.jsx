// import { Toaster } from "react-hot-toast";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext.jsx";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <QueryClientProvider client={queryClient}>
//           <App />
//           {/* 🔔 Global Toaster (centered, only one visible at a time) */}
//           <Toaster
//             position="top-center"
//             reverseOrder={false}
//             gutter={8}
//             toastOptions={{
//               duration: 2000,
//               style: {
//                 background: "#222",
//                 color: "#fff",
//                 fontSize: "1rem",
//                 borderRadius: "10px",
//                 padding: "12px 16px",
//                 boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
//               },
//               success: {
//                 iconTheme: {
//                   primary: "#00ba7c",
//                   secondary: "#fff",
//                 },
//               },
//               error: {
//                 iconTheme: {
//                   primary: "#f4212e",
//                   secondary: "#fff",
//                 },
//               },
//             }}
//             containerStyle={{
//               top: 20, // push down slightly from top
//             }}
//             limit={1} // 🔥 only 1 toast on screen
//           />
//         </QueryClientProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// );

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-400 mt-2 whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

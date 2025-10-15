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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

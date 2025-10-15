// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useAuth } from "../../../contexts/AuthContext.jsx";

// import XSvg from "../../../components/svgs/X";

// import { MdOutlineMail } from "react-icons/md";
// import { FaUser } from "react-icons/fa";
// import { MdPassword } from "react-icons/md";
// import { MdDriveFileRenameOutline } from "react-icons/md";
// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     fullname: "",
//     password: "",
//   });

//   const [formError, setFormError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // ✅ Mutation for signup
//   const { mutateAsync } = useMutation({
//     mutationFn: async (newUser) => {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newUser),
//       });

//       if (!res.ok) {
//         throw new Error("Signup failed");
//       }

//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       return data;
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setFormError("");

//     // 🔥 Wrap the async call in toast.promise
//     const signupPromise = (async () => {
//       // trigger backend mutation
//       await mutateAsync(formData);

//       // login immediately after signup
//       await login({ username: formData.username, password: formData.password });

//       return true; // success
//     })();

//     toast.promise(
//       signupPromise,
//       {
//         loading: "Creating account...",
//         success: "Account created and logged in!",
//         error: (err) => err.message || "Signup failed",
//       },
//       { id: "signup-toast" } // ✅ replaces instead of stacking
//     );

//     try {
//       await signupPromise;
//       navigate("/");
//     } catch (error) {
//       setFormError(error.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="min-h-screen bg-black flex">
//       {/* Left Side - Logo */}
//       <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
//         <XSvg className="w-96 h-96 fill-white" />
//       </div>

//       {/* Right Side - Signup Form */}
//       <div className="flex-1 flex flex-col justify-center items-center px-8">
//         <div className="w-full max-w-md">
//           <XSvg className="w-12 h-12 fill-white mb-8 lg:hidden" />
//           <h1 className="text-4xl font-bold mb-8">Join Twitter today</h1>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {/* Email */}
//             <div>
//               <label className="twitter-input flex items-center gap-3">
//                 <MdOutlineMail className="w-5 h-5 text-gray-500" />
//                 <input
//                   type="email"
//                   className="flex-1 bg-transparent focus:outline-none"
//                   placeholder="Email"
//                   name="email"
//                   onChange={handleInputChange}
//                   value={formData.email}
//                   required
//                 />
//               </label>
//             </div>

//             {/* Username + Fullname */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="twitter-input flex items-center gap-3">
//                   <FaUser className="w-5 h-5 text-gray-500" />
//                   <input
//                     type="text"
//                     className="flex-1 bg-transparent focus:outline-none"
//                     placeholder="Username"
//                     name="username"
//                     onChange={handleInputChange}
//                     value={formData.username}
//                     required
//                   />
//                 </label>
//               </div>
//               <div>
//                 <label className="twitter-input flex items-center gap-3">
//                   <MdDriveFileRenameOutline className="w-5 h-5 text-gray-500" />
//                   <input
//                     type="text"
//                     className="flex-1 bg-transparent focus:outline-none"
//                     placeholder="Full Name"
//                     name="fullname"
//                     onChange={handleInputChange}
//                     value={formData.fullname}
//                     required
//                   />
//                 </label>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="twitter-input flex items-center gap-3">
//                 <MdPassword className="w-5 h-5 text-gray-500" />
//                 <input
//                   type="password"
//                   className="flex-1 bg-transparent focus:outline-none"
//                   placeholder="Password"
//                   name="password"
//                   onChange={handleInputChange}
//                   value={formData.password}
//                   required
//                 />
//               </label>
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               className="w-full twitter-button py-3 text-lg font-semibold"
//               disabled={loading}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="loading-spinner w-5 h-5"></div>
//                   Creating account...
//                 </div>
//               ) : (
//                 "Create account"
//               )}
//             </button>

//             {/* Error */}
//             {formError && (
//               <div className="text-red-500 text-center text-sm">
//                 {formError}
//               </div>
//             )}
//           </form>

//           {/* Already have account */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-500 mb-4">Already have an account?</p>
//             <Link to="/login">
//               <button className="w-full twitter-button-outline py-3 text-lg font-semibold">
//                 Sign in
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;



import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/useAuth.js";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Mutation for signup
  const { mutateAsync } = useMutation({
    mutationFn: async (newUser) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    // 🔥 Wrap the async call in toast.promise
    const signupPromise = (async () => {
      // trigger backend mutation
      await mutateAsync(formData);

      // login immediately after signup
      await login({ username: formData.username, password: formData.password });

      return true; // success
    })();

    toast.promise(
      signupPromise,
      {
        loading: "Creating account...",
        success: "Account created and logged in!",
        error: (err) => err.message || "Signup failed",
      },
      { id: "signup-toast" } // ✅ replaces instead of stacking
    );

    try {
      await signupPromise;
      navigate("/");
    } catch (error) {
      setFormError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <XSvg className="w-96 h-96 fill-white" />
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <XSvg className="w-12 h-12 fill-white mb-8 lg:hidden" />
          <h1 className="text-4xl font-bold mb-8">Join Twitter today</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="twitter-input flex items-center gap-3">
                <MdOutlineMail className="w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
              </label>
            </div>

            {/* Username + Fullname */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="twitter-input flex items-center gap-3">
                  <FaUser className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Username"
                    name="username"
                    onChange={handleInputChange}
                    value={formData.username}
                    required
                  />
                </label>
              </div>
              <div>
                <label className="twitter-input flex items-center gap-3">
                  <MdDriveFileRenameOutline className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Full Name"
                    name="fullname"
                    onChange={handleInputChange}
                    value={formData.fullname}
                    required
                  />
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="twitter-input flex items-center gap-3">
                <MdPassword className="w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full twitter-button py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-5 h-5"></div>
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>

            {/* Error */}
            {formError && (
              <div className="text-red-500 text-center text-sm">
                {formError}
              </div>
            )}
          </form>

          {/* Already have account */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Already have an account?</p>
            <Link to="/login">
              <button className="w-full twitter-button-outline py-3 text-lg font-semibold">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;


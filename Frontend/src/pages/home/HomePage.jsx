// import { useState } from "react";

// import Posts from "../../components/common/Posts";
// import CreatePost from "./CreatePost";
// import RightPanel from "../../components/common/RightPanel";

// const HomePage = () => {
//   const [feedType, setFeedType] = useState("forYou");

//   return (
//     <div className="flex max-w-6xl mx-auto gap-4">
//       {/* LEFT FEED */}
//       <div className="flex-[4] border-r border-gray-700 min-h-screen bg-base-100">
//         {/* Header */}
//         <div className="flex w-full border-b border-gray-700">
//           <div
//             className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
//             onClick={() => setFeedType("forYou")}
//           >
//             <span className="text-base-content">For you</span>
//             {feedType === "forYou" && (
//               <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
//             )}
//           </div>
//           <div
//             className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
//             onClick={() => setFeedType("following")}
//           >
//             <span className="text-base-content">Following</span>
//             {feedType === "following" && (
//               <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
//             )}
//           </div>
//         </div>

//         {/* CREATE POST INPUT */}
//         <CreatePost />

//         {/* POSTS */}
//         <Posts />
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="flex-[2] hidden lg:block">
//         <RightPanel />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import RightPanel from "../../components/common/RightPanel";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex w-full min-h-screen max-w-[1400px] mx-auto gap-4">
      {/* LEFT FEED (takes majority of space) */}
      <div className="flex-[4] border-r border-gray-700 min-h-screen bg-base-100">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && ( 
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        {/* CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-[2] hidden lg:flex flex-col min-h-screen">
        <RightPanel />
      </div>
    </div>
  );
};

export default HomePage;


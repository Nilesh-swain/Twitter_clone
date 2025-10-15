import { FaQuestionCircle, FaHome, FaBell, FaUser, FaBookmark, FaSignInAlt, FaSignOutAlt, FaEdit, FaHeart, FaComment, FaShare, FaSearch } from "react-icons/fa";

const HelpPage = () => {
  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: FaSignInAlt,
      content: [
        {
          subtitle: "Signing Up",
          description: "Create a new account by clicking 'Sign Up' on the login page. Fill in your details including username, email, and password. You'll receive an OTP for verification."
        },
        {
          subtitle: "Logging In",
          description: "Use your registered email and password to log in. If you forget your password, use the 'Forgot Password' option."
        }
      ]
    },
    {
      id: "home",
      title: "Home Page",
      icon: FaHome,
      content: [
        {
          subtitle: "Viewing Posts",
          description: "The home page displays posts from users you follow. Scroll through to see the latest updates."
        },
        {
          subtitle: "Creating Posts",
          description: "Click the 'Create Post' button or the compose icon. Write your message (up to 280 characters), add images/videos, and post it."
        },
        {
          subtitle: "Interacting with Posts",
          description: "Like posts with the heart icon, reply with the comment icon, repost with the share icon, or save for later with the bookmark icon."
        }
      ]
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: FaBell,
      content: [
        {
          subtitle: "Viewing Notifications",
          description: "Access notifications from the sidebar or bottom navigation. See likes, replies, follows, and mentions."
        },
        {
          subtitle: "Notification Types",
          description: "Receive notifications for: new followers, likes on your posts, replies to your posts, mentions in posts, and reposts."
        }
      ]
    },
    {
      id: "profile",
      title: "Profile Management",
      icon: FaUser,
      content: [
        {
          subtitle: "Viewing Your Profile",
          description: "Click on your profile picture or username to view your profile. See your posts, followers, and following count."
        },
        {
          subtitle: "Editing Profile",
          description: "Click 'Edit Profile' to update your bio, profile picture, cover image, and other details."
        },
        {
          subtitle: "Following Users",
          description: "Visit other users' profiles and click 'Follow' to follow them. Unfollow by clicking 'Following'."
        }
      ]
    },
    {
      id: "saved",
      title: "Saved Posts",
      icon: FaBookmark,
      content: [
        {
          subtitle: "Saving Posts",
          description: "Click the bookmark icon on any post to save it for later viewing."
        },
        {
          subtitle: "Viewing Saved Posts",
          description: "Access the 'Saved' page to view all your bookmarked posts in one place."
        }
      ]
    },
    {
      id: "search",
      title: "Search & Discovery",
      icon: FaSearch,
      content: [
        {
          subtitle: "Searching Content",
          description: "Use the search bar in the right panel to find users, posts, or hashtags."
        },
        {
          subtitle: "Trending Topics",
          description: "Check the 'What's Happening' section in the right panel for trending topics and news."
        }
      ]
    },
    {
      id: "account",
      title: "Account Settings",
      icon: FaEdit,
      content: [
        {
          subtitle: "Logging Out",
          description: "Click on your profile picture in the sidebar, then select 'Logout' from the dropdown menu."
        },
        {
          subtitle: "Account Security",
          description: "Keep your password secure and enable two-factor authentication if available."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FaQuestionCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Help Center</h1>
          <p className="text-gray-400 text-lg">Your guide to using our Twitter clone platform</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.content.map((item, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="text-lg font-medium text-primary mb-2">{item.subtitle}</h3>
                      <p className="text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Need More Help?</h3>
            <p className="text-gray-400 mb-4">
              If you can't find what you're looking for, feel free to explore the app or contact support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>• All posts are limited to 280 characters</span>
              <span>• Images and videos can be uploaded to posts</span>
              <span>• Private accounts are not yet supported</span>
              <span>• Direct messaging is coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

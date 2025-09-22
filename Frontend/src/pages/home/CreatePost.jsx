import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { postAPI } from "../../utils/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();

  const imgRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return;

    setIsPending(true);
    setIsError(false);

    try {
      await postAPI.createPost({ text, img });
      setText("");
      setImg(null);
      if (imgRef.current) {
        imgRef.current.value = null;
      }
      // Refresh posts by triggering a re-render
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={user.profileImg || "/avatar-placeholder.png"}
            alt={user.fullname}
            className="w-full h-full object-cover"
          />
        </div>
        <form className="flex-1" onSubmit={handleSubmit}>
          <textarea
            className="w-full bg-transparent text-xl placeholder-gray-500 resize-none focus:outline-none min-h-[120px]"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {img && (
            <div className="relative mt-4 rounded-2xl overflow-hidden">
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
              >
                <IoCloseSharp className="w-4 h-4" />
              </button>
              <img
                src={img}
                alt="Post image"
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                onClick={() => imgRef.current.click()}
              >
                <CiImageOn className="w-5 h-5 text-primary" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <BsEmojiSmileFill className="w-5 h-5 text-primary" />
              </button>
            </div>

            <input
              type="file"
              hidden
              ref={imgRef}
              onChange={handleImgChange}
              accept="image/*"
            />

            <button
              type="submit"
              className="twitter-button px-6 py-2 text-sm font-semibold"
              disabled={isPending || (!text.trim() && !img)}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4"></div>
                  Posting...
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>

          {isError && (
            <div className="mt-2 text-red-500 text-sm">
              Something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default CreatePost;

import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { postAPI } from "../../utils/api.js";
import { useAuth } from "../../contexts/useAuth.js";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUpload.js";
import EmojiPicker from "emoji-picker-react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuth();
  const imgRef = useRef(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return;

    setIsPending(true);
    setIsError(false);

    try {
      let imageUrl = null;
      if (imgFile) {
        imageUrl = await uploadImageToCloudinary(imgFile);
      }

      // Create the post with text and image URL
      await postAPI.createPost({ text, imgFile: null, imgUrl: imageUrl });

      // Reset form
      setText("");
      setImg(null);
      setImgFile(null);
      if (imgRef.current) imgRef.current.value = null;

      // Refresh posts without reloading page
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post created!");
    } catch (error) {
      console.error("Error creating post:", error);
      setIsError(true);
      toast.error("Failed to create post!");
    } finally {
      setIsPending(false);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 mb-6 mx-2 shadow-lg">
      <div className="flex gap-5">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary">
          <img
            src={user?.profileImg || "/avatar-placeholder.png"}
            alt={user?.fullname || "User"}
            className="w-full h-full object-cover"
          />
        </div>
        <form className="flex-1" onSubmit={handleSubmit}>
          <textarea
            className="w-full bg-transparent text-2xl placeholder-gray-400 resize-none focus:outline-none min-h-[160px] leading-relaxed font-sans rounded-xl p-4 border border-gray-700 focus:border-primary transition-colors shadow-inner"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {img && (
            <div className="relative mt-6 rounded-3xl overflow-hidden shadow-lg border border-gray-700">
              <button
                type="button"
                className="absolute top-3 right-3 bg-black/80 hover:bg-black/95 text-white rounded-full p-2 transition-colors z-10 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImg(null);
                  setImgFile(null);
                  if (imgRef.current) {
                    imgRef.current.value = null;
                  }
                }}
                title="Remove image"
              >
                <IoCloseSharp className="w-5 h-5" />
              </button>
              <img
                src={img}
                alt="Post image"
                className="w-full max-h-96 object-cover rounded-3xl"
              />
            </div>
          )}

          <div className="relative flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center gap-5">
              <button
                type="button"
                className="p-3 rounded-full hover:bg-gray-800 transition-colors shadow-md text-primary"
                onClick={() => imgRef.current.click()}
                aria-label="Add image"
              >
                <CiImageOn className="w-6 h-6" />
              </button>
              <button
                type="button"
                className="p-3 rounded-full hover:bg-gray-800 transition-colors shadow-md text-primary"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Add emoji"
              >
                <BsEmojiSmileFill className="w-6 h-6" />
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
              className="twitter-button bg-primary hover:bg-primary-dark px-8 py-3 text-base font-semibold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending || (!text.trim() && !img)}
            >
              {isPending ? (
                <div className="flex items-center gap-3 justify-center">
                  <div className="loading-spinner w-5 h-5"></div>
                  Posting...
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 z-10">
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setText((prevText) => prevText + emojiObject.emoji);
                  setShowEmojiPicker(false);
                }}
                theme="dark"
              />
            </div>
          )}

          {isError && (
            <div className="mt-3 text-red-500 text-sm font-medium">
              Something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

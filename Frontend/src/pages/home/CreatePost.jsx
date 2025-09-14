import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState } from "react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  // Simulated states
  const isPending = false;
  const isError = false;

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !img) {
      alert("Please write something or upload an image!");
      return;
    }

    // ✅ Later connect with backend API
    alert("Post created successfully");

    // Clear inputs
    setText("");
    setImg(null);
    if (imgRef.current) imgRef.current.value = null;
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      {/* Profile Avatar */}
      <div className="avatar">
        <div className="w-10 rounded-full">
          <img
            src={data.profileImg || "/avatar-placeholder.png"}
            alt="profile"
          />
        </div>
      </div>

      {/* Post Form */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* Text Input */}
        <textarea
          className="w-full text-lg resize-none bg-transparent outline-none border-none"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />

        {/* Uploaded Image Preview */}
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                if (imgRef.current) imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              alt="uploaded"
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          {/* Icons */}
          <div className="flex gap-3 items-center">
            <CiImageOn
              className="text-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="text-primary w-5 h-5 cursor-pointer" />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
            accept="image/*"
          />

          {/* Post Button */}
          <button
            type="submit"
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Error message */}
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;

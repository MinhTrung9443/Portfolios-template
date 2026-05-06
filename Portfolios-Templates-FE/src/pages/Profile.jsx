import { useState, useEffect, useRef } from "react";
import { userAPI } from "../api";

function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    avatarUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const user = response.data.data;
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setMessage({ type: "", text: "" });

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await userAPI.uploadAvatar(uploadData);
      setFormData({ ...formData, avatarUrl: response.data.data.url });
      setMessage({ type: "success", text: "Avatar uploaded successfully! Click Save to apply." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to upload avatar." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await userAPI.updateProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h1>

      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Avatar</label>
          <div className="flex items-center gap-4">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Avatar
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload New Avatar"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;

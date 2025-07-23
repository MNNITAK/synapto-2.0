import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";



export default function Settings() {
  const token = JSON.parse(localStorage.getItem("synapto"))?.token;
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    axios
      .get("http://localhost:5050/api/chat/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
            console.log("User fetched:", res.data); ////////////////////////////
            setCurrentUser(res.data);
            setFormData({ name: res.data.name, bio: res.data.bio || "" });
          } else {
            toast.error("Failed to load user details");
          }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        toast.error("Could not load profile");
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select an image");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true); 
      const res = await axios.patch(
        "http://localhost:5050/api/user/profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile image updated!");
      setCurrentUser(res.data);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload");
    }finally {
        setUploading(false); 
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:5050/api/user/update-details",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated");
      setCurrentUser(res.data);
      setShowEditForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <h2 className="text-3xl font-bold text-[#58a6ff] mb-6">Profile Settings</h2>

      {currentUser && (
        <div className="space-y-6 max-w-xl mx-auto bg-[#161b22] p-6 rounded-xl shadow-lg border border-gray-700">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <img
              src={preview || currentUser.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-600 object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{currentUser.name}</p>
              <p className="text-sm text-gray-400">{currentUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Joined on {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Upload New Image */}
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <button
                onClick={handleUpload}
                className="mt-2 bg-[#238636] px-4 py-2 rounded-full"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload New Image"}
              </button>
            )}
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-lg font-semibold mb-1">Bio</h4>
            <p className="text-gray-300 text-sm">
              {currentUser.bio || "No bio added yet."}
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-[#1f6feb] px-6 py-2 rounded-full font-medium"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#161b22] p-6 rounded-xl w-[90%] max-w-md border border-gray-600 space-y-4">
            <h3 className="text-xl font-bold text-[#58a6ff]">Edit Profile</h3>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 rounded-md bg-[#0d1117] border border-gray-600 text-white"
              placeholder="Username"
            />
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2 rounded-md bg-[#0d1117] border border-gray-600 text-white"
              placeholder="Add a short bio..."
              rows="4"
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditForm(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="bg-[#238636] px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
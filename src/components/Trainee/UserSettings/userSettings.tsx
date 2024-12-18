import React, { useEffect, useState } from "react";
import { fetchUsersApi, updateUserApi } from "../../../api/userApi"; // import the functions
import { useNavigate } from "react-router-dom";

const UserSettings: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // to store user data
  const [isLoading, setIsLoading] = useState<boolean>(true); // to manage loading state
  const [error, setError] = useState<string | null>(null); // to manage error state
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // to manage edit mode
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await fetchUsersApi(); // Fetch the user data
        console.log("User", users);
        const currentUser = users[0]; // Assuming we are fetching the first user or the logged-in user
        setUserData(currentUser); // Set user data in state
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setIsLoading(false); // Set loading to false after the request
      }
    };

    fetchUser(); // Fetch user data on component mount
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData: any) => ({
          ...prevData,
          profilePic: reader.result, // Update the profile picture
        }));
      };
      reader.readAsDataURL(file); // Read the file as base64
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userData) {
        await updateUserApi(userData.id, userData); // Update the user data via API
        alert("User data updated successfully!");
        navigate("/"); // Navigate to the home page or any other page
      }
    } catch (err) {
      setError("Failed to update user data.");
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true); // Enable edit mode
  };

  const handleCancelClick = () => {
    setIsEditMode(false); // Disable edit mode and reset the form
    // Optionally, reset the userData to its original state here if needed
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there is an error
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] mt-10 mb-10">
      <h2 className="text-2xl font-semibold text-center mb-6">User Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Registered ID</label>
          <input
            type="text"
            name="id"
            value={userData?.id || ""}
            onChange={handleChange}
            disabled
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Flexbox for first row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData?.firstName || ""}
              onChange={handleChange}
              disabled={!isEditMode} // Disable input if not in edit mode
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData?.lastName || ""}
              onChange={handleChange}
              disabled={!isEditMode} // Disable input if not in edit mode
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Flexbox for second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData?.email || ""}
              onChange={handleChange}
              disabled={!isEditMode} // Disable input if not in edit mode
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={userData?.dob || ""}
              onChange={handleChange}
              disabled={!isEditMode} // Disable input if not in edit mode
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Flexbox for third row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phno"
              value={userData?.phno || ""}
              onChange={handleChange}
              disabled={!isEditMode} // Disable input if not in edit mode
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={userData?.qualification || ""}
              onChange={handleChange}
              disabled={!isEditMode} // Disable input if not in edit mode
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={userData?.address || ""}
            onChange={handleChange}
            disabled={!isEditMode} // Disable input if not in edit mode
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!isEditMode} // Disable input if not in edit mode
            className="mt-1 block w-full"
          />
          {userData?.profilePic && (
            <img
              src={userData?.profilePic}
              alt="Profile"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>

        {/* Show edit or save/cancel buttons */}
        {!isEditMode ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserSettings;

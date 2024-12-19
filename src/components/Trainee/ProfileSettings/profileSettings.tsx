// import React, { useEffect, useState } from "react";
// import { fetchUsersbyIdApi, updateUserApi } from "../../../api/userApi"; // Import API functions
// import { useDropzone } from "react-dropzone";
// import { useNavigate } from "react-router-dom";

// interface UserSettingsProps {
//   isAuthenticated: boolean;
// }

// const UserSettings: React.FC<UserSettingsProps> = ({ isAuthenticated }) => {
//   const [userData, setUserData] = useState<any>(null);
//   const [originalData, setOriginalData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const storedAuthStatus = localStorage.getItem("isAuthenticated");
//       if (storedAuthStatus !== "true") {
//         navigate("/login");
//         return false;
//       }
//       return true;
//     };

//     if (!checkAuthStatus()) {
//       return;
//     }

//     const fetchUser = async () => {
//       const userIdString = localStorage.getItem("userId");
//       if (!userIdString) {
//         setError("User ID not found in local storage.");
//         setIsLoading(false);
//         return;
//       }

//       const userId = Number(userIdString);
//       if (isNaN(userId)) {
//         setError("Invalid User ID in local storage.");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const user = await fetchUsersbyIdApi(userId);
//         setUserData(user);
//         setOriginalData(user);
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError("Failed to load user data.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const onDrop = (acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     setUploadedFile(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUserData((prevData: any) => ({
//         ...prevData,
//         profilePic: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   // Destructuring getRootProps and getInputProps from useDropzone
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: { "image/*": [] },
//     multiple: false,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setUserData((prevData: any) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUserData((prevData: any) => ({
//           ...prevData,
//           profilePic: reader.result,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (userData) {
//         await updateUserApi(userData.id, userData);
//         alert("User data updated successfully!");
//         setIsEditMode(false);
//       }
//     } catch (err) {
//       console.error("Error updating user data:", err);
//       setError("Failed to update user data.");
//     }
//   };

//   const handleEditClick = () => {
//     setIsEditMode(true);
//   };

//   const handleCancelClick = () => {
//     setIsEditMode(false);
//     setUserData(originalData);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   const formatDate = (dateString: string): string => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] mt-10 mb-10">
//       <h2 className="text-2xl font-semibold text-center mb-6">User Settings</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Registered ID</label>
//           <input
//             type="text"
//             name="id"
//             value={userData?.id || ""}
//             disabled
//             className="mt-1 block w-full p-2 border border-gray-300 rounded"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium">First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={userData?.firstName || ""}
//               onChange={handleChange}
//               disabled={!isEditMode}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={userData?.lastName || ""}
//               onChange={handleChange}
//               disabled={!isEditMode}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={userData?.email || ""}
//               onChange={handleChange}
//               disabled={!isEditMode}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Date of Birth</label>
//             <input
//               type="date"
//               name="dob"
//               value={formatDate(userData?.dateOfBirth || "")}
//               onChange={handleChange}
//               disabled={!isEditMode}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Phone Number</label>
//             <input
//               type="text"
//               name="phno"
//               value={userData?.phoneNumber || ""}
//               onChange={handleChange}
//               disabled={!isEditMode}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Qualification</label>
//             <input
//               type="text"
//               name="qualification"
//               value={userData?.qualification || ""}
//               onChange={handleChange}
//               disabled={!isEditMode}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Address</label>
//           <textarea
//             name="address"
//             value={userData?.address || ""}
//             onChange={handleChange}
//             disabled={!isEditMode}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Profile Picture</label>
//           <div {...getRootProps()} className="mt-1 block w-full border p-2 border-gray-300 rounded">
//             <input {...getInputProps()} accept="image/*" />
//             <p className="text-center text-gray-500">Drag and drop or click to upload</p>
//           </div>
//           {userData?.profilePic && (
//             <img
//               src={userData?.profilePic}
//               alt="Profile"
//               className="mt-2 w-32 h-32 object-cover rounded-full"
//             />
//           )}
//         </div>

//         {!isEditMode ? (
//           <button
//             type="button"
//             onClick={handleEditClick}
//             className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
//           >
//             Edit
//           </button>
//         ) : (
//           <div className="flex justify-center space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//             <button
//               type="button"
//               onClick={handleCancelClick}
//               className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default UserSettings;

import React, { useEffect, useState } from "react";
import { fetchUsersbyIdApi, updateUserApi } from "../../../api/userApi"; // Import API functions
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CameraIcon from "../../../icons/photo-camera.png";


interface ProfileSettingsProps {
  isAuthenticated: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isAuthenticated }) => {
  const [userData, setUserData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedAuthStatus = localStorage.getItem("isAuthenticated");
      if (storedAuthStatus !== "true") {
        navigate("/login");
        return false;
      }
      return true;
    };

    if (!checkAuthStatus()) {
      return;
    }

    const fetchUser = async () => {
      const userIdString = localStorage.getItem("userId");
      if (!userIdString) {
        setError("User ID not found in local storage.");
        setIsLoading(false);
        return;
      }

      const userId = Number(userIdString);
      if (isNaN(userId)) {
        setError("Invalid User ID in local storage.");
        setIsLoading(false);
        return;
      }

      try {
        const user = await fetchUsersbyIdApi(userId);
        setUserData(user);
        setOriginalData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prevData: any) => ({
        ...prevData,
        profilePic: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle file change and preview the image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userData) {
        await updateUserApi(userData.id, userData);
        toast("Your profile details have been updated successfully!");
        setIsEditMode(false);
      }
    } catch (err) {
      console.error("Error updating user data:", err);
      toast("There was an issue updating your profile. Please try again");

      setError("Failed to update user data.");
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setUserData(originalData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-[1400px] mt-20 mb-20 font-metropolis">
      <div className="bg-settings-gradient p-16 rounded-lg">
        <h2 className="text-2xl font-semibold text-center">Profile Settings</h2>
      </div>

      <div className="grid grid-cols-2 mt-10 mb-10">
        <div className="w-[150px] h-[150px]">
          <div className="w-full h-full max-w-[150px] max-h-[150px] bg-[#84c6e9] rounded-full relative">
            <div
              className={`w-full h-full rounded-full ${
                imagePreview ? "bg-cover bg-center" : "bg-[#6eafd4]"
              } `}
              style={
                imagePreview ? { backgroundImage: `url(${imagePreview})` } : {}
              }
            >
              <div className="bg-white w-[50px] h-[50px] rounded-full absolute bottom-0 right-0 hover:bg-gray-300 border-2 border-black shadow-sm">
                <input
                  className="opacity-0 w-[50px] h-[50px] absolute z-10"
                  type="file"
                  name="pic"
                  accept="image/*"
                  onChange={handleFileChange} // Handle file selection
                  disabled={!isEditMode} // Disable the file input unless in edit mode
                />
                <label className="text-center text-white w-[50px] h-[50px] flex justify-center items-center cursor-pointer">
                  <img src={CameraIcon} alt="Upload Icon" className="w-7 h-7" />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* User Details Section */}
        <div className="flex flex-col justify-center -ml-[450px]">
          <h1 className="text-lg font-semibold">{`${userData.firstName} ${userData.lastName}`}</h1>
          <h2 className="text-sm text-gray-600">{userData.email}</h2>
          <h3 className="text-sm text-gray-500">
            Registered ID: {userData.id}
          </h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData?.firstName || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData?.lastName || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formatDate(userData?.dateOfBirth || "")}
              onChange={handleChange}
              disabled={!isEditMode}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={userData?.phoneNumber || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={userData?.qualification || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={userData?.address || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter your address here"
            />
          </div>
        </div>

        {/* Buttons */}
        {!isEditMode ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
          >
            Edit
          </button>
        ) : (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;

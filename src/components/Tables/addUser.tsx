import { Button } from "../../components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    id: Date.now(),
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phone: "",
    password: "",
    address: "",
    qualification: "",
    dateOfJoining: "",
    skills: "",
    enrolledCourses: "",
    role: "Trainee", // default role
    accountStatus: "Active", // default status
    lastLogin: "",
  });

  const navigate = useNavigate();

  const handleFormSubmit = () => {
    // Handle user addition
    const userData = { ...newUser, id: Date.now() }; // Create a new user with unique ID

    toast.success("User added successfully!");

    if (newUser.role === "Admin") {
      navigate("/admin", { state: { user: userData } });
    } else if (newUser.role === "Finance") {
      navigate("/finance", { state: { user: userData } });
    } else if (newUser.role === "Trainer") {
      navigate("/trainers", { state: { user: userData } });
    } else {
      // Handle role-based navigation here, or just close the modal
      navigate("/trainees", { state: { user: userData } });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const roleOptions = ["Trainee", "Trainer", "Admin", "Finance"];
  const accountStatusOptions = ["Active", "Inactive", "Suspended"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <form>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full border rounded p-2"
                value={newUser.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full border rounded p-2"
                value={newUser.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border rounded p-2"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">DOB</label>
              <input
                type="date"
                name="dob"
                className="w-full border rounded p-2"
                value={newUser.dob}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full border rounded p-2"
                value={newUser.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Qualification</label>
              <input
                type="text"
                name="qualification"
                className="w-full border rounded p-2"
                value={newUser.qualification}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                className="w-full border rounded p-2"
                value={newUser.dateOfJoining}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Skills</label>
              <input
                type="text"
                name="skills"
                className="w-full border rounded p-2"
                value={newUser.skills}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Enrolled Courses</label>
              <input
                type="text"
                name="enrolledCourses"
                className="w-full border rounded p-2"
                value={newUser.enrolledCourses}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block font-medium">Role</label>
              <select
                name="role"
                className="w-full border rounded p-2"
                value={newUser.role}
                onChange={handleInputChange}
              >
                {roleOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Account Status</label>
              <select
                name="accountStatus"
                className="w-full border rounded p-2"
                value={newUser.accountStatus}
                onChange={handleInputChange}
              >
                {accountStatusOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => navigate("/")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

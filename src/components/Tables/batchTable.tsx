import { useState, useEffect, ReactNode } from "react";
import { Button } from "../../components/ui/button";
import "react-day-picker/dist/style.css";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";
import { fetchCourseApi } from "@/api/courseApi";

import {
  fetchBatchApi,
  createBatchApi,
  updateBatchApi,
  deleteBatchApi,
} from "@/api/batchApi";
import { fetchUsersApi } from "@/api/userApi";

// TypeScript types for the component props
interface BatchTableProps {
  editable?: boolean;
}

// TypeScript types for batch data
interface BatchData {
  id: number;
  batchName: string;
  courseId: number;
  courseName: string;
  traineeId: number[]; // Changed to array
  traineeName: string[]; // Changed to array
  startDate: string;
  endDate: string;
}


interface batchOptions {
  id: any;
  courseName: any;
  traineeName: any;
}


// Helper to get token
const getToken = () => localStorage.getItem("authToken");

const ManageBatches = ({ editable = true }: BatchTableProps) => {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [course, setCourse] = useState<batchOptions[]>([]);
  const [traineeName, setTraineeName] = useState<batchOptions[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<BatchData | null>(null);
  const [newBatch, setNewBatch] = useState<BatchData>({
    id: 0,
    batchName: "",
    courseId: 0,
    courseName: "",
    traineeId: [],
    traineeName: [],
    startDate: "",
    endDate: "",
  });


  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!newBatch.batchName) newErrors.batchName = "Batch name is required.";
    if (!newBatch.courseId) newErrors.courseId = "course is required.";
    if (!newBatch.traineeId) newErrors.traineeId = "trainee is required.";
    if (!newBatch.startDate) newErrors.startDate = "Start date is required.";
    if (!newBatch.endDate) newErrors.endDate = "End date is required.";

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`);
    });

    return newErrors;
  };

  const fetchBatchesData = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to view batches.");
      return;
    }

    try {
      const response = await fetchBatchApi();
      const batches = response.map((batch: any) => ({
        id: batch.id,
        batchName: batch.batchName,
        courseId: batch.course?.id || 0,
        courseName: batch.course?.courseName || "Unknown", // Course Name
        traineeName: batch.trainees
          ? batch.trainees
            .map((trainee: any) => `${trainee.firstName} ${trainee.lastName}`)
            .join(", ")
          : "Unknown",
        startDate: batch.startDate,
        endDate: batch.endDate,
      }));


      const responseCourse = await fetchCourseApi();
      const courses = responseCourse.map((course: any) => ({
        id: course.id,
        courseName: course.courseName,
      }));
      setCourse(courses);

      const responseUser = await fetchUsersApi();
      const trainees = responseUser.Users.filter(
        (user: any) => user.role.name === "trainee"
      ).map((trainee: any) => ({
        id: trainee.id,
        traineeName: `${trainee.firstName} ${trainee.lastName}`, // Full Name
      }));
      setTraineeName(trainees);

      setBatches(batches);
    } catch (error) {
      console.error("Error fetching or processing users:", error);
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBatchesData();
  }, []);

  const addNewBatch = () => {
    setEditing(false);
    setNewBatch({
      id: 0,
      batchName: "",
      courseId: 0,
      courseName: "",
      traineeId: [],
      traineeName: [],
      startDate: "",
      endDate: "",
    });
    setIsModalOpen(true);
  };

  const confirmDeleteBatch = (data: BatchData) => {
    const batch = batches.find((batch) => batch.id === data.id);
    if (batch) {
      setBatchToDelete(batch);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) {
      toast.error("No batch selected for deletion.");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to delete a course.");
      return;
    }

    try {
      await deleteBatchApi(batchToDelete.id);

      setBatches((prev) =>
        prev.filter((batch) => batch.id !== batchToDelete.id));
      toast.success("Batch deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the batch. Please try again later.");
    } finally {
      setDeleteModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBatchToDelete(null);
  };


  const editBatch = (data: any) => {
    const batchToEdit = batches.find((batch) => batch.id === data.data.id);
    console.log("Batch to edit:", batchToEdit);
    if (batchToEdit) {
      setEditing(true);
      setNewBatch({
        ...batchToEdit,
        startDate: batchToEdit.startDate
          ? format(new Date(batchToEdit.startDate), "yyyy-MM-dd")
          : "",
        endDate: batchToEdit.endDate
          ? format(new Date(batchToEdit.endDate), "yyyy-MM-dd")
          : "",
      });
      setIsModalOpen(true);
    } else {
      toast.error("Batch not found for editing.");
    }
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewBatch({
      id: 0,
      batchName: "",
      courseId: 0,
      courseName: "",
      traineeId: [],
      traineeName: [],
      startDate: "",
      endDate: "",
    });
  };

  const handleFormSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      return; // Stop further execution if errors exist
    }

    const batchToSubmit = {
      batchName: newBatch.batchName,
      courseId: newBatch.courseId,
      traineeIds: newBatch.traineeId, // Send as an array
      startDate: newBatch.startDate,
      endDate: newBatch.endDate,
    };

    try {

      if (editing) {

        const updatedBatch = await updateBatchApi(newBatch.id, batchToSubmit);
        fetchBatchesData();

        setBatches((prev) =>
          prev.map((batch) =>
            batch.id === newBatch.id ? { ...batch, ...updatedBatch } : batch
          )
        );
        toast.success("Batch updated successfully!");
      } else {
        const newBatchData = await createBatchApi(batchToSubmit);
        fetchBatchesData();
        setBatches((prev) => [...prev, newBatchData]);
        toast.success("Batch added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add the batch. Please try again later.");
    }
    handleModalClose();
  };

  useEffect(() => {
    setColDefs([
      {
        headerName: "Batch Name",
        field: "batchName",
        editable: false,
        width: 200,
      },
      {
        headerName: "Course Name",
        field: "courseName",
        editable: false,
        width: 200,
      },
      {
        headerName: "Trainee Names",
        field: "traineeName",
        editable: false,
        width: 200,
      },
      {
        headerName: "Start Date",
        field: "startDate",
        editable: false,
        valueFormatter: (params) =>
          params.value ? format(new Date(params.value), "yyyy-MM-dd") : "",

        width: 200,
      },
      {
        headerName: "End Date",
        field: "endDate",
        editable: false,
        valueFormatter: (params) =>
          params.value ? format(new Date(params.value), "yyyy-MM-dd") : "",
        width: 200,
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 200,
        cellRenderer: (params: any) => {
          console.log("Editing batch data:", params.data);
          return (
            <div className="flex space-x-2">
              <Button onClick={() => editBatch(params)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                <Edit className="h-5 w-5" />
              </Button>
              <Button onClick={() => confirmDeleteBatch(params.data)} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          );
        },
        editable: false,
      },
    ]);
  }, [batches]);

  const uniqueCourse = Array.from(
    new Map(batches.map((batch) => [batch.courseName, batch.courseId]))
  );

  return (
    <div className="flex-1 p-4 mt-10 ml-24">
      <div className="flex items-center justify-between bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[1147px]">
        <div className="flex flex-col">
          <h2 className="text-2xl font-metropolis font-semibold tracking-wide">
            Batches
          </h2>
          <p className="text-sm font-metropolis font-medium">
            Manage batches easily.
          </p>
        </div>
        <Button
          onClick={addNewBatch}
          className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          + New Batch
        </Button>
      </div>

      {isDeleteModalOpen && batchToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
            <h2 className="text-xl font-metropolis font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4 font-metropolis font-medium">
              Are you sure you want to delete the Batch {" "}
              <strong>
                {batchToDelete?.batchName?.charAt(0).toUpperCase() +
                  batchToDelete?.batchName?.slice(1).toLowerCase() || "this batchname"}
              </strong>
              ?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={handleCancelDelete}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteBatch}
                className="bg-custom-gradient-btn text-white px-4 py-2 
                transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      <div
        className="ag-theme-quartz text-left"
        style={{ height: "calc(100vh - 180px)", width: "88%" }}
      >
        <AgGridReact
          rowSelection="multiple"
          suppressRowClickSelection
          suppressMovableColumns
          loading={loading}
          columnDefs={colDefs}
          rowData={batches}
          defaultColDef={{
            editable,
            sortable: true,
            filter: true,
            resizable: true,
          }}
          animateRows
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-metropolis font-semibold mb-4 text-center">
              {editing ? "Edit Batch" : "Add New Batch"}
            </h2>
            <form>
              <div className="mb-4 mt-4">
                <label className="block font-metropolis font-medium mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newBatch.batchName}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, batchName: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block font-metropolis font-medium mb-2">
                  Courses
                </label>
                <select
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newBatch.courseId}
                  onChange={(e) =>
                    setNewBatch({
                      ...newBatch, courseId: parseInt(e.target.value),
                      courseName:
                        uniqueCourse.find(([_, id]) => id === parseInt(e.target.value))?.[0] || "",
                    })
                  }
                >
                  <option value="">Select Course</option>
                  {course.map((course) => (
                    <option key={course.courseName} value={course.id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium mb-2">
                  Trainees
                </label>
                <select
                  multiple
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={(newBatch.traineeId || []).map((id) => id.toString())} // Guard against undefined
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions);
                    const ids = selectedOptions.map((option) => parseInt(option.value)); // Convert back to number[]
                    const names = selectedOptions.map((option) => option.text);
                    setNewBatch({ ...newBatch, traineeId: ids, traineeName: names });
                  }}
                >
                  <option value="">Select Trainees</option>
                  {(traineeName || []).map((trainee) => (
                    <option key={trainee.id} value={trainee.id.toString()}>
                      {trainee.traineeName}
                    </option>
                  ))}
                </select>

              </div>


              {/* Row for Start Date and End Date */}
              <div className="mb-4">
                <label className="block font-metropolis font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newBatch.startDate}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, startDate: e.target.value })
                  }
                />
                {errors.startDate && (
                  <span className="text-red-500 text-sm">
                    {errors.startDate}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block font-metropolis font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newBatch.endDate}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, endDate: e.target.value })
                  }
                />
                {errors.endDate && (
                  <span className="text-red-500 text-sm">
                    {errors.endDate}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleFormSubmit}
                  className="bg-custom-gradient-btn text-white px-4 py-2 
                transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                >
                  {editing ? "Update Batch" : "Create Batch"}
                </Button>
                <Button
                  onClick={handleModalClose}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatches;
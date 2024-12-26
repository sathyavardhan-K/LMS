import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import "react-day-picker/dist/style.css";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

import {
  fetchBatchApi,
  createBatchApi,
  updateBatchApi,
  deleteBatchApi,
} from "@/api/batchApi";

// TypeScript types for the component props
interface BatchTableProps {
  editable?: boolean;
}

// TypeScript types for batch data
interface BatchData {
  id: number;
  batchName: string;
  shiftTime: string;
  startDate: string;
  endDate: string;
}

// Column definitions type from AG-Grid
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";

// Helper to get token
const getToken = () => localStorage.getItem("authToken");

const ManageBatches = ({ editable = true }: BatchTableProps) => {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<BatchData | null>(null);
  const [newBatch, setNewBatch] = useState<BatchData>({
    id: 0,
    batchName: "",
    shiftTime: "",
    startDate: "",
    endDate: "",
  });


  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!newBatch.batchName) newErrors.batchName = "Batch name is required.";
    if (!newBatch.shiftTime) newErrors.shiftTime = "Shift time is required.";
    if (!newBatch.startDate) newErrors.startDate = "Start date is required.";
    if (!newBatch.endDate) newErrors.endDate = "End date is required.";

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`);
    });

    return newErrors;
  };

  // Fetch batches
  const fetchBatchesData = async () => {
    try {
      const batchesData = await fetchBatchApi();
      console.log("Fetched batches:", batchesData);
      setBatches(batchesData || []);
    } catch (error) {
      console.error("Failed to fetch batches", error);
      toast.error("Failed to fetch batches. Please try again later.");
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
      shiftTime: "",
      startDate: "",
      endDate: "",
    });
    setIsModalOpen(true);
  };

  const deleteBatchData = async () => {
    if (!batchToDelete) {
      toast.error("No batch selected for deletion.");
      return;
    }

    try {
      await deleteBatchApi(batchToDelete.id);

      setBatches((prev) =>
        prev.filter((batch) => batch.id !== batchToDelete.id)
      );
      toast.success("Batch deleted successfully!");
    } catch (error) {
      console.error("Failed to delete batch", error);
      toast.error("Failed to delete the batch. Please try again later.");
    } finally {
      setDeleteModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const confirmDelete = (params: any) => {
    if (!params || !params.data) {
      console.error("Invalid data passed to confirmDelete:", params);
      toast.error("Batch not found.");
      return;
    }

    const batch = batches.find((b) => b.id === params.data.id);
    if (batch) {
      setBatchToDelete(batch);
      setDeleteModalOpen(true);
    } else {
      console.error("Batch not found for deletion.");
      toast.error("Batch not found.");
    }
  };

  const editBatch = (data: any) => {
    const batchToEdit = batches.find((batch) => batch.id === data.data.id);
    console.log("Batch to edit:", batchToEdit);
    if (batchToEdit) {
      setEditing(true);
      setNewBatch({
        ...batchToEdit,
        // Convert dates to the format required by <input type="date">
        startDate: batchToEdit.startDate
          ? format(new Date(batchToEdit.startDate), "yyyy-MM-dd")
          : "",
        endDate: batchToEdit.endDate
          ? format(new Date(batchToEdit.endDate), "yyyy-MM-dd")
          : "",
      });
      setIsModalOpen(true);
    }
  };
  
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewBatch({
      id: 0,
      batchName: "",
      shiftTime: "",
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

    if (editing) {
      if (!newBatch.id) {
        console.error("Batch ID is missing for update.");
        toast.error("Batch ID is missing.");
        return;
      }

      try {
        const updatedBatch = await updateBatchApi(newBatch.id, newBatch);

        console.log("updateBatch:", updatedBatch);
        setBatches((prev) =>
          prev.map((batch) => (batch.id === newBatch.id ? updatedBatch : batch))
        );

        toast.success("Batch updated successfully!");
      } catch (error) {
        console.error("Failed to update batch", error);
        toast.error("Failed to update the batch. Please try again later.");
      }
    } else {
      try {
        const newBatchData = await createBatchApi(newBatch);
        toast.success("Batch added successfully!");
        setBatches((prev) => [...prev, newBatchData]);
      } catch (error) {
        console.error("Failed to add batch", error);
        toast.error("Failed to add the batch. Please try again later.");
      }
    }

    await fetchBatchesData();
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
        headerName: "Shift Time",
        field: "shiftTime",
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
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button
              onClick={() => editBatch(params)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => confirmDelete(params)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ),
        editable: false,
      },
    ]);
  }, [batches]);

  const closeDeleteModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteModalOpen(false); // Close the delete modal
    setBatchToDelete(null); // Clear the batch to delete
  };

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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] max-w-full">
            <h2 className="text-xl font-metropolis font-semibold mb-4 text-center">
              {editing ? "Edit Batch" : "Add New Batch"}
            </h2>
            <form>
              {/* Row for Batch Name and Shift Time */}
              <div className="flex justify-between gap-4 mb-4">
                <div className="flex-1">
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
                  {errors.batchName && (
                    <span className="text-red-500 text-sm">
                      {errors.batchName}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block font-metropolis font-medium mb-2">
                    Shift Time
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                    value={newBatch.shiftTime}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, shiftTime: e.target.value })
                    }
                  />
                  {errors.shiftTime && (
                    <span className="text-red-500 text-sm">
                      {errors.shiftTime}
                    </span>
                  )}
                </div>
              </div>

              {/* Row for Start Date and End Date */}
              <div className="flex justify-between gap-4 mb-4">
                <div className="flex-1">
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

                <div className="flex-1">
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
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
             rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-custom-gradient-btn text-white px-4 py-2 
            transition-all duration-500 ease-in-out 
           rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                  onClick={handleFormSubmit}
                >
                  {editing ? "Update Batch" : "Add Batch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-full">
            <h2 className="text-xl font-metropolis font-semibold mb-4 text-center">
              Confirm Deletion
            </h2>
            <p className="mb-4 text-center">
              Are you sure you want to delete this batch?
            </p>
            <div className="flex gap-4 justify-end mt-5">
              <Button
                type="button"
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-custom-gradient-btn text-white px-4 py-2 
                transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                onClick={deleteBatchData}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatches;

import { Button } from "../ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { ColDef } from "ag-grid-community";

import {
  createBatchModuleScheduleApi,
  fetchBatchModuleScheduleApi,
  updateBatchModuleScheduleApi,
  deleteBatchModuleScheduleApi,
} from "@/api/batchModuleScheduleApi";

import { fetchBatchApi } from "@/api/batchApi";
import { fetchCourseModuleApi } from "@/api/courseModuleApi";
import { fetchUsersApi } from "@/api/userApi";

interface BatchModuleScheduleTableProps {
  editable?: boolean;
}

interface ScheduleData {
  id: number;
  batchId: number;
  batchName: string;
  moduleId: number;
  moduleName: string;
  trainerId: number;
  trainerName: string;
  scheduleDateTime: string;
  duration: number;
}

interface Options {
  id: number;
  name: string;
}

const getToken = () => localStorage.getItem("authToken");

const BatchModuleScheduleTable = ({ editable = true }: BatchModuleScheduleTableProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [batches, setBatches] = useState<Options[]>([]);
  const [modules, setModules] = useState<Options[]>([]);
  const [trainers, setTrainers] = useState<Options[]>([]);
  const [newSchedule, setNewSchedule] = useState<ScheduleData>({
    id: 0,
    batchId: 0,
    batchName: "",
    moduleId: 0,
    moduleName: "",
    trainerId: 0,
    trainerName: "",
    scheduleDateTime: "",
    duration: 0,
  });

  const fetchSchedules = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to view schedules.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Fetch each API call sequentially
      const schedulesResponse = await fetchBatchModuleScheduleApi();
      console.log("Schedules Response:", schedulesResponse);
  
      const batchResponse = await fetchBatchApi();
      console.log("Batch Response:", batchResponse);
  
      const moduleResponse = await fetchCourseModuleApi();
      console.log("Module Response:", moduleResponse);
  
      const userResponse = await fetchUsersApi();
      console.log("User Response:", userResponse);
  
      // Check for valid responses
      if (!schedulesResponse || !batchResponse || !moduleResponse || !userResponse) {
        throw new Error("One of the responses is empty.");
      }
  
      // Process the responses and update the state
      const schedules = schedulesResponse.map((schedule: any) => ({
        id: schedule.id,
        batchId: schedule.batchId,
        batchName: schedule.batch?.batchName || "Unknown Batch",
        moduleId: schedule.moduleId,
        moduleName: schedule.module?.moduleName || "Unknown Module",
        trainerId: schedule.trainerId,
        trainerName: schedule.trainer
          ? `${schedule.trainer.firstName} ${schedule.trainer.lastName}`
          : "Unknown Trainer",
        scheduleDateTime: schedule.scheduleDateTime,
        duration: schedule.duration,
      }));
  
      setScheduleData(schedules);
      setBatches(batchResponse.map((batch: any) => ({ id: batch.id, name: batch.batchName })));
      setModules(moduleResponse.map((module: any) => ({ id: module.id, name: module.moduleName })));
      setTrainers(
        userResponse.Users.filter((user: any) =>
          user.role.some((role: any) => role.name.toLowerCase() === "trainer")
        ).map((trainer: any) => ({
          id: trainer.id,
          name: `${trainer.firstName} ${trainer.lastName}`,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      toast.error("Failed to fetch schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleFormSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      if (editing) {
        await updateBatchModuleScheduleApi(newSchedule.id, {
          batchId: newSchedule.batchId,
          moduleId: newSchedule.moduleId,
          trainerId: newSchedule.trainerId,
          scheduleDateTime: newSchedule.scheduleDateTime,
          duration: newSchedule.duration,
        });
        toast.success("Schedule updated successfully!");
      } else {
        await createBatchModuleScheduleApi({
          batchId: newSchedule.batchId,
          moduleId: newSchedule.moduleId,
          trainerId: newSchedule.trainerId,
          scheduleDateTime: newSchedule.scheduleDateTime,
          duration: newSchedule.duration,
        });
        toast.success("Schedule created successfully!");
      }
      fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit schedule", error);
      toast.error("Failed to submit schedule. Please try again later.");
    }
  };

  const handleEditSchedule = (params: any) => {
    setEditing(true);
    setNewSchedule(params.data);
    setIsModalOpen(true);
  };

  const handleDeleteSchedule = async (schedule: ScheduleData) => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      await deleteBatchModuleScheduleApi(schedule.id);
      toast.success("Schedule deleted successfully!");
      fetchSchedules();
    } catch (error) {
      console.error("Failed to delete schedule", error);
      toast.error("Failed to delete schedule. Please try again later.");
    }
  };

  useEffect(() => {
    setColDefs([
      { headerName: "Batch", field: "batchName", editable: false },
      { headerName: "Module", field: "moduleName", editable: false },
      { headerName: "Trainer", field: "trainerName", editable: false },
      { headerName: "Schedule DateTime", field: "scheduleDateTime", editable: false },
      { headerName: "Duration", field: "duration", editable: false },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleEditSchedule(params)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              <Edit className="h-5 w-4" />
            </Button>
            <Button
              onClick={() => handleDeleteSchedule(params.data)}
              className="bg-red-500 p-2 rounded hover:bg-red-700 text-white"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ),
        editable: false,
      },
    ]);
  }, [scheduleData]);

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Batch Module Schedule</h2>
          <p className="text-sm">Manage batch module schedules easily.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300">
          + New Schedule
        </Button>
      </div>
      <div className="ag-theme-quartz" style={{ height: "70vh", width: "100%" }}>
        <AgGridReact
          rowSelection="multiple"
          suppressRowClickSelection
          suppressMovableColumns
          loading={loading}
          columnDefs={colDefs}
          rowData={scheduleData}
          defaultColDef={{ editable, sortable: true, filter: true, resizable: true }}
          animateRows
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">{editing ? "Edit Schedule" : "Add New Schedule"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
              className="space-y-4"
            >
              {/* Batch Selector */}
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                  Batch
                </label>
                <select
                  id="batch"
                  value={newSchedule.batchId}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, batchId: Number(e.target.value) })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Module Selector */}
              <div>
                <label htmlFor="module" className="block text-sm font-medium text-gray-700">
                  Module
                </label>
                <select
                  id="module"
                  value={newSchedule.moduleId}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, moduleId: Number(e.target.value) })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trainer Selector */}
              <div>
                <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
                  Trainer
                </label>
                <select
                  id="trainer"
                  value={newSchedule.trainerId}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, trainerId: Number(e.target.value) })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule DateTime */}
              <div>
                <label htmlFor="scheduleDateTime" className="block text-sm font-medium text-gray-700">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="scheduleDateTime"
                  value={newSchedule.scheduleDateTime}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, scheduleDateTime: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={newSchedule.duration}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, duration: Number(e.target.value) })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchModuleScheduleTable;

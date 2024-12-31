import { Button } from "../ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React, { useEffect, useState, ReactNode } from "react";
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

type BatchModuleScheduleTableProps = {
  editable?: boolean;
};

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
  firstName: ReactNode;
  lastName: ReactNode;
  id: any;
  batchName: any;
  moduleName: any;
  trainerName: any;
}

const getToken = () => localStorage.getItem("authToken");

const formatDateForAPI = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  
  // Check if it's a valid date
  if (isNaN(date.getTime())) {
    toast.error("Invalid date format.");
    return '';
  }
  
  return date.toISOString().slice(0, 19).replace('T', ' '); // Format as YYYY-MM-DD HH:mm:ss
};

const formatDateForInput = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  return dateTimeString.replace(' ', 'T');
};

const BatchModuleScheduleTable = ({
  editable = true,
}: BatchModuleScheduleTableProps) => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [batches, setBatches] = useState<Options[]>([]);
  const [modules, setModules] = useState<Options[]>([]);
  const [trainers, setTrainers] = useState<Options[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleData | null>(null);
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

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
  
    if (!newSchedule.batchId) newErrors.batchName = "Batch selection is required.";
    if (!newSchedule.moduleId) newErrors.moduleName = "Module selection is required.";
    if (!newSchedule.trainerId) newErrors.trainerName = "Trainer selection is required.";
    if (!newSchedule.scheduleDateTime) newErrors.scheduleDateTime = "Schedule date and time is required.";
    else if (!isValidDate(newSchedule.scheduleDateTime)) {
      newErrors.scheduleDateTime = "Schedule Date must be a valid date.";
    }
    if (!newSchedule.duration || newSchedule.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0.";
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
      });
      return false;
    }
    return true;
  };
  
  const fetchSchedules = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to view schedules.");
      return;
    }

    try {
      const schedulesResponse = await fetchBatchModuleScheduleApi();

      const schedules = schedulesResponse.map((schedule: any) => ({
        id: schedule.id,
        batchId: schedule.batchId,
        batchName: schedule.batch?.batchName || "Unknown Batch",
        moduleId: schedule.moduleId,
        moduleName: schedule.module?.moduleName || "Unknown Module",
        trainerId: schedule.trainerId,
        trainerName:
          `${schedule.trainer.firstName} ${schedule.trainer.lastName}` ||
          "Unknown Trainer",
        scheduleDateTime: schedule.scheduleDateTime,
        duration: schedule.duration,
      }));

      const batchResponse = await fetchBatchApi();
      const batches = batchResponse.map((batch: any) => ({
        id: batch.id,
        batchName: batch.batchName,
      }));
      setBatches(batches);

      const moduleResponse = await fetchCourseModuleApi();
      const modules = moduleResponse.map((module: any) => ({
        id: module.id,
        moduleName: module.moduleName,
      }));
      setModules(modules);

      const responseUser = await fetchUsersApi();
      const trainers = responseUser.Users.filter(
        (user: any) => user.role.name === "trainer"
      );

      if (Array.isArray(trainers)) {
        setTrainers(trainers);
      } else {
        toast.error("Failed to load trainers.");
      }
      setSchedules(schedules);
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

  const addNewSchedule = () => {
    setEditing(false);
    setNewSchedule({
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
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
  
    if (!validateFields()) return;
  
    try {
      // Ensure the scheduleDateTime is in the correct format
      const formattedDateTime = formatDateForAPI(newSchedule.scheduleDateTime);
  
      // Log the formatted date for debugging
      console.log("Formatted DateTime: ", formattedDateTime);
      
      // Check if the date is valid
      if (!isValidDate(formattedDateTime)) {
        toast.error("Invalid schedule date.");
        return;
      }
  
      const scheduleToSubmit = {
        batchId: newSchedule.batchId,
        moduleId: newSchedule.moduleId,
        trainerId: newSchedule.trainerId,
        scheduleDateTime: formattedDateTime,
        duration: newSchedule.duration,
      };
  
      if (editing) {
        const updateSchedule = await updateBatchModuleScheduleApi(
          newSchedule.id,
          scheduleToSubmit
        );
  
        if (updateSchedule) {
          await fetchSchedules();
          toast.success("Schedule updated successfully!");
        }
      } else {
        const newScheduleData = await createBatchModuleScheduleApi(
          scheduleToSubmit
        );
  
        if (newScheduleData) {
          await fetchSchedules();
          toast.success("Schedule created successfully!");
        }
      }
      handleModalClose();
    } catch (error: any) {
      console.error("Failed to submit schedule", error);
  
      let errorMessage = "Failed to submit schedule. Please try again later.";
      if (error.response?.data?.hint?.field) {
        errorMessage = error.response.data.hint.field;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
  
      toast.error(errorMessage);
    }
  };
  

  const confirmDeleteSchedule = (data: ScheduleData) => {
    const schedule = schedules.find((schedule) => schedule.id === data.id);
    if (schedule) {
      setScheduleToDelete(schedule);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) {
      toast.error("No schedule selected for deletion.");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      await deleteBatchModuleScheduleApi(scheduleToDelete.id);
      await fetchSchedules();
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      console.error("Failed to delete schedule", error);
      toast.error("Failed to delete schedule. Please try again later.");
    } finally {
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  };

  const editSchedule = (params: any) => {
    const scheduleToEdit = schedules.find(
      (schedule) => schedule.id === params.data.id
    );
    
    if (scheduleToEdit) {
      setEditing(true);
      setNewSchedule({
        ...scheduleToEdit,
        scheduleDateTime: formatDateForInput(scheduleToEdit.scheduleDateTime),
      });
      setIsModalOpen(true);
    } else {
      toast.error("Schedule not found for editing.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewSchedule({
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
    setErrors({});
  };

  useEffect(() => {
    setColDefs([
      { headerName: "Batch Name", field: "batchName", editable: false },
      { headerName: "Module Name", field: "moduleName", editable: false },
      { headerName: "Trainer Name", field: "trainerName", editable: false },
      {
        headerName: "Schedule DateTime",
        field: "scheduleDateTime",
        editable: false,
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return date.toLocaleString();
        }
      },
      { 
        headerName: "Duration (hours)", 
        field: "duration", 
        editable: false,
        valueFormatter: (params: any) => {
          return `${params.value} hr${params.value !== 1 ? 's' : ''}`;
        }
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 200,
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button
              onClick={() => editSchedule(params)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => confirmDeleteSchedule(params.data)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ),
        editable: false,
      },
    ]);
  }, [schedules]);

  return (
    <div className="flex-1 p-4 mt-10 ml-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Batch Module Schedule</h1>
        {editable && (
          <Button
            onClick={addNewSchedule}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add New Schedule
          </Button>
        )}
      </div>

      <div className="ag-theme-quartz mt-4" style={{ height: 500 }}>
        <AgGridReact
          rowData={schedules}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Add'} Schedule</h2>
            <div className="mb-4">
              <label htmlFor="batch" className="block text-sm font-medium">Batch</label>
              <select
                id="batch"
                className="mt-1 p-2 w-full border rounded"
                value={newSchedule.batchId}
                onChange={(e) => setNewSchedule({ ...newSchedule, batchId: +e.target.value })}
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
              {errors.batchName && <p className="text-red-500 text-sm">{errors.batchName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="module" className="block text-sm font-medium">Module</label>
              <select
                id="module"
                className="mt-1 p-2 w-full border rounded"
                value={newSchedule.moduleId}
                onChange={(e) => setNewSchedule({ ...newSchedule, moduleId: +e.target.value })}
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.moduleName}
                  </option>
                ))}
              </select>
              {errors.moduleName && <p className="text-red-500 text-sm">{errors.moduleName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="trainer" className="block text-sm font-medium">Trainer</label>
              <select
                id="trainer"
                className="mt-1 p-2 w-full border rounded"
                value={newSchedule.trainerId}
                onChange={(e) => setNewSchedule({ ...newSchedule, trainerId: +e.target.value })}
              >
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.firstName} {trainer.lastName}
                  </option>
                ))}
              </select>
              {errors.trainerName && <p className="text-red-500 text-sm">{errors.trainerName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="scheduleDateTime" className="block text-sm font-medium">Schedule Date & Time</label>
              <input
                type="datetime-local"
                id="scheduleDateTime"
                className="mt-1 p-2 w-full border rounded"
                value={newSchedule.scheduleDateTime}
                onChange={(e) => setNewSchedule({ ...newSchedule, scheduleDateTime: e.target.value })}
              />
              {errors.scheduleDateTime && <p className="text-red-500 text-sm">{errors.scheduleDateTime}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium">Duration (hours)</label>
              <input
                type="number"
                id="duration"
                className="mt-1 p-2 w-full border rounded"
                value={newSchedule.duration}
                onChange={(e) => setNewSchedule({ ...newSchedule, duration: +e.target.value })}
                
              />
              {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleModalClose}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Delete Schedule</h2>
            <p className="text-sm">Are you sure you want to delete this schedule?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSchedule}
                className="bg-red-500 text-white p-2 rounded"
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

export default BatchModuleScheduleTable;

// import { Button } from "../ui/button";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import React, { useEffect, useState, ReactNode } from "react";
// import { toast } from "sonner";
// import { Edit, Trash } from "lucide-react";
// import { ColDef } from "ag-grid-community";

// import {
//   createBatchModuleScheduleApi,
//   fetchBatchModuleScheduleApi,
//   updateBatchModuleScheduleApi,
//   deleteBatchModuleScheduleApi,
// } from "@/api/batchModuleScheduleApi";

// import { fetchBatchApi } from "@/api/batchApi";
// import { fetchCourseModuleApi } from "@/api/courseModuleApi";
// import { fetchUsersApi } from "@/api/userApi";

// type BatchModuleScheduleTableProps = {
//   editable?: boolean;
// };

// interface ScheduleData {
//   id: number;
//   batchId: number;
//   batchName: string;
//   moduleId: number;
//   moduleName: string;
//   trainerId: number;
//   trainerName: string;
//   scheduleDateTime: string;
//   duration: number;
// }

// interface Options {
//   firstName: ReactNode;
//   lastName: ReactNode;
//   id: any;
//   batchName: any;
//   moduleName: any;
//   trainerName: any;
// }

// const getToken = () => localStorage.getItem("authToken");

// const formatDateForAPI = (dateTimeString: string): string => {
//   if (!dateTimeString) return '';
//   const date = new Date(dateTimeString);
//   return date.toISOString().slice(0, 19).replace('T', ' ');
// };

// const formatDateForInput = (dateTimeString: string): string => {
//   if (!dateTimeString) return '';
//   return dateTimeString.replace(' ', 'T');
// };

// const BatchModuleScheduleTable = ({
//   editable = true,
// }: BatchModuleScheduleTableProps) => {
//   const [schedules, setSchedules] = useState<ScheduleData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [colDefs, setColDefs] = useState<ColDef[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [batches, setBatches] = useState<Options[]>([]);
//   const [modules, setModules] = useState<Options[]>([]);
//   const [trainers, setTrainers] = useState<Options[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleData | null>(null);
//   const [newSchedule, setNewSchedule] = useState<ScheduleData>({
//     id: 0,
//     batchId: 0,
//     batchName: "",
//     moduleId: 0,
//     moduleName: "",
//     trainerId: 0,
//     trainerName: "",
//     scheduleDateTime: "",
//     duration: 0,
//   });

//   const validateFields = () => {
//     const newErrors: Record<string, string> = {};

//     if (!newSchedule.batchId) newErrors.batchName = "Batch selection is required.";
//     if (!newSchedule.moduleId) newErrors.moduleName = "Module selection is required.";
//     if (!newSchedule.trainerId) newErrors.trainerName = "Trainer selection is required.";
//     if (!newSchedule.scheduleDateTime) newErrors.scheduleDateTime = "Schedule date and time is required.";
//     if (!newSchedule.duration || newSchedule.duration <= 0) {
//       newErrors.duration = "Duration must be greater than 0.";
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       Object.entries(newErrors).forEach(([field, message]) => {
//         toast.error(`${field}: ${message}`);
//       });
//       return false;
//     }
//     return true;
//   };

//   const fetchSchedules = async () => {
//     const token = getToken();
//     if (!token) {
//       toast.error("You must be logged in to view schedules.");
//       return;
//     }

//     try {
//       const schedulesResponse = await fetchBatchModuleScheduleApi();

//       const schedules = schedulesResponse.map((schedule: any) => ({
//         id: schedule.id,
//         batchId: schedule.batchId,
//         batchName: schedule.batch?.batchName || "Unknown Batch",
//         moduleId: schedule.moduleId,
//         moduleName: schedule.module?.moduleName || "Unknown Module",
//         trainerId: schedule.trainerId,
//         trainerName:
//           `${schedule.trainer.firstName} ${schedule.trainer.lastName}` ||
//           "Unknown Trainer",
//         scheduleDateTime: schedule.scheduleDateTime,
//         duration: schedule.duration,
//       }));

//       const batchResponse = await fetchBatchApi();
//       const batches = batchResponse.map((batch: any) => ({
//         id: batch.id,
//         batchName: batch.batchName,
//       }));
//       setBatches(batches);

//       const moduleResponse = await fetchCourseModuleApi();
//       const modules = moduleResponse.map((module: any) => ({
//         id: module.id,
//         moduleName: module.moduleName,
//       }));
//       setModules(modules);

//       const responseUser = await fetchUsersApi();
//       const trainers = responseUser.Users.filter(
//         (user: any) => user.role.name === "trainer"
//       );

//       if (Array.isArray(trainers)) {
//         setTrainers(trainers);
//       } else {
//         toast.error("Failed to load trainers.");
//       }
//       setSchedules(schedules);
//     } catch (error) {
//       console.error("Failed to fetch schedules", error);
//       toast.error("Failed to fetch schedules. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchedules();
//   }, []);

//   const addNewSchedule = () => {
//     setEditing(false);
//     setNewSchedule({
//       id: 0,
//       batchId: 0,
//       batchName: "",
//       moduleId: 0,
//       moduleName: "",
//       trainerId: 0,
//       trainerName: "",
//       scheduleDateTime: "",
//       duration: 0,
//     });
//     setIsModalOpen(true);
//   };

//   const handleFormSubmit = async () => {
//     const token = getToken();
//     if (!token) {
//       toast.error("You must be logged in to perform this action.");
//       return;
//     }

//     if (!validateFields()) return;

//     try {
//       const formattedDateTime = formatDateForAPI(newSchedule.scheduleDateTime);
      
//       const scheduleToSubmit = {
//         batchId: newSchedule.batchId,
//         moduleId: newSchedule.moduleId,
//         trainerId: newSchedule.trainerId,
//         scheduleDateTime: formattedDateTime,
//         duration: newSchedule.duration,
//       };

//       if (editing) {
//         const updateSchedule = await updateBatchModuleScheduleApi(
//           newSchedule.id,
//           scheduleToSubmit
//         );
        
//         if (updateSchedule) {
//           await fetchSchedules();
//           toast.success("Schedule updated successfully!");
//         }
//       } else {
//         const newScheduleData = await createBatchModuleScheduleApi(
//           scheduleToSubmit
//         );
        
//         if (newScheduleData) {
//           await fetchSchedules();
//           toast.success("Schedule created successfully!");
//         }
//       }
//       handleModalClose();
//     } catch (error: any) {
//       console.error("Failed to submit schedule", error);
      
//       let errorMessage = "Failed to submit schedule. Please try again later.";
//       if (error.response?.data?.hint?.field) {
//         errorMessage = error.response.data.hint.field;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
      
//       toast.error(errorMessage);
//     }
//   };

//   const confirmDeleteSchedule = (data: ScheduleData) => {
//     const schedule = schedules.find((schedule) => schedule.id === data.id);
//     if (schedule) {
//       setScheduleToDelete(schedule);
//       setIsDeleteModalOpen(true);
//     }
//   };

//   const handleDeleteSchedule = async () => {
//     if (!scheduleToDelete) {
//       toast.error("No schedule selected for deletion.");
//       return;
//     }

//     const token = getToken();
//     if (!token) {
//       toast.error("You must be logged in to perform this action.");
//       return;
//     }

//     try {
//       await deleteBatchModuleScheduleApi(scheduleToDelete.id);
//       await fetchSchedules();
//       toast.success("Schedule deleted successfully!");
//     } catch (error) {
//       console.error("Failed to delete schedule", error);
//       toast.error("Failed to delete schedule. Please try again later.");
//     } finally {
//       setIsDeleteModalOpen(false);
//       setScheduleToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setIsDeleteModalOpen(false);
//     setScheduleToDelete(null);
//   };

//   const editSchedule = (params: any) => {
//     const scheduleToEdit = schedules.find(
//       (schedule) => schedule.id === params.data.id
//     );
    
//     if (scheduleToEdit) {
//       setEditing(true);
//       setNewSchedule({
//         ...scheduleToEdit,
//         scheduleDateTime: formatDateForInput(scheduleToEdit.scheduleDateTime),
//       });
//       setIsModalOpen(true);
//     } else {
//       toast.error("Schedule not found for editing.");
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setNewSchedule({
//       id: 0,
//       batchId: 0,
//       batchName: "",
//       moduleId: 0,
//       moduleName: "",
//       trainerId: 0,
//       trainerName: "",
//       scheduleDateTime: "",
//       duration: 0,
//     });
//     setErrors({});
//   };

//   useEffect(() => {
//     setColDefs([
//       { headerName: "Batch Name", field: "batchName", editable: false },
//       { headerName: "Module Name", field: "moduleName", editable: false },
//       { headerName: "Trainer Name", field: "trainerName", editable: false },
//       {
//         headerName: "Schedule DateTime",
//         field: "scheduleDateTime",
//         editable: false,
//         valueFormatter: (params: any) => {
//           if (!params.value) return '';
//           const date = new Date(params.value);
//           return date.toLocaleString();
//         }
//       },
//       { 
//         headerName: "Duration (hours)", 
//         field: "duration", 
//         editable: false,
//         valueFormatter: (params: any) => {
//           return `${params.value} hr${params.value !== 1 ? 's' : ''}`;
//         }
//       },
//       {
//         headerName: "Actions",
//         field: "actions",
//         width: 200,
//         cellRenderer: (params: any) => (
//           <div className="flex space-x-2">
//             <Button
//               onClick={() => editSchedule(params)}
//               className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
//             >
//               <Edit className="h-5 w-5" />
//             </Button>
//             <Button
//               onClick={() => confirmDeleteSchedule(params.data)}
//               className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
//             >
//               <Trash className="h-5 w-5" />
//             </Button>
//           </div>
//         ),
//         editable: false,
//       },
//     ]);
//   }, [schedules]);

//   return (
//     <div className="flex-1 p-4 mt-10 ml-24">
//       <div className="flex items-center justify-between bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[1147px]">
//         <div className="flex flex-col">
//           <h2 className="text-2xl font-metropolis font-semibold tracking-wide">
//             Batch Module Schedule
//           </h2>
//           <p className="text-sm font-metropolis font-medium">
//             Manage batch module schedules easily.
//           </p>
//         </div>
//         <Button
//           onClick={addNewSchedule}
//           className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
//         >
//           + New Schedule
//         </Button>
//       </div>

//       {isDeleteModalOpen && scheduleToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
//             <h2 className="text-xl font-metropolis font-semibold mb-4">
//               Confirm Delete
//             </h2>
//             <p className="mb-4 font-metropolis font-medium">
//               Are you sure you want to delete this schedule for batch{" "}
//               <strong>
//                 {scheduleToDelete?.batchName?.charAt(0).toUpperCase() +
//                   scheduleToDelete?.batchName?.slice(1).toLowerCase() ||
//                   "this batch"}
//               </strong>
//               ?
//             </p>
//             <div className="flex justify-end space-x-2 mt-4">
//               <Button
//                 onClick={handleCancelDelete}
//                 className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
//                 rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleDeleteSchedule}
//                 className="bg-custom-gradient-btn text-white px-4 py-2 
//                 transition-all duration-500 ease-in-out 
//                 rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//               >
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div
//         className="ag-theme-quartz text-left"
//         style={{ height: "calc(100vh - 180px)", width: "88%" }}
//       >
//         <AgGridReact
//           rowSelection="multiple"
//           suppressRowClickSelection
//           suppressMovableColumns
//           loading={loading}
//           columnDefs={colDefs}
//           rowData={schedules}
//           defaultColDef={{
//             editable,
//             sortable: true,
//             filter: true,
//             resizable: true,
//           }}
//           animateRows
//         />
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-metropolis font-semibold mb-4 text-center">
//               {editing ? "Edit Schedule" : "Add New Schedule"}
//             </h2>
//             <form>
//               {/* Batch Name */}
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium mb-2">
//                   Batch Name
//                 </label>
//                 <select
//                   className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
//                   value={newSchedule.batchId}
//                   onChange={(e) => {
//                     const selectedBatchId = parseInt(e.target.value);
//                     const selectedBatch = batches.find(
//                       (batch) => batch.id === selectedBatchId
//                     );
//                     setNewSchedule({
//                       ...newSchedule,
//                       batchId: selectedBatchId,
//                       batchName: selectedBatch ? selectedBatch.batchName : "",
//                     });
//                   }}
//                 >
//                   <option value="">Select a batch</option>
//                   {batches.map((batch) => (
//                     <option key={batch.id} value={batch.id}>
//                       {batch.batchName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Module Name */}
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium mb-2">
//                   Module Name
//                 </label>
//                 <select
//                   value={newSchedule.moduleId}
//                   onChange={(e) => {
//                     const selectedModuleId = parseInt(e.target.value);
//                     const selectedModule = modules.find(
//                       (module) => module.id === selectedModuleId
//                     );
//                     setNewSchedule({
//                       ...newSchedule,
//                       moduleId: selectedModuleId,
//                       moduleName: selectedModule
//                         ? selectedModule.moduleName
//                         : "",
//                     });
//                   }}
//                   className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
//                 >
//                   <option value="">Select a module</option>
//                   {modules.map((module) => (
//                     <option key={module.id} value={module.id}>
//                       {module.moduleName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Trainer Name */}
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium mb-2">
//                   Trainer Name
//                 </label>
//                 <select
//                   value={newSchedule.trainerId}
//                   onChange={(e) => {
//                     const selectedTrainerId = parseInt(e.target.value);
//                     const selectedTrainer = trainers.find(
//                       (trainer) => trainer.id === selectedTrainerId
//                     );
//                     setNewSchedule({
//                       ...newSchedule,
//                       trainerId: selectedTrainerId,
//                       trainerName: selectedTrainer
//                         ? `${selectedTrainer.firstName} ${selectedTrainer.lastName}`
//                         : "",
//                     });
//                   }}
//                   className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
//                 >
//                   <option value="">Select a trainer</option>
//                   {trainers.map((trainer) => (
//                     <option key={trainer.id} value={trainer.id}>
//                       {trainer.firstName} {trainer.lastName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Schedule DateTime */}
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium mb-2">
//                   Schedule Date & Time
//                 </label>
//                 <input
//                   type="datetime-local"
//                   value={newSchedule.scheduleDateTime}
//                   onChange={(e) =>
//                     setNewSchedule({
//                       ...newSchedule,
//                       scheduleDateTime: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//                 {errors.scheduleDateTime && (
//                   <span className="text-red-500 text-sm">
//                     {errors.scheduleDateTime}
//                   </span>
//                 )}
//               </div>

//               {/* Duration */}
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium mb-2">
//                   Duration (hours)
//                 </label>
//                 <input
//                   type="number"
//                   value={newSchedule.duration}
//                   onChange={(e) =>
//                     setNewSchedule({
//                       ...newSchedule,
//                       duration: parseInt(e.target.value),
//                     })
//                   }
//                   className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
//                 />
//                 {errors.duration && (
//                   <span className="text-red-500 text-sm">
//                     {errors.duration}
//                   </span>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex space-x-4">
//                 <Button
//                   onClick={handleFormSubmit}
//                   className="bg-custom-gradient-btn text-white px-4 py-2 
//               transition-all duration-500 ease-in-out 
//               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//                 >
//                   {editing ? "Update Schedule" : "Create Schedule"}
//                 </Button>
//                 <Button
//                   onClick={handleModalClose}
//                   className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
//               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BatchModuleScheduleTable;

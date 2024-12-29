import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import "react-day-picker/dist/style.css";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

import {
  fetchScheduleApi,
  createScheduleApi,
  updateScheduleApi,
  deleteScheduleApi,
} from "@/api/scheduleApi";

import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";

// TypeScript types for the component props
interface ScheduleTableProps {
  editable?: boolean;
}

// TypeScript types for schedule data
interface ScheduleData {
  scheduleId: number;
  batchId: number;
  moduleId: number;
  trainerUserId: number;
  scheduledDateTime: string;
  durationInMinute: number;
}

const ManageBatchModuleSchedules = ({ editable = true }: ScheduleTableProps) => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleData | null>(null);
  const [newSchedule, setNewSchedule] = useState<ScheduleData>({
    scheduleId: 0,
    batchId: 0,
    moduleId: 0,
    trainerUserId: 0,
    scheduledDateTime: "",
    durationInMinute: 0,
  });

  // Validate form fields
  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!newSchedule.batchId) newErrors.batchId = "Batch ID is required.";
    if (!newSchedule.moduleId) newErrors.moduleId = "Module ID is required.";
    if (!newSchedule.trainerUserId) newErrors.trainerUserId = "Trainer ID is required.";
    if (!newSchedule.scheduledDateTime) newErrors.scheduledDateTime = "Scheduled Date/Time is required.";
    if (!newSchedule.durationInMinute) newErrors.durationInMinute = "Duration is required.";

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`);
    });

    return newErrors;
  };

  // Fetch schedules
  const fetchSchedulesData = async () => {
    try {
      const schedulesData = await fetchScheduleApi();
      setSchedules(schedulesData || []);
    } catch (error) {
      toast.error("Failed to fetch schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulesData();
  }, []);

  const addNewSchedule = () => {
    setEditing(false);
    setNewSchedule({
      scheduleId: 0,
      batchId: 0,
      moduleId: 0,
      trainerUserId: 0,
      scheduledDateTime: "",
      durationInMinute: 0,
    });
    setIsModalOpen(true);
  };

  const deleteScheduleData = async () => {
    if (!scheduleToDelete) {
      toast.error("No schedule selected for deletion.");
      return;
    }

    try {
      await deleteScheduleApi(scheduleToDelete.scheduleId);

      setSchedules((prev) =>
        prev.filter((schedule) => schedule.scheduleId !== scheduleToDelete.scheduleId)
      );
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the schedule. Please try again later.");
    } finally {
      setDeleteModalOpen(false);
      setScheduleToDelete(null);
    }
  };

  const confirmDelete = (params: any) => {
    const schedule = schedules.find((s) => s.scheduleId === params.data.scheduleId);
    if (schedule) {
      setScheduleToDelete(schedule);
      setDeleteModalOpen(true);
    } else {
      toast.error("Schedule not found.");
    }
  };

  const editSchedule = (data: any) => {
    const scheduleToEdit = schedules.find((schedule) => schedule.scheduleId === data.data.scheduleId);
    if (scheduleToEdit) {
      setEditing(true);
      setNewSchedule({
        ...scheduleToEdit,
        scheduledDateTime: scheduleToEdit.scheduledDateTime
          ? format(new Date(scheduleToEdit.scheduledDateTime), "yyyy-MM-dd'T'HH:mm")
          : "",
      });
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewSchedule({
      scheduleId: 0,
      batchId: 0,
      moduleId: 0,
      trainerUserId: 0,
      scheduledDateTime: "",
      durationInMinute: 0,
    });
  };

  const handleFormSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (editing) {
      try {
        const updatedSchedule = await updateScheduleApi(newSchedule.scheduleId, newSchedule);
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.scheduleId === newSchedule.scheduleId ? updatedSchedule : schedule
          )
        );
        toast.success("Schedule updated successfully!");
      } catch (error) {
        toast.error("Failed to update the schedule. Please try again later.");
      }
    } else {
      try {
        const newScheduleData = await createScheduleApi(newSchedule);
        setSchedules((prev) => [...prev, newScheduleData]);
        toast.success("Schedule added successfully!");
      } catch (error) {
        toast.error("Failed to add the schedule. Please try again later.");
      }
    }

    handleModalClose();
  };

  useEffect(() => {
    setColDefs([
      { headerName: "Batch ID", field: "batchId", editable: false },
      { headerName: "Module ID", field: "moduleId", editable: false },
      { headerName: "Trainer User ID", field: "trainerUserId", editable: false },
      {
        headerName: "Scheduled Date/Time",
        field: "scheduledDateTime",
        valueFormatter: (params) =>
          params.value ? format(new Date(params.value), "yyyy-MM-dd HH:mm") : "",
        editable: false,
      },
      { headerName: "Duration (Minutes)", field: "durationInMinute", editable: false },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button onClick={() => editSchedule(params)} className="bg-blue-500 text-white">
              <Edit />
            </Button>
            <Button onClick={() => confirmDelete(params)} className="bg-red-500 text-white">
              <Trash />
            </Button>
          </div>
        ),
      },
    ]);
  }, [schedules]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Batch Module Schedules</h2>
        <Button onClick={addNewSchedule} className="bg-yellow-400">
          + New Schedule
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
        <AgGridReact
          rowData={schedules}
          columnDefs={colDefs}
          defaultColDef={{ editable, sortable: true, filter: true }}
        />
      </div>
      {/* Modal Code */}
      {isModalOpen && (
        <div className="modal">
          {/* Modal Content */}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal">
          {/* Delete Confirmation Content */}
        </div>
      )}
    </div>
  );
};

export default ManageBatchModuleSchedules;

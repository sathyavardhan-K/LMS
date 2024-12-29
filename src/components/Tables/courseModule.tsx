import { Button } from "../../components/ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { ColDef } from "ag-grid-community";

import {
  createCourseModuleApi,
  fetchCourseModuleApi,
  updateCourseModuleApi,
  deleteCourseModuleApi,
} from "@/api/courseModuleApi";

import { fetchCourseApi } from "@/api/courseApi";

// TypeScript types for the component props
interface CourseModuleTableProps {
  editable?: boolean;
}

// TypeScript types for course module data
interface CourseModuleData {
  id: number;
  courseId: number;
  moduleName: string;
  moduleDescription: string;
  courseName?: string; // Mapped course name from courseId
}

// TypeScript types for course options
interface CourseOption {
  id: number;
  courseName: string;
}

// Helper to get the token from local storage
const getToken = () => localStorage.getItem("authToken");

const CourseModuleTable = ({ editable = true }: CourseModuleTableProps) => {
  const [courseModules, setCourseModules] = useState<CourseModuleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [newModule, setNewModule] = useState<CourseModuleData>({
    id: 0,
    courseId: 0,
    moduleName: "",
    moduleDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [moduleToDelete, setModuleToDelete] = useState<CourseModuleData | null>(
    null
  );

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!newModule.courseId) newErrors.courseId = "Course is required.";
    if (!newModule.moduleName)
      newErrors.moduleName = "Module name is required.";
    if (!newModule.moduleDescription)
      newErrors.moduleDescription = "Module description is required.";

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`);
    });

    return newErrors;
  };

  // Fetch course modules and map course names
  const fetchCourseModules = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to view course modules.");
      return;
    }

    try {
      const courses = await fetchCourseApi();
      const courseMap = courses.reduce(
        (map: Record<number, string>, course: any) => {
          map[course.id] = course.courseName;
          return map;
        },
        {}
      );

      setCourseOptions(
        courses.map((course: any) => ({
          id: course.id,
          courseName: course.courseName,
        }))
      );

      const modules = await fetchCourseModuleApi();
      const mappedModules = modules.map((module: any) => ({
        id: module.id,
        courseId: module.courseId,
        moduleName: module.moduleName,
        moduleDescription: module.moduleDescription,
        courseName: courseMap[module.courseId] || "Unknown Course",
      }));

      setCourseModules(mappedModules);
    } catch (error) {
      console.error("Failed to fetch course modules", error);
      toast.error("Failed to fetch course modules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseModules();
  }, []);

  // Open modal to add a new course module
  const addNewRow = () => {
    setEditing(false);
    setNewModule({
      id: 0,
      courseId: 0,
      moduleName: "",
      moduleDescription: "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewModule({
      id: 0,
      courseId: 0,
      moduleName: "",
      moduleDescription: "",
    });
  };

  // Handle form submission (Create or Update)
  const handleFormSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (editing) {
        await updateCourseModuleApi(newModule.id, {
          courseId: newModule.courseId,
          moduleName: newModule.moduleName,
          moduleDescription: newModule.moduleDescription,
        });
        toast.success("Course module updated successfully!");
      } else {
        await createCourseModuleApi({
          courseId: newModule.courseId,
          moduleName: newModule.moduleName,
          moduleDescription: newModule.moduleDescription,
        });
        toast.success("Course module added successfully!");
      }

      fetchCourseModules();
    } catch (error) {
      console.error("Failed to save course module", error);
      toast.error("Failed to save course module. Please try again later.");
    }

    handleModalClose();
  };

  // Define column definitions
  useEffect(() => {
    setColDefs([
      { headerName: "Course Name", field: "courseName", editable: false, width: 200  },
      { headerName: "Module Name", field: "moduleName", editable: false , width: 300 },
      {
        headerName: "Description",
        field: "moduleDescription",
        editable: false,
        width: 440 
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button
              onClick={() => editCourseModule(params.data)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              <Edit className="h-5 w-4" />
            </Button>
            <Button
              onClick={() => confirmDeleteCourseModule(params.data)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              <Trash className="h-5 w-4" />
            </Button>
          </div>
        ),
      },
    ]);
  }, [courseModules]);

  const editCourseModule = (module: CourseModuleData) => {
    setEditing(true);
    setNewModule(module);
    setIsModalOpen(true);
  };

  const confirmDeleteCourseModule = (module: CourseModuleData) => {
    setModuleToDelete(module);
  };

  const handleDeleteCourseModule = async () => {
    if (!moduleToDelete) return;

    try {
      await deleteCourseModuleApi(moduleToDelete.id);
      setCourseModules((prev) =>
        prev.filter((m) => m.id !== moduleToDelete.id)
      );
      toast.success("Course module deleted successfully!");
    } catch (error) {
      console.error("Failed to delete course module", error);
      toast.error("Failed to delete course module. Please try again later.");
    } finally {
      setModuleToDelete(null);
    }
  };

  return (
    <>
      <div className="flex-1 p-4 mt-10 ml-24">
        <div className="flex items-center justify-between bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[1147px]">
          <div className="flex flex-col">
            <h2 className="text-2xl font-metropolis font-semibold tracking-wide">
              Course Modules
            </h2>
            <p className="text-sm font-metropolis font-medium">
              Manage course modules easily.
            </p>
          </div>
          <Button
            onClick={addNewRow}
            className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
          >
            + New Module
          </Button>
        </div>

        {moduleToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
              <h2 className="text-xl font-metropolis font-semibold mb-4">
                Confirm Delete
              </h2>
              <p className="mb-4 font-metropolis font-medium">
                Are you sure you want to delete the module{" "}
                <strong>{moduleToDelete.moduleName}</strong>?
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  onClick={() => setModuleToDelete(null)}
                  className="bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteCourseModule}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div
          className="ag-theme-quartz"
          style={{ height: "70vh", width: "88%" }}
        >
          <AgGridReact
            rowSelection="multiple"
            suppressRowClickSelection
            suppressMovableColumns
            loading={loading}
            columnDefs={colDefs}
            rowData={courseModules}
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
              <h2 className="text-xl font-metropolis font-semibold mb-4">
                {editing ? "Edit Module" : "Add New Module"}
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block font-metropolis font-medium">
                    Course
                  </label>
                  <select
                    className="w-full border rounded p-2 font-metropolis text-gray-700"
                    value={newModule.courseId}
                    onChange={(e) =>
                      setNewModule({
                        ...newModule,
                        courseId: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.courseId}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block font-metropolis font-medium">
                    Module Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-2 font-metropolis text-gray-700"
                    value={newModule.moduleName}
                    onChange={(e) =>
                      setNewModule({
                        ...newModule,
                        moduleName: e.target.value,
                      })
                    }
                  />
                  {errors.moduleName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.moduleName}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block font-metropolis font-medium">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded p-2 font-metropolis text-gray-700"
                    value={newModule.moduleDescription}
                    onChange={(e) =>
                      setNewModule({
                        ...newModule,
                        moduleDescription: e.target.value,
                      })
                    }
                  />
                  {errors.moduleDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.moduleDescription}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    onClick={handleFormSubmit}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
                  >
                    {editing ? "Update" : "Create"}
                  </Button>
                  <Button
                    onClick={handleModalClose}
                    className="bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseModuleTable;

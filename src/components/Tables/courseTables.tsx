import { Button } from "../../components/ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

// TypeScript types for the component props
interface CourseTableProps {
  editable?: boolean;
}

// TypeScript types for course data
interface CourseData {
  id: number;
  courseName: string;
  syllabus: string;
  duration: string;
  category: string;
}

// Column definitions type from AG-Grid
import { ColDef } from "ag-grid-community";

const courseCategoryOptions = ["Programming", "Fullstack", "Data Science", "Machine Learning", "Cloud Computing"];

// CourseTable component
const CourseTable = ({ editable = true }: CourseTableProps) => {
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false); // Tracks whether we're editing or adding a new course
  const [newCourse, setNewCourse] = useState<CourseData>({
    id: 0,
    courseName: "",
    syllabus: "",
    duration: "1 Month",
    category: courseCategoryOptions[0],
  });

  const fetchCoursesData = () => [
    { id: 1, courseName: "Intro to Programming", syllabus: "Learn basics of programming", duration: "3 Months", category: "Programming" },
    { id: 2, courseName: "Data Science 101", syllabus: "Introduction to data science", duration: "4 Months", category: "Data Science" },
  ];

  const fetchData = async () => {
    try {
      const courses = fetchCoursesData();
      setCourseData(courses);
    } catch (error) {
      console.error("Failed to fetch course data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNewRow = () => {
    setEditing(false); // Ensure we're not in editing mode
    setNewCourse({
      id: 0,
      courseName: "",
      syllabus: "",
      duration: "1 Month",
      category: courseCategoryOptions[0],
    });
    setIsModalOpen(true);
  };

  const deleteCourse = (data: any) => {
    setCourseData(prev => prev.filter(course => course.id !== data.data.id));
    toast.success("Course deleted successfully!");
  };

  const editCourse = (data: any) => {
    const courseToEdit = courseData.find(course => course.id === data.data.id);
    if (courseToEdit) {
      setEditing(true); // Enable editing mode
      setNewCourse(courseToEdit); // Pre-fill the form with the course details
      setIsModalOpen(true); // Open the modal
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCourse({
      id: 0,
      courseName: "",
      syllabus: "",
      duration: "1 Month",
      category: courseCategoryOptions[0],
    });
  };

  const handleFormSubmit = () => {
    if (editing) {
      // Update the existing course
      setCourseData(prev =>
        prev.map(course => (course.id === newCourse.id ? newCourse : course))
      );
      toast.success("Course updated successfully!");
    } else {
      // Add the new course
      setCourseData(prev => [
        ...prev,
        { ...newCourse, id: Date.now() }, // Generate a unique ID
      ]);
      toast.success("Course added successfully!");
    }
    handleModalClose();
  };

  useEffect(() => {
    setColDefs([
      { headerName: "Course Name", field: "courseName", editable: true },
      { headerName: "Syllabus", field: "syllabus", editable: true },
      { headerName: "Duration", field: "duration", editable: true },
      {
        headerName: "Category",
        field: "category",
        editable: true,
        cellEditorPopup: true,
        cellEditorSelector: () => ({ component: "agSelectCellEditor", params: { values: courseCategoryOptions } }),
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button onClick={() => editCourse(params)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
              <Edit className="h-5 w-5" />
            </Button>
            <Button onClick={() => deleteCourse(params)} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ),
        editable: false,
      },
    ]);
  }, [courseData]);

  return (
    <div className="flex-1 p-4 mt-10 ml-10">
      {/* Table header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[950px]">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-wide">Course Management</h2>
          <p className="text-sm font-light">Easily manage your courses. Add, edit, or delete courses with ease.</p>
        </div>
        <Button
          onClick={addNewRow}
          className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          + New Course
        </Button>
      </div>


      {/* Ag-Grid Table */}
      <div className="ag-theme-quartz text-left" style={{ height: "calc(100vh - 180px)", width: "76%" }}>
        <AgGridReact
          rowSelection="multiple"
          suppressRowClickSelection
          suppressMovableColumns
          loading={loading}
          columnDefs={colDefs}
          rowData={courseData}
          defaultColDef={{ editable, sortable: true, filter: true, resizable: true }}
          animateRows
        />
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editing ? "Edit Course" : "Add New Course"}</h2>
            <form>
              <div className="mb-4">
                <label className="block font-medium">Course Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newCourse.courseName}
                  onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Syllabus</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newCourse.syllabus}
                  onChange={e => setNewCourse({ ...newCourse, syllabus: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Duration</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newCourse.duration}
                  onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Category</label>
                <select
                  className="w-full border rounded p-2"
                  value={newCourse.category}
                  onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                >
                  {courseCategoryOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={handleModalClose} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-700">
                  Cancel
                </Button>
                <Button onClick={handleFormSubmit} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-700">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;

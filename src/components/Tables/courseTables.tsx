// import { Button } from "../../components/ui/button";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Edit, Trash } from "lucide-react";
// import { ColDef } from "ag-grid-community";

// import { 
//   createCourseApi,
//   fetchCourseApi, 
//   updateCourseApi,  
//   deleteCourseApi, 
// } from "@/api/courseApi"; 

// import { fetchCourseCategoryApi } from "@/api/courseCategoryApi";
// // import { fetchUsersApi } from "@/api/userApi";

// // TypeScript types for the component props
// interface CourseTableProps {
//   editable?: boolean;
// }

// // TypeScript types for course data
// interface CourseData {
//   id: number;
//   courseName: string;
//   courseDesc: string;
//   courseCategoryId: number;
//   courseCategory: string;
// }

// interface courseCategoryOptions {
//   id: any;
//   courseCategory: any;
// }

// // interface instructorOptions{
// //   id: any;
// //   fullName: any;
// // }

// // Helper to get the token from local storage
// const getToken = () => localStorage.getItem("authToken");

// const CourseTable = ({ editable = true }: CourseTableProps) => {
//   const [courseData, setCourseData] = useState<CourseData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [colDefs, setColDefs] = useState<ColDef[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [courseCategory, setCourseCategory] = useState<courseCategoryOptions[]>([]);
//   // const [instructor, setInstructor] = useState<instructorOptions[]>([]);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [courseToDelete, setCourseToDelete] = useState< CourseData | null>(null);
//   const [newCourse, setNewCourse] = useState<CourseData>({
//     id: 0,
//     courseName: "",
//     courseDesc: "",
//     courseCategoryId: 0,
//     courseCategory: "",
//   });

//   const validateFields = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!newCourse.courseName) newErrors.courseName = 'courseName is required.';
//     if (!newCourse.courseDesc) newErrors.courseDesc = 'courseDesc is required.';
//     if (!newCourse.courseCategoryId) newErrors.courseCategoryId = 'courseCategory is required.';

//     setErrors(newErrors);

//     Object.entries(newErrors).forEach(([field, message]) => {
//       toast.error(`${field}: ${message}`);
//     });

//     return newErrors;
//   }

//   // Fetch courses
//   const fetchCourses = async () => {
//     const token = getToken();
//     if (!token) {
//       toast.error("You must be logged in to view courses.");
//       return;
//     }

//     try {

//       const reponse = await fetchCourseApi();
//       const courses = reponse.map((course: any) => ({
//         id: course.id,
//         courseName: course.courseName,
//         courseDesc: course.courseDesc,
//         courseCategory: course.category?.courseCategory || "Unknown",
//         courseCategoryId: course.courseCategoryId || 0,
//       }));

//       const responseCategory = await fetchCourseCategoryApi();
//         const courseCategory = responseCategory.map((category: any)=>({
//           id: category.id,
//           courseCategory: category.courseCategory
//         }));
//         setCourseCategory(courseCategory);

//       setCourseData(courses);
//     } catch (error) {
//       console.error("Failed to fetch courses", error);
//       toast.error("Failed to fetch courses. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Open modal to add a new course
//   const addNewRow = () => {
//     setEditing(false);
//     setNewCourse({
//       id: 0,
//       courseName: "",
//       courseDesc: "",
//       courseCategoryId: 0,
//       courseCategory: "",
//     });
//     setIsModalOpen(true);
//   };

//   const confirmDeleteCourse = (data: CourseData) => {
//       const course = courseData.find((course) => course.id === data.id);
//       if (course) {
//         setCourseToDelete(course);
//         setIsDeleteModalOpen(true);
//       }
//     };  
  
//     const handleDeleteCourse = async () => {
//         if (!courseToDelete) {
//           toast.error("No course Selected for deletion")
//           return;
//         }

//         const token = getToken();
//         if (!token) {
//           toast.error("You must be logged in to delete a course.");
//           return;
//         }
    
//         try {

//           await deleteCourseApi(courseToDelete.id);
          
//           setCourseData((prev) => prev.filter((course) => course.id !== courseToDelete.id));
//           toast.success("Course deleted successfully!");
//         } catch (error) {
//           console.error("Failed to delete course", error);
//           toast.error("Failed to delete the course. Please try again later.");
//         } finally {
//           setIsDeleteModalOpen(false);
//           setCourseToDelete(null);
//         }
//       };
  
//       const handleCancelDelete = () => {
//         setIsDeleteModalOpen(false);
//         setCourseToDelete(null);
//       };

//   // Edit a course
//   const editCourse = (data: any) => {
//     const courseToEdit = courseData.find((course) => course.id === data.data.id);
//     if (courseToEdit) {
//       setEditing(true);
//       setNewCourse(courseToEdit);
//       setIsModalOpen(true);
//     }
//   };

//   // Close the modal
//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setNewCourse({
//       id: 0,
//       courseName: "",
//       courseDesc: "",
//       courseCategoryId: 0,
//       courseCategory: "",
//     });
//   };

//   // Handle form submission (Create or Update)
//   const handleFormSubmit = async () => {
//     const token = getToken();
//     if (!token) {
//       toast.error("You must be logged in to perform this action.");
//       return;
//     }

//     const validationErrors = validateFields();
//     if (Object.keys(validationErrors).length > 0) {
//       return; // Stop further execution if errors exist
//     }

//     const courseToSubmit = {
//       courseName: newCourse.courseName,
//       courseDesc: newCourse.courseDesc,
//       courseCategoryId: newCourse.courseCategoryId
//     };

//     try {
//       if (editing) {

//         const updatedCourse = await updateCourseApi(newCourse.id, courseToSubmit);
//         fetchCourses();

//         setCourseData((prev) =>
//           prev.map((course) =>
//             course.id === newCourse.id ? { ...course, ...updatedCourse } : course
//           )
//         );

//         toast.success("Course updated successfully!");

//       } else {

//         const newCourseData = await createCourseApi(courseToSubmit);
//         fetchCourses();
//         setCourseData((prev) => [...prev, newCourseData]);

//         toast.success("Course added successfully!");
//       }
//     } catch (error) {
//       console.error("Failed to update course", error);
//       toast.error("Failed to update the course. Please try again later.");
//     }

//     handleModalClose();
//   };

//   // Define column definitions for the grid
//   useEffect(() => {
//     // setColDefs([
//     //   { headerName: "Course Name", field: "courseName", editable: false, width: 220 },
//     //   { headerName: "Description", field: "courseDesc", editable: false, width: 550 },
//     //   { headerName: "Course Category", field: "courseCategory", editable: false, width: 250 },
//     //   {
//     //     headerName: "Actions",
//     //     field: "actions",
//     //     cellRenderer: (params: any) => (
//     //       <div className="flex space-x-2">
//     //         <Button onClick={() => editCourse(params)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
//     //           <Edit className="h-5 w-4" />
//     //         </Button>
//     //         <Button onClick={() => confirmDeleteCourse(params.data)} className="bg-red-500 p-2 rounded hover:bg-red-700 text-white">
//     //           <Trash className="h-5 w-5" />
//     //         </Button>
//     //       </div>
//     //     ),
//     //     editable: false,
//     //   },
//     // ]);
//   }, [courseData]);

//   // Unique categories and instructors
//   const uniqueCategories = Array.from(
//     new Map(courseData.map((course) => [course.courseCategory, course.courseCategoryId]))
//   );


//   return (
//     <div className="flex-1 p-4 mt-10 ml-24">
//       <div className="flex items-center justify-between bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[1147px]">
//       <div className="flex flex-col">
//           <h2 className="text-2xl font-metropolis font-semibold tracking-wide">Courses</h2>
//           <p className="text-sm font-metropolis font-medium">Manage course easily.</p>
//         </div>
//         <Button onClick={addNewRow}
//          className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300">
//           + New Course
//         </Button>
//       </div>

//       {isDeleteModalOpen && courseToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
//             <h2 className="text-xl font-metropolis font-semibold mb-4">Confirm Delete</h2>
//             <p className="mb-4 font-metropolis font-medium">
//               Are you sure you want to delete the course {" "}
//               <strong>
//                 {courseToDelete?.courseName?.charAt(0).toUpperCase() +
//                   courseToDelete?.courseName?.slice(1).toLowerCase() || "this course"}
//               </strong>
//               ?
//             </p>
//             <div className="flex justify-end space-x-2 mt-4">
//               <Button
//                 onClick={handleCancelDelete}
//                 className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
//                rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleDeleteCourse}
//                 className="bg-custom-gradient-btn text-white px-4 py-2 
//                 transition-all duration-500 ease-in-out 
//                rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//               >
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* <div className="ag-theme-quartz" style={{ height: "70vh", width: "88%" }}>
//         <AgGridReact
//           rowSelection="multiple"
//           suppressRowClickSelection
//           suppressMovableColumns
//           loading={loading}
//           columnDefs={colDefs}
//           rowData={courseData}
//           defaultColDef={{ editable, sortable: true, filter: true, resizable: true }}
//           animateRows
//         />
//       </div> */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-metropolis font-semibold">{editing ? "Edit Course" : "Add New Course"}</h2>
//             <form>
//               <div className="mb-4 mt-4">
//                 <label className="block font-metropolis font-medium">Course Name</label>
//                 <input
//                   type="text"
//                   className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
//                   value={newCourse.courseName}
//                   onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium">Description</label>
//                 <input
//                   type="text"
//                   className="w-full border rounded p-2 font-metropolis text-gray-400 font-semibold"
//                   value={newCourse.courseDesc}
//                   onChange={(e) => setNewCourse({ ...newCourse, courseDesc: e.target.value })}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block font-metropolis font-medium">Category</label>
//                 <select
//                   className="w-full border rounded p-2 font-metropolis text-gray-400 font-semibold"
//                   value={newCourse.courseCategoryId}
//                   onChange={(e) =>
//                     setNewCourse({
//                       ...newCourse,
//                       courseCategoryId: parseInt(e.target.value, 10),
//                       courseCategory:
//                         uniqueCategories.find(([_, id]) => id === parseInt(e.target.value, 10))?.[0] || "",
//                     })
//                   }
//                 >
//                   <option value="">Select Category</option>
//                   {courseCategory.map((category) => (
//                     <option key={category.courseCategory} value={category.id}>
//                       {category.courseCategory}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex space-x-4">
//                 <Button
//                   onClick={handleFormSubmit}
//                   className="bg-custom-gradient-btn text-white px-4 py-2 
//                 transition-all duration-500 ease-in-out 
//                rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
//                 >
//                   {editing ? "Update Course" : "Create Course"}
//                 </Button>
//                 <Button
//                   onClick={handleModalClose}
//                   className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
//                rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
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

// export default CourseTable;

import { useState, useEffect, SetStateAction } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { ChevronDown, Pencil } from "lucide-react";

import {
  createCourseApi,
  fetchCourseApi,
  updateCourseApi,
  deleteCourseApi,
} from "@/api/courseApi";
import { fetchCourseCategoryApi } from "@/api/courseCategoryApi";

interface CourseTableProps {
  editable?: boolean;
}

interface CourseData {
  id: number;
  courseName: string;
  courseDesc: string;
  courseCategoryId: number;
  courseCategory: string;
}

interface courseCategoryOptions {
  id: any;
  courseCategory: any;
}

const getToken = () => localStorage.getItem("authToken");

const CourseTable = ({ editable = true }: CourseTableProps) => {
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [courseCategory, setCourseCategory] = useState<courseCategoryOptions[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<CourseData>({
    id: 0,
    courseName: "",
    courseDesc: "",
    courseCategoryId: 0,
    courseCategory: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  {/* pagination */ }
  const recordsPerPage = 15;
  const totalPages = Math.ceil(courseData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentData = courseData.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fetch courses and categories
  const fetchCourses = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to view courses.");
      return;
    }

    try {
      const courseResponse = await fetchCourseApi();
      const courses = courseResponse.map((course: any) => ({
        id: course.id,
        courseName: course.courseName,
        courseDesc: course.courseDesc,
        courseCategory: course.category?.courseCategory || "Unknown",
        courseCategoryId: course.courseCategoryId || 0,
      }));

      const categoryResponse = await fetchCourseCategoryApi();
      const categories = categoryResponse.map((category: any) => ({
        id: category.id,
        courseCategory: category.courseCategory,
      }));

      setCourseData(courses);
      setCourseCategory(categories);
    } catch (error) {
      console.error("Failed to fetch courses or categories", error);
      toast.error("Failed to fetch courses or categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addNewRow = () => {
    setEditing(false);
    setNewCourse({
      id: 0,
      courseName: "",
      courseDesc: "",
      courseCategoryId: 0,
      courseCategory: "",
    });
    setIsModalOpen(true);
  };

  const editCourse = (course: CourseData) => {
    setEditing(true);
    setNewCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCourse({
      id: 0,
      courseName: "",
      courseDesc: "",
      courseCategoryId: 0,
      courseCategory: "",
    });
  };

  const handleFormSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      if (editing) {
        await updateCourseApi(newCourse.id, {
          courseName: newCourse.courseName,
          courseDesc: newCourse.courseDesc,
          courseCategoryId: newCourse.courseCategoryId,
        });
        toast.success("Course updated successfully!");
      } else {
        await createCourseApi({
          courseName: newCourse.courseName,
          courseDesc: newCourse.courseDesc,
          courseCategoryId: newCourse.courseCategoryId,
        });
        toast.success("Course created successfully!");
      }
      fetchCourses();
    } catch (error) {
      console.error("Failed to save course", error);
      toast.error("Failed to save course. Please try again later.");
    } finally {
      handleModalClose();
    }
  };

  //Delete course
  const handleDeleteCourse = async () => {
    try {
      await deleteCourseApi(newCourse.id);
      toast.success("Course deleted successfully.");
      fetchCourses();
      handleModalClose();
    } catch (error) {
      toast.error("Failed to delete the course.");
    }
  };


  return (
    <div className="flex-1 p-6 mt-10 ml-16">
      <div className="relative bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-full">
        {/* Dropdown Button */}
        <Button
          className="w-80 flex justify-between items-center px-4 py-2 border bg-yellow-400"
          onClick={toggleDropdown}
        >
          Courses
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-80 border bg-white z-10 mt-1 max-h-48 overflow-auto shadow-lg text-black">
            {/* Add New Course Option */}
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                addNewRow()
                setIsModalOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              + New Course
            </li>

            {/* Course List with Edit Icons */}
            {courseData.map((course) => (
              <li
                key={course.id}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              >
                <span>{course.courseName}</span>
                <Pencil
                  className="h-4 w-4 text-blue-500 cursor-pointer"
                  onClick={() => {
                    editCourse(course);
                    setIsDropdownOpen(false);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <table className="table-auto w-full mt-4 border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-800">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            {/* <th className="border border-gray-300 px-4 py-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {currentData.map((course) => (
            <tr key={course.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{course.courseName}</td>
              <td className="border border-gray-300 px-4 py-2">{course.courseDesc}</td>
              <td className="border border-gray-300 px-4 py-2">{course.courseCategory}</td>
              {/* <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                <button
                  onClick={() => editCourse(course)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="inline-block w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="inline-block w-5 h-5" />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-4 py-2 rounded-l-md border bg-gray-300 text-gray-700 hover:bg-gray-400 ${currentPage === 1 && "cursor-not-allowed opacity-50"
            }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 border-t border-b text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-4 py-2 rounded-r-md border bg-gray-300 text-gray-700 hover:bg-gray-400 ${currentPage === totalPages && "cursor-not-allowed opacity-50"
            }`}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-metropolis font-semibold">{editing ? "Edit Course" : "Add New Course"}</h2>
            <form>
              <div className="mb-4 mt-4">
                <label className="block font-metropolis font-medium">Course Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 font-metropolis text-gray-700"
                  value={newCourse.courseName}
                  onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">Description</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 font-metropolis text-gray-700"
                  value={newCourse.courseDesc}
                  onChange={(e) => setNewCourse({ ...newCourse, courseDesc: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">Category</label>
                <select
                  className="w-full border rounded p-2 font-metropolis text-gray-700"
                  value={newCourse.courseCategoryId}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      courseCategoryId: parseInt(e.target.value, 10),
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {courseCategory.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.courseCategory}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleFormSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editing ? "Update Course" : "Create Course"}
                </Button>
                <Button
                  onClick={handleModalClose}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </Button>
                {editing && (
                  <Button onClick={handleDeleteCourse} className="bg-red-500">
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;

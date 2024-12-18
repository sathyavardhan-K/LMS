import { Button } from "../../components/ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import axios from "axios";
import { ColDef } from "ag-grid-community";
import { useDropzone } from "react-dropzone";



// TypeScript types for the component props
interface CourseCategoryTableProps {
  editable?: boolean;
}

// TypeScript types for course category data
interface CourseCategoryData {
  id: number;
  courseCategory: string;
  description: string;
  courseCategoryImg: string;
}


const getToken = () => localStorage.getItem("authToken");



const CourseCategoryTable = ({ editable = true }: CourseCategoryTableProps) => {
  const [categoryData, setCategoryData] = useState<CourseCategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CourseCategoryData | null>(null);
  const [newCategory, setNewCategory] = useState<CourseCategoryData>({
    id: 0,
    courseCategory: "",
    description: "",
    courseCategoryImg: "",
  });


  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newCategory.courseCategory) newErrors.courseCategory = 'courseCategory is required.';
    if (!newCategory.description) newErrors.description = 'description is required.';
    if (!newCategory.courseCategoryImg) newErrors.courseCategoryImg = 'courseCategoryImg is required.';

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`);
    });

    return newErrors;
  }
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Only handle single file upload
    setUploadedFile(file);
  
    // Update the newCategory state with the file name or path (optional)
    setNewCategory({ ...newCategory, courseCategoryImg: file.name });
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false, // Single file upload
  });

  // Fetch course categories
  const fetchCourseCategory = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to view course categories.");
      return;
    }

    try {
      const response = await axios.get(`/coursecategory`);
      console.log("Get course Categories", response.data);
      setCategoryData(response.data.category || []);
    } catch (error) {
      console.error("Failed to fetch course categories", error);
      toast.error("Failed to fetch course categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseCategory();
  }, []);

  const addNewRow = () => {
    setEditing(false);
    setNewCategory({
      id: 0,
      courseCategory: "",
      description: "",
      courseCategoryImg: "",
    });
    setIsModalOpen(true);
  };

  const confirmDeleteCategory = (data: CourseCategoryData) => {
    const category = categoryData.find((category) => category.id === data.id);
    if (category) {
      setCategoryToDelete(category);
      setIsDeleteModalOpen(true);
    }
  };  

  const handleDeleteCategory = async () => {
      if (!categoryToDelete) return;
  
      const token = getToken();
      if (!token) {
        toast.error("You must be logged in to delete a category.");
        return;
      }
  
      try {
        await axios.delete(`/coursecategory/${categoryToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategoryData((prev) => prev.filter((category) => category.id !== categoryToDelete.id));
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Failed to delete category", error);
        toast.error("Failed to delete the category. Please try again later.");
      } finally {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      }
    };

    const handleCancelDelete = () => {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    };

  const editCategory = (data: any) => {
    const categoryToEdit = categoryData.find((category) => category.id === data.id);
    console.log('categoryToEdit',categoryToEdit);
    if (categoryToEdit) {
      setEditing(true);
      setNewCategory(categoryToEdit);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCategory({
      id: 0,
      courseCategory: "",
      description: "",
      courseCategoryImg: "",
    });
  };

  const handleFormSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    const validationErrors = validateFields();
    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return; // Stop further execution if errors exist
    }
  
    if (editing) {
      // Check if the newCategory.id is correctly set
      if (!newCategory.id) {
        console.error("Category ID is missing for update");
        toast.error("Category ID is missing.");
        return;
      }
  
      try {
        const response = await axios.put(`/coursecategory/${newCategory.id}`, newCategory, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

         // Assuming the backend returns the updated category data
        const updatedCategory = response.data; // assuming the response contains the updated category
        console.log('updatedCategory',updatedCategory);
  
        // Assuming the backend returns the updated category data
        setCategoryData((prev) =>
          prev.map((category) =>
            category.id === newCategory.id ? updatedCategory : category
          )
        );

        toast.success("Category updated successfully!");
      } catch (error) {
        console.error("Failed to update category", error);
        toast.error("Failed to update the category. Please try again later.");
      }
    } else {
      try {
        const response = await axios.post(`/coursecategory`, newCategory, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the response returns the newly created category
        const newCategoryData = response.data; // Assuming this is the new category from the API

        setCategoryData((prev) => [...prev, newCategoryData]);
        toast.success("Category added successfully!");
      } catch (error) {
        console.error("Failed to add category", error);
        toast.error("Failed to add the category. Please try again later.");
      }
    }

     // Refresh the component by fetching updated data
    await fetchCourseCategory();
    handleModalClose();
  };
  

  useEffect(() => {
    setColDefs([
      { headerName: "Category Name", field: "courseCategory", editable: false },
      { headerName: "Description", field: "description", editable: false, width: 460 },
      { headerName: "Category Image", field: "courseCategoryImg", editable: false, width: 320 },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button
              onClick={() => editCategory(params.data)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => confirmDeleteCategory(params.data)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ),
        editable: false,
      },
    ]);
  }, [categoryData]);

  return (
    <div className="flex-1 p-4 mt-10 ml-24">
      <div className="flex items-center justify-between bg-custom-gradient text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[1147px]">
        <div className="flex flex-col">
          <h2 className="text-2xl font-metropolis font-semibold tracking-wide">Course Categories</h2>
          <p className="text-sm font-metropolis font-medium">Manage course categories easily.</p>
        </div>
        <Button
          onClick={addNewRow}
          className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          + New Category
        </Button>
      </div>

      <div className="ag-theme-quartz text-left" style={{ height: "calc(100vh - 180px)", width: "88%" }}>
        <AgGridReact
          rowSelection="multiple"
          suppressRowClickSelection
          suppressMovableColumns
          loading={loading}
          columnDefs={colDefs}
          rowData={categoryData}
          defaultColDef={{ editable, sortable: true, filter: true, resizable: true }}
          animateRows
        />
      </div>

      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
            <h2 className="text-xl font-metropolis font-semibold mb-4">Confirm Delete</h2>
            <p className="font-metropolis font-medium">
              Are you sure you want to delete the category {" "}
              <strong>
                {categoryToDelete?.courseCategory?.charAt(0).toUpperCase() +
                  categoryToDelete?.courseCategory?.slice(1).toLowerCase() || "this category"}
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
                onClick={handleDeleteCategory}
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


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-metropolis font-semibold mb-4">{editing ? "Edit Category" : "Add New Category"}</h2>
            <form>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">Category Name</label>
                <input
                  type="text"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newCategory.courseCategory}
                  onChange={(e) => setNewCategory({ ...newCategory, courseCategory: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">Description</label>
                <input
                  type="text"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">Category Image</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded p-4 mt-2 h-28 text-center cursor-pointer 
      ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
                >
                  <input {...getInputProps()} />
                  {uploadedFile ? (
                    <p className="text-green-600 font-metropolis font-semibold">{uploadedFile.name}</p>
                  ) : (
                    <p className="text-gray-400 font-semibold">
                      Drag & drop a file here, or click to select one
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleModalClose}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFormSubmit}
                  className="bg-custom-gradient-btn text-white px-4 py-2 
                transition-all duration-500 ease-in-out 
               rounded-tl-3xl hover:rounded-tr-none hover:rounded-br-none hover:rounded-bl-none hover:rounded"
                >
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

    
  );
};

export default CourseCategoryTable;

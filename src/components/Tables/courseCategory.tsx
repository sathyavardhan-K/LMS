import { Button } from "../../components/ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash, Eye } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ColDef } from "ag-grid-community";
import {
  fetchCourseCategoryApi,
  deleteCourseCategoryApi,
  createCourseCategoryApi,
  updateCourseCategoryApi,
} from "@/api/courseCategoryApi";

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
  const [viewingCategory, setViewingCategory] =
    useState<CourseCategoryData | null>(null);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CourseCategoryData | null>(null);
  const [newCategory, setNewCategory] = useState<CourseCategoryData>({
    id: 0,
    courseCategory: "",
    description: "",
    courseCategoryImg: "",
  });

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!newCategory.courseCategory)
      newErrors.courseCategory = "courseCategory is required.";
    if (!newCategory.description)
      newErrors.description = "description is required.";
    if (!newCategory.courseCategoryImg)
      newErrors.courseCategoryImg = "courseCategoryImg is required.";

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`);
    });

    return newErrors;
  };

  // Convert file to base64 with prefix
  const convertFileToBase64 = (file: File) => {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert file to base64 with prefix
    });
  };

  console.log(newCategory.courseCategoryImg);

  // When an image is dropped/uploaded
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Handle single file upload
    setUploadedFile(file);

    // Convert the file to base64
    convertFileToBase64(file).then((base64) => {
      setNewCategory({ ...newCategory, courseCategoryImg: base64 });
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false, // Single file upload
  });

  const fetchCourseCategoryData = async () => {
    try {
      const courseCategoryData = await fetchCourseCategoryApi();
      const imageUrls = courseCategoryData.map(
        (category: { courseCategoryImg: string }) => {
          if (category.courseCategoryImg) {
            // No need to convert base64, it can be used directly
            return category.courseCategoryImg;
          }
          return null; // Handle missing images
        }
      );

      setCategoryData(
        courseCategoryData.map((category: any, index: string | number) => ({
          ...category,
          courseCategoryImg: imageUrls[index] || null, // Assign base64 string
        }))
      );
    } catch (error) {
      console.error("Failed to fetch course categories", error);
      toast.error("Failed to fetch course categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseCategoryData();
  }, []);

  const addNewRow = () => {
    setEditing(false);
    setUploadedFile(null);
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

  // Function to handle viewing a row
  const handleViewCategory = (data: CourseCategoryData) => {
    setViewingCategory(data); // Set the row data to state
    setIsModalOpen(true); // Open the modal
    setIsModalOpen(false); // Close the modal
  };

  const handleDeleteCategoryData = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCourseCategoryApi(categoryToDelete.id);
      setCategoryData((prev) =>
        prev.filter((category) => category.id !== categoryToDelete.id)
      );
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
    const categoryToEdit = categoryData.find(
      (category) => category.id === data.id
    );
    console.log("categoryToEdit", categoryToEdit);
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
        const updatedCategory = await updateCourseCategoryApi(
          newCategory.id,
          newCategory
        );
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
        const newCategoryData = await createCourseCategoryApi(newCategory);
        setCategoryData((prev) => [...prev, newCategoryData]);
        toast.success("Category added successfully!");
      } catch (error) {
        console.error("Failed to add category", error);
        toast.error("Failed to add the category. Please try again later.");
      }
    }

    // Refresh the component by fetching updated data
    await fetchCourseCategoryData();
    handleModalClose();
  };

  useEffect(() => {
    setColDefs([
      { headerName: "Category Name", field: "courseCategory", editable: false },
      {
        headerName: "Description",
        field: "description",
        editable: false,
        width: 460,
      },
      {
        headerName: "Category Image",
        field: "courseCategoryImg",
        cellRenderer: (params: any) => {
          const imageUrl = params.value; // Can be base64 string or object URL
          return imageUrl ? (
            <img
              src={imageUrl}
              alt="Category"
              style={{
                width: "100px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : (
            "No Image"
          );
        },
        editable: false,
        width: 320,
      },

      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-4">
            <Button
              onClick={() => handleViewCategory(params.data)}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
            >
              <Eye className="h-5 w-5" />
            </Button>
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
          <h2 className="text-2xl font-metropolis font-semibold tracking-wide">
            Course Categories
          </h2>
          <p className="text-sm font-metropolis font-medium">
            Manage course categories easily.
          </p>
        </div>
        <Button
          onClick={addNewRow}
          className="bg-yellow-400 text-gray-900 font-metropolis font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          + New Category
        </Button>
      </div>
      <div
        className="ag-theme-quartz text-left"
        style={{ height: "calc(100vh - 180px)", width: "89%" }}
      >
        <AgGridReact
          rowSelection="multiple"
          suppressRowClickSelection
          suppressMovableColumns
          loading={loading}
          columnDefs={colDefs}
          rowData={categoryData}
          defaultColDef={{
            editable,
            sortable: true,
            filter: true,
            resizable: true,
          }}
          animateRows
        />
      </div>
    
      {viewingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-metropolis font-semibold mb-4">
              View Category
            </h2>
            <div className="mb-4">
              <label className="block font-metropolis font-medium">
                Category Name
              </label>
              <p className="font-metropolis text-gray-700">
                {viewingCategory.courseCategory}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-metropolis font-medium">
                Description
              </label>
              <p className="font-metropolis text-gray-700">
                {viewingCategory.description}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-metropolis font-medium">
                Category Image
              </label>
              {viewingCategory.courseCategoryImg ? (
                <img
                  src={viewingCategory.courseCategoryImg}
                  alt="Category"
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <p className="text-gray-500">No Image</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setViewingCategory(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
            <h2 className="text-xl font-metropolis font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="font-metropolis font-medium">
              Are you sure you want to delete the category{" "}
              <strong>
                {categoryToDelete?.courseCategory?.charAt(0).toUpperCase() +
                  categoryToDelete?.courseCategory?.slice(1).toLowerCase() ||
                  "this category"}
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
                onClick={handleDeleteCategoryData}
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
            <h2 className="text-xl font-metropolis font-semibold mb-4">
              {editing ? "Edit Category" : "Add New Category"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newCategory.courseCategory}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      courseCategory: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full border rounded font-metropolis p-2 text-gray-400 font-semibold"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-metropolis font-medium">
                  Category Image
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded p-4 mt-2 h-28 text-center cursor-pointer 
      ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
                >
                  <input {...getInputProps()} />
                  {uploadedFile ? (
                    <p className="text-green-600 font-metropolis font-semibold mt-6">
                      {uploadedFile.name}
                    </p>
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

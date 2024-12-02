import { Button } from "../../components/ui/button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

// TypeScript types for the component props
interface CourseCategoryTableProps {
  editable?: boolean;
}

// TypeScript types for course category data
interface CourseCategoryData {
  id: number;
  categoryName: string;
  description: string;
  imgPath: string;
}

// Column definitions type from AG-Grid
import { ColDef } from "ag-grid-community";

// CourseCategoryTable component
const CourseCategoryTable = ({ editable = true }: CourseCategoryTableProps) => {
  const [categoryData, setCategoryData] = useState<CourseCategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false); // Tracks whether we're editing or adding a new category
  const [newCategory, setNewCategory] = useState<CourseCategoryData>({
    id: 0,
    categoryName: "",
    description: "",
    imgPath: "",
  });

  const fetchCategoriesData = () => [
    { id: 1, categoryName: "Programming", description: "Learn coding skills", imgPath: "/images/programming.jpg" },
    { id: 2, categoryName: "Data Science", description: "Master data analytics", imgPath: "/images/datascience.jpg" },
  ];

  const fetchData = async () => {
    try {
      const categories = fetchCategoriesData();
      setCategoryData(categories);
    } catch (error) {
      console.error("Failed to fetch category data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNewRow = () => {
    setEditing(false); // Ensure we're not in editing mode
    setNewCategory({
      id: 0,
      categoryName: "",
      description: "",
      imgPath: "",
    });
    setIsModalOpen(true);
  };

  const deleteCategory = (data: any) => {
    setCategoryData(prev => prev.filter(category => category.id !== data.data.id));
    toast.success("Category deleted successfully!");
  };

  const editCategory = (data: any) => {
    const categoryToEdit = categoryData.find(category => category.id === data.data.id);
    if (categoryToEdit) {
      setEditing(true); // Enable editing mode
      setNewCategory(categoryToEdit); // Pre-fill the form with the category details
      setIsModalOpen(true); // Open the modal
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCategory({
      id: 0,
      categoryName: "",
      description: "",
      imgPath: "",
    });
  };

  const handleFormSubmit = () => {
    if (editing) {
      // Update the existing category
      setCategoryData(prev =>
        prev.map(category => (category.id === newCategory.id ? newCategory : category))
      );
      toast.success("Category updated successfully!");
    } else {
      // Add the new category
      setCategoryData(prev => [
        ...prev,
        { ...newCategory, id: Date.now() }, // Generate a unique ID
      ]);
      toast.success("Category added successfully!");
    }
    handleModalClose();
  };

  useEffect(() => {
    setColDefs([
      { headerName: "Category Name", field: "categoryName", editable: true },
      { headerName: "Description", field: "description", editable: true },
      { headerName: "Image Path", field: "imgPath", editable: true },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => (
          <div className="flex space-x-2">
            <Button onClick={() => editCategory(params)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
              <Edit className="h-5 w-5" />
            </Button>
            <Button onClick={() => deleteCategory(params)} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ),
        editable: false,
      },
    ]);
  }, [categoryData]);

  return (
    <div className="flex-1 p-4 mt-10 ml-10">
      {/* Table header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6 w-[850px]">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-wide">Course Categories</h2>
          <p className="text-sm font-light">Manage course categories easily.</p>
        </div>
        <Button
          onClick={addNewRow}
          className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-md shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          + New Category
        </Button>
      </div>

      {/* Ag-Grid Table */}
      <div className="ag-theme-quartz text-left" style={{ height: "calc(100vh - 180px)", width: "68%" }}>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editing ? "Edit Category" : "Add New Category"}</h2>
            <form>
              <div className="mb-4">
                <label className="block font-medium">Category Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newCategory.categoryName}
                  onChange={e => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image Path</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newCategory.imgPath}
                  onChange={e => setNewCategory({ ...newCategory, imgPath: e.target.value })}
                />
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

export default CourseCategoryTable;

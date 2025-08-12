"use client";

import { useState } from "react";
import {
  useGetAllCustomBazarProductsQuery,
  useDeleteCustomProductMutation,
  useUpdateCustomBazarProductMutation,
} from "@/redux/features/CustomBazar/customBazarApi";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { Category, Subcategory } from "@/types/products";

// Define form types to avoid 'any'
interface SubcategoryForm {
  name: string;
  unit?: string;
  pricePerUnit?: string | number;
}

interface FormData {
  category: string;
  subcategories: SubcategoryForm[];
}

export default function CustomBazarProductsPage() {
  const { data, isLoading } = useGetAllCustomBazarProductsQuery();
  const [deleteCategory] = useDeleteCustomProductMutation();
  const [updateCategory] = useUpdateCustomBazarProductMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<FormData>({
    category: "",
    subcategories: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (isLoading) return <Spinner />;

  // Defensive check for data array
  const categories: Category[] = Array.isArray(data?.data) ? data.data : [];

  // Pagination
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (categoryId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId).unwrap();
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        // Adjust page if last item deleted
        if (paginatedCategories.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        }
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire("Error!", "Failed to delete the category.", "error");
      }
    }
  };

  const handleEditClick = (category: Category & { subcategories?: Subcategory[] }) => {
    setEditingCategory(category);
    setFormData({
      category: category.category ?? category.name ?? "",
      subcategories: (category.subcategories ?? []).map((sub) => ({
        name: sub.name ?? "",
        unit: sub.unit ?? "",
        pricePerUnit: sub.pricePerUnit ?? "",
      })),
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    try {
      await updateCategory({
        id: editingCategory._id,
        data: formData,
      }).unwrap();
      setEditModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSubcategoryChange = (
    index: number,
    field: keyof SubcategoryForm,
    value: string | number
  ) => {
    const updated = [...formData.subcategories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subcategories: updated });
  };

  const handleAddSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { name: "", unit: "", pricePerUnit: "" }],
    });
  };

  const handleRemoveSubcategory = (index: number) => {
    const updated = [...formData.subcategories];
    updated.splice(index, 1);
    setFormData({ ...formData, subcategories: updated });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Custom Bazar Products</h2>

      {categories.length === 0 && (
        <div className="text-sm text-muted-foreground">No categories found.</div>
      )}

      {paginatedCategories.map((categoryItem) => (
        <div key={categoryItem._id} className="mb-6 border rounded-lg p-4 shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{categoryItem.category ?? categoryItem.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(categoryItem)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(categoryItem._id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Unit</th>
                <th className="p-2 border text-left">Price Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {(categoryItem.subcategories ?? []).map((sub, index) => (
                <tr key={index}>
                  <td className="p-2 border">{sub.name}</td>
                  <td className="p-2 border">{sub.unit}</td>
                  <td className="p-2 border">{sub.pricePerUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="self-center text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Category</h3>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <label className="block mb-2 text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border w-full p-2 mb-4 rounded"
            />

            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Subcategories</h4>
              <button
                onClick={handleAddSubcategory}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Subcategory
              </button>
            </div>

            <div className="space-y-3">
              {formData.subcategories.map((sub, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-5">
                    <label className="block text-xs font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) =>
                        handleSubcategoryChange(idx, "name", e.target.value)
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs font-medium mb-1">Unit</label>
                    <input
                      type="text"
                      value={sub.unit}
                      onChange={(e) =>
                        handleSubcategoryChange(idx, "unit", e.target.value)
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs font-medium mb-1">Price Per Unit</label>
                    <input
                      type="number"
                      value={sub.pricePerUnit}
                      onChange={(e) =>
                        handleSubcategoryChange(idx, "pricePerUnit", Number(e.target.value))
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleRemoveSubcategory(idx)}
                      className="px-1 p-2 mt-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      title="Remove"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

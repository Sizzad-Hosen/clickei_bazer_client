'use client';

import { useState } from "react";
import {
  useGetAllCustomBazarProductsQuery,
  useDeleteCustomProductMutation,
  useUpdateCustomBazarProductMutation,
} from "@/redux/features/CustomBazar/customBazarApi";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { MdDelete } from "react-icons/md";
import { TCustomProduct, UnitType } from "@/types/CustomBazar";
import { toast } from "sonner";

interface SubcategoryForm {
  name: string;
  unit: string;
  size: string;
  pricePerUnit: string;
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
  const [editingCategory, setEditingCategory] = useState<TCustomProduct | null>(null);
  const [formData, setFormData] = useState<FormData>({ category: "", subcategories: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories: TCustomProduct[] = Array.isArray(data?.data) ? data.data : [];
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // DELETE CATEGORY
  const handleDelete = async (categoryId: string) => {
    if (!confirm("Do you really want to delete this category?")) return;

    try {
      await deleteCategory(categoryId).unwrap();
      alert("Category deleted successfully!");
      if (paginatedCategories.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete the category.");
    }
  };

  // EDIT CATEGORY
  const handleEditClick = (category: TCustomProduct) => {
    setEditingCategory(category);
    setFormData({
      category: category.category ?? "",
      subcategories: (category.subcategories ?? []).map((sub) => ({
        name: sub.name ?? "",
        unit: sub.unit ?? "",
        size: sub.size ?? "",
        pricePerUnit: sub.pricePerUnit?.toString() ?? "",
      })),
    });
    setEditModalOpen(true);
  };

  // UPDATE CATEGORY
  const handleUpdate = async () => {
    if (!editingCategory) return;

    if (!formData.category.trim()) {
      alert("Category name is required.");
      return;
    }

    if (
      formData.subcategories.some(
        (sub) =>
          !sub.name.trim() ||
          !sub.unit.trim() ||
          !sub.size.trim() ||
          !sub.pricePerUnit ||
          Number(sub.pricePerUnit) <= 0
      )
    ) {
      alert("All subcategory fields are required and price must be positive.");
      return;
    }

    const transformedData: Partial<TCustomProduct> = {
      category: formData.category.trim(),
      subcategories: formData.subcategories.map((sub) => ({
        name: sub.name.trim(),
        unit: sub.unit as UnitType,
        size: sub.size.trim(),
        pricePerUnit: Number(sub.pricePerUnit),
      })),
    };

    try {
      await updateCategory({ id: editingCategory._id, data: transformedData }).unwrap();
      setEditModalOpen(false);
      setEditingCategory(null);
      toast.success("Category updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      toast("Failed to update the category.");
    }
  };

  // SUBCATEGORY HANDLERS
  const handleSubcategoryChange = (index: number, field: keyof SubcategoryForm, value: string) => {
    const updated = [...formData.subcategories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subcategories: updated });
  };

  const handleAddSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { name: "", unit: "", size: "", pricePerUnit: "" }],
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

      {isLoading && <Spinner />}

      {!isLoading && categories.length === 0 && (
        <div className="text-sm text-muted-foreground">No categories found.</div>
      )}

      {!isLoading &&
        paginatedCategories.map((categoryItem) => (
          <div key={categoryItem._id} className="mb-6 border rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{categoryItem.category}</h3>
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
                  <th className="p-2 border text-left">Size</th>
                  <th className="p-2 border text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {(categoryItem.subcategories ?? []).map((sub, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{sub.name}</td>
                    <td className="p-2 border">{sub.unit}</td>
                    <td className="p-2 border">{sub.size}</td>
                    <td className="p-2 border">{sub.pricePerUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

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

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Category</h3>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                type="button"
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
                type="button"
              >
                Add Subcategory
              </button>
            </div>

            <div className="space-y-3">
              {formData.subcategories.map((sub, idx) => (
                <div key={idx} className="border p-3 rounded grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleSubcategoryChange(idx, "name", e.target.value)}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="block text-xs font-medium mb-1">Unit</label>
                    <input
                      type="text"
                      value={sub.unit}
                      onChange={(e) => handleSubcategoryChange(idx, "unit", e.target.value)}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-medium mb-1">Size</label>
                    <input
                      type="text"
                      value={sub.size}
                      onChange={(e) => handleSubcategoryChange(idx, "size", e.target.value)}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="block text-xs font-medium mb-1">Price</label>
                    <input
                      type="number"
                      min={0}
                      value={sub.pricePerUnit}
                      onChange={(e) =>
                        handleSubcategoryChange(idx, "pricePerUnit", e.target.value)
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-2 flex justify-end">
                    <button
                      onClick={() => handleRemoveSubcategory(idx)}
                      className="px-2 py-1 mt-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      title="Remove"
                      type="button"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant={"secondary"} onClick={handleUpdate} type="button">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import Pagination from "../../../atoms/Pagination";
import TableHeader from "../../../molecules/TableHeader";
import { useBlogCategoryStore } from "../../../../stores/blogCategoryStore";
import { Trash2 } from "lucide-react";
import { FiRefreshCw } from "react-icons/fi";
import { PAGINATION_CONFIG } from "../../../../constants/pagination";

const TrashBlogCategoryTemplate: React.FC = () => {
  const {
    trashBlogCategories,
    fetchTrashBlogCategories,
    restoreBlogCategory,
    deleteBlogCategoryPermanently,
    totalPages,
    loading,
    error,
  } = useBlogCategoryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);

  useEffect(() => {
    fetchTrashBlogCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
  }, [currentPage, fetchTrashBlogCategories]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredData = trashBlogCategories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (id: string) => {
    const blog = trashBlogCategories.find((b) => b._id === id);
    if (!blog) return;

    const result = await Swal.fire({
      title: "Restore?",
      text: `Restore "${blog.name}" from trash?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, restore",
    });

    if (!result.isConfirmed) return;

    try {
      await restoreBlogCategory(id);
      toast.success(`"${blog.name}" restored successfully`);
      fetchTrashBlogCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch (err: any) {
      console.error("Restore error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Restore failed");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const blog = trashBlogCategories.find((b) => b._id === id);
    if (!blog) return;

    const result = await Swal.fire({
      title: "Do you want to delete permanently?",
      text: `The category "${blog.name}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete permanently",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBlogCategoryPermanently(id);
      toast.success(`"${blog.name}" permanently deleted`);
      fetchTrashBlogCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Blog Category Trash"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Categories"
        addButtonLink="/blog-category"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                S.NO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  Trash is empty
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    {(index + 1) + (currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT}
                  </td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleRestore(item._id!)}
                        title="Restore"
                        className="text-green-600 hover:scale-110 transition"
                      >
                        <FiRefreshCw size={18} />
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(item._id!)}
                        title="Delete Permanently"
                        className="text-red-600 hover:scale-110 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default TrashBlogCategoryTemplate;
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import TableHeader from "../../../molecules/TableHeader";
import { useBlogStore } from "../../../../stores/blogStore";
import { Trash2 } from "lucide-react";
import { FiRefreshCw } from "react-icons/fi";
import { PAGINATION_CONFIG } from "../../../../constants/pagination";

const BlogTrashTemplate: React.FC = () => {
  const { trashedBlogs, fetchTrashBlogs, restoreBlog, permanentDeleteBlog, loading } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);

  useEffect(() => {
    fetchTrashBlogs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
  }, [currentPage, fetchTrashBlogs]);

  const filteredData = trashedBlogs.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRestore = async (id: string) => {
    const blog = trashedBlogs.find(b => b._id === id);
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
      await restoreBlog(id);
      toast.success(`"${blog.name}" restored successfully`);
      fetchTrashBlogs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch (err: any) {
      toast.error(err?.message || "Restore failed");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const blog = trashedBlogs.find(b => b._id === id);
    if (!blog) return;

    const result = await Swal.fire({
      title: "Delete permanently?",
      text: `Blog "${blog.name}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete permanently",
    });

    if (!result.isConfirmed) return;

    try {
      await permanentDeleteBlog(id);
      toast.success(`"${blog.name}" permanently deleted`);
      fetchTrashBlogs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Trash Blogs"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Blogs"
        addButtonLink="/blogs"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">Trash is empty</td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">{(index + 1) + (currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.slug}</td>
                  <td className="px-6 py-4">{typeof item.categoryId === 'object' ? item.categoryId.name : item.categoryId || '-'}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button onClick={() => handleRestore(item._id)} className="text-green-600 hover:scale-110 transition"><FiRefreshCw size={18} /></button>
                    <button onClick={() => handlePermanentDelete(item._id)} className="text-red-600 hover:scale-110 transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogTrashTemplate;
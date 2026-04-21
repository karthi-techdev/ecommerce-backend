import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import TableHeader from "../../molecules/TableHeader";
import Loader from "../../atoms/Loader";
import Pagination from "../../atoms/Pagination";
import { useCommentStore } from "../../../stores/commentsStore";
import { Trash2, ToggleLeft, ToggleRight, RefreshCw, XCircle, CheckCircle, Star, ExternalLink } from "lucide-react";
import { PAGINATION_CONFIG } from "../../../constants/pagination";

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: "up" | "down";
  change: string;
  icon: React.ReactNode;
}

const CommentListTemplate: React.FC = () => {
  const {
    comments,
    fetchComments,
    deleteComment,
    toggleCommentStatus,
    loading,
    error,
    currentPage,
    totalPages,
    totalComments,
    totalActive,
    totalInactive,
  } = useCommentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("total");

  //  Filter
  const filteredComments = comments.filter((c) =>
    c.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetchComments(1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
  }, [selectedFilter]);


  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  //  Pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchComments(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
  };

  const totalCount =
    selectedFilter === "active"
      ? totalActive
      : selectedFilter === "inactive"
        ? totalInactive
        : totalComments;

  const calculatedTotalPages = Math.ceil(
    totalCount / PAGINATION_CONFIG.DEFAULT_LIMIT
  );

  // Toggle
  const handleToggleStatus = async (comment: any) => {
    const action = comment.isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this comment?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleCommentStatus(comment._id);
        toast.success(`Comment ${action}d successfully!`);
      } catch {
        toast.error("Failed to update status.");
      }
    }
  };

  //  Delete
  const handleDelete = async (comment: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will delete this comment permanently!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteComment(comment._id);
        toast.success("Comment deleted successfully!");
      } catch {
        toast.error("Failed to delete comment.");
      }
    }
  };

  // Stats 
  const statFilters: StatFilter[] = [
    {
      id: "total",
      title: "Total",
      value: totalComments,
      trend: "up",
      change: "100%",
      icon: <RefreshCw size={20} />,
    },
    {
      id: 'active',
      title: 'Active',
      value: totalActive,
      trend: 'up',
      change: `${totalComments ? Math.round((totalActive / totalComments) * 100) : 0}%`,
      icon: <CheckCircle size={20} />
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: totalInactive,
      trend: 'down',
      change: `${totalComments ? Math.round((totalInactive / totalComments) * 100) : 0}%`,
      icon: <XCircle size={20} />
    }
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Comments"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel=""
        addButtonLink=""
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => setSelectedFilter(id)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>

                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Website</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No comments available
                  </td>
                </tr>
              ) : (
                filteredComments.map((c, index) => (
                  <tr key={c._id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">{c.name}</td>

                    <td className="px-6 py-4 text-sm text-gray-900">{c.email}</td>

                    <td className="px-6 py-4 text-sm text-gray-900">{c.comment}</td>

                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 text-yellow-500 text-xs font-medium">
                        {c.rating || 0}

                        <Star size={12} fill="currentColor" />
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {c.image ? (
                        <img
                          src={`http://localhost:5000/${c.image}`}
                          className="w-12 h-12 object-cover rounded-md "
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {c.website ? (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open website"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition group"
                        >

                          <span className="group-hover:underline">Visit</span>
                          <ExternalLink size={14} className="opacity-70" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`${c.isActive
                          ? "text-green-500 hover:text-green-700"
                          : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {c.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>



                    {/*  Actions */}
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleDelete(c)}
                        className="text-red-500 hover:text-orange-700 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {calculatedTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={calculatedTotalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommentListTemplate;
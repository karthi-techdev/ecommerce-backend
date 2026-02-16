import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import TableHeader from "../../molecules/TableHeader";
import Loader from "../../atoms/Loader";
import Pagination from "../../atoms/Pagination";
import { usePageStore } from "../../../stores/pageStore";
import type { Page } from "../../../types/common";
import { Layers,CheckCircle,XCircle,Pencil,Trash2,ToggleLeft,ToggleRight} from "lucide-react";
// import { truncate } from "../../utils/helper";
import { PAGINATION_CONFIG } from "../../../constants/pagination";
// ,FileText,Link2,
interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: "up" | "down";
  change: string;
  icon: React.ReactNode;
}

const PageListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const { pages,stats,loading,error,totalPages,fetchPages,hardDeletePages,toggleStatusPages } = usePageStore(); 
  // ,FileText,Link2,
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );

  type FilterType = "total" | "active" | "inactive";
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("total");

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPages(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );
      } catch (err: any) {
        toast.error(err?.message || "Failed to load pages");
      }
    };

    loadData();
  }, [currentPage, selectedFilter, fetchPages]);

  useEffect(() => {
    if (error && !error.toLowerCase().includes("exists")) {
      toast.error(error);
    }
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredPages = pages.filter((item) => {
    if (!item) return false;

    const name = item.name ?? "";
    const slug = item.slug ?? "";
    const description = item.description ?? "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const statFilters: StatFilter[] = [
    {
      id: "total",
      title: "Total",
      value: stats.total,
      trend: "up",
      change: "100%",
      icon: <Layers size={20} />,
    },
    {
      id: "active",
      title: "Active",
      value: stats.active,
      trend: "up",
      change: `${Math.round(
        (stats.active / (stats.total || 1)) * 100
      )}%`,
      icon: <CheckCircle size={20} />,
    },
    {
      id: "inactive",
      title: "Inactive",
      value: stats.inactive,
      trend: "down",
      change: `${Math.round(
        (stats.inactive / (stats.total || 1)) * 100
      )}%`,
      icon: <XCircle size={20} />,
    },
  ];

  const handleToggleStatus = async (item: Page) => {
    const action = item.isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this page?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleStatusPages(item._id!);

        await fetchPages(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );

        toast.success(`Page ${action}d successfully`);
      } catch {
        toast.error("Failed to update status");
      }
    }
  };

  const handleDelete = (item: Page) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${item.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // await deletePages(item._id!); this is for soft delete... when use it un command this
          await hardDeletePages(item._id!);

          await fetchPages(
            currentPage,
            PAGINATION_CONFIG.DEFAULT_LIMIT,
            selectedFilter
          );

          Swal.fire("Deleted!", "Page removed.", "success");
        } catch {
          toast.error("Failed to delete page");
        }
      }
    });
  };

  const shouldShowPagination = totalPages > 1 && (filteredPages.length === PAGINATION_CONFIG.DEFAULT_LIMIT || currentPage > 1);
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Pages"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/page/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as FilterType);
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">S.NO</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Name</th>
                {/* <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Slug</th> */}
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Type</th>
                {/* <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left">Description</th> */}
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                filteredPages.map((item: Page, index: number) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    {/* <td className="px-6 py-4 text-sm text-gray-600">{item.slug}</td> */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm">
                        {item.type === "content" ? (
                          <>
                            {/* <FileText size={16} /> */}
                            Content
                          </>
                        ) : (
                          <>
                            {/* <Link2 size={16} /> */}
                            URL
                          </>
                        )}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-600">{truncate(item.description || "-", 40)}</td> */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title={
                          item.isActive ? "Deactivate" : "Activate"
                        }
                      >
                        {item.isActive ? (
                          <ToggleRight
                            className="text-green-500"
                            size={18}
                          />
                        ) : (
                          <ToggleLeft
                            className="text-gray-400"
                            size={18}
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => navigate(`/page/edit/${item._id}`)}
                          className="text-blue-500 hover:text-blue-700" title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700">
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
      </div>
      {shouldShowPagination && (
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

export default PageListTemplate;

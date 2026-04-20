import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import { useBlogStore } from '../../../stores/blogStore';
import { ToggleLeft, ToggleRight, Pencil, Trash2, List, CheckCircle, XCircle } from 'lucide-react';

type FilterType = 'total' | 'active' | 'inactive';

const BlogListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, fetchBlogs, toggleBlogStatus, deleteBlog, loading } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Move "${name}" to trash?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, move',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteBlog(id);
      toast.success(`"${name}" moved to trash`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to move to trash');
    }
  };

  const handleToggleStatus = async (id: string, name: string, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate';
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} "${name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });
    if (!result.isConfirmed) return;

    try {
      await toggleBlogStatus(id);
      toast.success(`"${name}" ${action}d successfully`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  if (loading) return <Loader />;

  const filteredBlogs = blogs
    .filter(blog => blog.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(blog => {
      if (selectedFilter === 'active') return blog.isActive;
      if (selectedFilter === 'inactive') return !blog.isActive;
      return true;
    });

  return (
    <div className="p-6">
      <TableHeader
        managementName="Blogs"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/blogs/add"
        statFilters={[
          { id: 'total', title: 'Total', value: blogs.length, trend: 'up', change: '100%', icon: <List size={20} /> },
          { id: 'active', title: 'Active', value: blogs.filter(b => b.isActive).length, trend: 'up', change: `${blogs.length ? Math.round((blogs.filter(b => b.isActive).length / blogs.length) * 100) : 0}%`, icon: <CheckCircle size={20} /> },
          { id: 'inactive', title: 'Inactive', value: blogs.filter(b => !b.isActive).length, trend: 'down', change: `${blogs.length ? Math.round((blogs.filter(b => !b.isActive).length / blogs.length) * 100) : 0}%`, icon: <XCircle size={20} /> },
        ]}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => setSelectedFilter(id as FilterType)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-400 py-4">No data to display.</td></tr>
            ) : (
              filteredBlogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{blog.name || '-'}</td>
                  <td className="px-6 py-4">{blog.slug || '-'}</td>
                  <td className="px-6 py-4">{(blog.categoryId as any)?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleStatus(blog._id, blog.name, blog.isActive)}>
                      {blog.isActive ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => navigate(`/blogs/edit/${blog._id}`)} className="text-indigo-500 hover:text-indigo-700"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(blog._id, blog.name)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
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

export default BlogListTemplate;
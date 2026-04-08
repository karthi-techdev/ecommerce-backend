import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../atoms/Loader";
import { useBlogStore } from "../../../stores/blogStore";
import placeholderImage from "../../../assets/placeholder-image.jpeg";
import ImportedURL from "../../../common/urls";

const BlogViewTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchBlogById } = useBlogStore();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogById(id as string);
        console.log("Fetched Blog Data:", data);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadBlog();
  }, [id, fetchBlogById]);

  if (loading) return <Loader />;

  if (!blog) {
    return (
      <div className="p-8">
        <p className="text-gray-500 text-lg">No blog found.</p>
      </div>
    );
  }

  const baseUrl = ImportedURL.LIVEURL.replace(/\/$/, "");
  const imageUrl =
    blog.image?.startsWith("http")
      ? blog.image
      : `${baseUrl}/uploads/blog/${blog.image}`;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

        <h1 className="text-xl font-semibold text-gray-900">
          View Blog
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/blogs")}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition font-medium"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium shadow-sm"
          >
            ✏️ Edit
          </button>

        </div>

      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-8 max-w-5xl">

        {/* Image */}
        <div >
          <p className="text-sm font-medium text-gray-500 uppercase mb-5">
            Image
          </p>

          <div className="w-72 h-44 rounded-xl border overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={blog.image ? imageUrl : placeholderImage}
              alt="Blog"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log("Image failed to load:", imageUrl);
                (e.currentTarget as HTMLImageElement).src =
                  placeholderImage;
              }}
            />
          </div>
        </div>

        {/* Grid Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Name */}
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Name
            </p>

            <p className="text-lg text-gray-700">
              {blog.name || "-"}
            </p>
          </div>

          {/* Slug */}
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Slug
            </p>

            <p className="text-lg text-gray-700">
              {blog.slug || "-"}
            </p>
          </div>

          {/* Category */}
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase mb-2">
              Category
            </p>

            <p className="text-lg text-gray-700">
              {blog.categoryId?.name || "-"}
            </p>
          </div>

          {/* Status */}
          <div >
            <p className="text-sm font-medium text-gray-500 uppercase mb-2">
              Status
            </p>

            <span
              className={
                blog.isActive
                  ? "inline-block px-3 py-1 text-base font-semibold rounded-full bg-green-100 text-green-700"
                  : "inline-block px-3 py-1 text-base font-semibold rounded-full bg-red-100 text-red-700"
              }
            >
              {blog.isActive ? "Active" : "Inactive"}
            </span>
          </div>

        </div>

        {/* Description */}
        <div >
          <p className="text-sm font-medium text-gray-500 uppercase mb-2">
            Description
          </p>

          {blog.description ? (
            <div
              className=" text-lg text-gray-900"
              dangerouslySetInnerHTML={{
                __html: blog.description
              }}
            />
          ) : (
            <p className="text-gray-400 italic">
              No description available
            </p>
          )}
        </div>

      </div>

    </div>
  );
};

export default BlogViewTemplate;
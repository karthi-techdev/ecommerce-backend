"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../../stores/productStore";
import Loader from "../../atoms/Loader";
import { Pencil } from "lucide-react"

const BASE_URL = "http://localhost:5000";

const ProductViewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchProductById, loading } = useProductStore();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const data = await fetchProductById(id);
      setProduct(data);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.thumbnail || product.images?.[0] || null);
    }
  }, [product]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  if (loading) return <Loader />;
  
  if (!product) {
    return <div className="p-6 text-center">No Product Found</div>;
  }

  const parsedColors = product.colors?.map((c: any) => {
  try {
    return JSON.parse(c);
  } catch {
    return c;
  }
}).flat();


  const allImages = [
    product.thumbnail,
    ...(product.images || []),
  ].filter(Boolean);

  return (
    <div className="p-6 space-y-6">
     
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

        <h1 className="text-xl font-semibold text-gray-900">
          View Product
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/products")}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition font-medium"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate(`/products/edit/${product._id}`)}
            className=" flex  justify-center items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-md"
          >
           <Pencil size={15} />  Edit
          </button>

        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">


        <div className="space-y-4">


          <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border overflow-hidden">
            {activeImage ? (
              <img
                src={`${BASE_URL}${activeImage}`}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
            ) : (
              <p className="text-gray-400">No Image</p>
            )}
          </div>


          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {allImages.map((img: string, i: number) => (
                <img
                  key={i}
                  src={`${BASE_URL}${img}`}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${activeImage === img
                      ? "border-2 border-indigo-600"
                      : "border-gray-300"
                    }`}
                />
              ))}
            </div>
          )}
        </div>


        <div className="space-y-5">


          {(product.name)?.trim() && (
            <h1 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h1>
          )}

          {(product.title)?.trim() && (
            <h1 className="text-xl font-bold text-gray-800">
              {product.title}
            </h1>
          )}


          {product.status && (
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${product.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {product.status}
            </span>
          )}


          {(product.price || product.discountPrice) && (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-green-600">
                ₹{product.discountPrice || product.price}
              </span>

              {product.discountPrice && (
                <span className="line-through text-gray-400">
                  ₹{product.price}
                </span>
              )}
            </div>
          )}


          <div className="flex flex-wrap gap-6 text-sm text-gray-600">

            {product.stockQuantity !== undefined && (
              <p>
                <span className="font-medium text-gray-800">Stock:</span>{" "}
                {product.stockQuantity > 0
                  ? product.stockQuantity
                  : "Out of Stock"}
              </p>
            )}

            {product.sku?.trim() && (
              <p>
                <span className="font-medium text-gray-800">SKU:</span>{" "}
                {product.sku}
              </p>
            )}

            {product.brandId?.name?.trim() && (
              <p>
                <span className="font-medium text-gray-800">Brand:</span>{" "}
                {product.brandId.name}
              </p>
            )}

            {product.mainCategoryId?.name?.trim() && (
              <p>
                <span className="font-medium text-gray-800">Maincategory:</span>{" "}
                {product.mainCategoryId.name}
              </p>
            )}
            {product.subCategoryId?.name?.trim() && (
              <p>
                <span className="font-medium text-gray-800">Subcategory:</span>{" "}
                {product.subCategoryId.name}
              </p>
            )}
            {product.categoryId?.name?.trim() && (
              <p>
                <span className="font-medium text-gray-800">Category:</span>{" "}
                {product.categoryId.name}
              </p>
            )}

            {product.createdAt && (
              <p>
                <span className="font-medium text-gray-800">Created:</span>{" "}
                {formatDate(product.createdAt)}
              </p>
            )}
          </div>


          {product.shortDescription?.trim() && (
            <div>
              <h2 className="font-semibold">Short Description</h2>
              <p className="text-lg font-medium text-gray-800 ">
  {product.shortDescription.substring(0, 50)}...
</p>
            </div>
          )}


          {product.longDescription?.trim() && (
            <div>
              <h2 className="font-semibold">Long Description</h2>
              <p className="text-gray-600 leading-7 tracking-wide">
                {product.longDescription.substring(0, 120)}...
              </p>
            </div>
          )}


          {product.highlights?.trim() && (
            <div>
              <h2 className="font-semibold">Highlights</h2>
              <p>{product.highlights}</p>
            </div>
          )}

{parsedColors?.length > 0 && (
  <div>
    <h2 className="font-semibold">Colors</h2>

    <div className="flex gap-2 mt-2">
      {parsedColors.map((c: string, i: number) => (
        <div
          key={i}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: c,
            border: "1px solid #ccc"
          }}
        />
      ))}
    </div>
  </div>
)}


          {product.relatedTags?.length > 0 && (
            <div>
              <h2 className="font-semibold">Tags</h2>
              <div className="flex gap-2 flex-wrap">
                {product.relatedTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
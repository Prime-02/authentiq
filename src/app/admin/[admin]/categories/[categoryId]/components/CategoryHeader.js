// app/admin/[adminId]/categories/[categoryId]/components/CategoryHeader.js
"use client";
import React from "react";
import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const CategoryHeader = ({ category, productCount }) => {
  const params = useParams();
  const router = useRouter();

  if (!category) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <button
            onClick={() => router.push(`/admin/${params.adminId}/categories`)}
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Categories
          </button>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium">
            {category.name}
          </span>
        </nav>
      </div>

      {/* Category Info Card */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Category Image */}
            <div className="w-32 h-32 rounded-xl bg-[var(--bg-tertiary)] shrink-0 overflow-hidden">
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-[var(--text-muted)]" />
                </div>
              )}
            </div>

            {/* Category Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    {category.name}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        category.is_active !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          category.is_active !== false
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      {category.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </h1>
                  {category.description && (
                    <p className="text-sm text-[var(--text-muted)] mt-2 max-w-2xl">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[var(--primary-600)]">
                      {productCount || 0}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;

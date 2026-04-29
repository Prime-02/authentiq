import Link from "next/link";

const ProductBreadcrumb = ({ product }) => {
  return (
    <nav className="flex items-center gap-2 text-sm md:text-base flex-wrap">
      <Link href="/" className="text-gray-600 hover:text-gray-900">
        Home
      </Link>
      <span className="text-gray-400">/</span>
      {product?.category_id && (
        <>
          <Link
            href={`/category/${product?.category_name?.toLowerCase()?.replace(/\s+/g, "-") || "category"}`}
            className="text-gray-600 hover:text-gray-900"
          >
            {product?.category_name || "Category"}
          </Link>
          <span className="text-gray-400">/</span>
        </>
      )}
      <span className="text-gray-900 font-semibold truncate">
        {product?.name || "Product"}
      </span>
    </nav>
  );
};

export default ProductBreadcrumb;

const ProductInfo = ({ product, sizes, selectedSize, onSizeSelect }) => {
  const inStock = product?.stock_quantity > 0;
  const lowStock = product?.stock_quantity > 0 && product?.stock_quantity <= 5;

  return (
    <>
      {/* Product Name and Price */}
      <div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {product?.name}
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-3xl md:text-4xl font-bold text-green-600">
            ${product?.price?.toLocaleString()}
          </p>
          {product?.original_price &&
            product.original_price > product.price && (
              <p className="text-xl text-gray-400 line-through">
                ${product.original_price.toLocaleString()}
              </p>
            )}
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            inStock ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm md:text-base font-medium">
          {!inStock
            ? "Out of Stock"
            : lowStock
              ? `Only ${product.stock_quantity} left in stock`
              : "In Stock"}
        </span>
      </div>

      {/* Product Description */}
      {product?.description && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Size: {selectedSize}</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInfo;

import Barcode from "@/components/barcode/BarcodePage";

const ProductDetails = ({ product }) => {
  return (
    <div className="mt-12 p-6 card rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {product?.barcode && (
          <div>
            <p className="text-sm text-gray-500">Barcode</p>
            <Barcode
              value={product.barcode}
              height={25}
              displayValue={false}
              width={1}
            />
          </div>
        )}
        {product?.sizes && (
          <div>
            <p className="text-sm text-gray-500">Available Sizes</p>
            <p className="font-semibold">
              {product.sizes.replace(/,/g, ", ")}
            </p>
          </div>
        )}
        {product?.stock_quantity !== undefined && (
          <div>
            <p className="text-sm text-gray-500">Stock Quantity</p>
            <p className="font-semibold">{product.stock_quantity} units</p>
          </div>
        )}
        {product?.created_at && (
          <div>
            <p className="text-sm text-gray-500">Added</p>
            <p className="font-semibold">
              {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
import { Truck, Shield, RotateCcw } from "lucide-react";

const ProductFeatures = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
      <div className="flex items-center gap-3">
        <Truck size={24} className="text-gray-600" />
        <div>
          <p className="font-semibold text-sm">Free Shipping</p>
          <p className="text-xs text-gray-500">On orders over $50</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Shield size={24} className="text-gray-600" />
        <div>
          <p className="font-semibold text-sm">Secure Payment</p>
          <p className="text-xs text-gray-500">100% secure checkout</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <RotateCcw size={24} className="text-gray-600" />
        <div>
          <p className="font-semibold text-sm">Easy Returns</p>
          <p className="text-xs text-gray-500">30-day return policy</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;

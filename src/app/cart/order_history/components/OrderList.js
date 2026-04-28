// components/OrderList.jsx
import React from "react";
import OrderCard from "./OrderCard";

const OrderList = ({
  orders,
  onViewOrder,
  onCancelOrder,
  cancellingOrderId,
  loadingMutation,
}) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewOrder={onViewOrder}
          onCancelOrder={onCancelOrder}
          isCancelling={cancellingOrderId === order.id}
          loadingMutation={loadingMutation}
        />
      ))}
    </div>
  );
};

export default OrderList;

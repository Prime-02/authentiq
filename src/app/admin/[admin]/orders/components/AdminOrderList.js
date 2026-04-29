// components/AdminOrderList.jsx
import React from "react";
import AdminOrderCard from "./AdminOrderCard";

const AdminOrderList = ({
  orders,
  onViewOrder,
  onStatusUpdate,
  loadingMutation,
}) => {
  if (!orders.length) return null;

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <AdminOrderCard
          key={order.id}
          order={order}
          onViewOrder={onViewOrder}
          onStatusUpdate={onStatusUpdate}
          loadingMutation={loadingMutation}
        />
      ))}
    </div>
  );
};

export default AdminOrderList;

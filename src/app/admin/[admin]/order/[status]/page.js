"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "@/components/Loader/Loader";
import { TableFooter } from "@mui/material";
import axios from "axios";

const OrdersByStatusPage = () => {
  const { status } = useParams(); // Get the status parameter from the route
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { formData, fetchOrders, setFormData, getToken, loading } = useGlobalState();
  const orders = formData.orders;
  const token = getToken(`admin`); // Assuming you have the token in the formData state


  useEffect(() => {
    const fetchAndFilterOrders = async () => {
      try {
        setLoadingOrder(true);

        // Fetch orders if they are not already fetched
        if (!orders || orders.length === 0) {
          await fetchOrders();
        }

        // Filter orders after ensuring they are available
        const statusFilteredOrders = formData.orders.filter(
          (order) => order.status === status
        );
        setFilteredOrders(statusFilteredOrders);
      } catch (error) {
        console.error("Error fetching or filtering orders:", error);
        toast.error("Failed to fetch orders. Please try again.");
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchAndFilterOrders();
  }, [status, orders, fetchOrders, formData.orders]);

const [updatingOrderId, setUpdatingOrderId] = useState(null); 

const updateOrderStatus = async (orderId, newStatus) => {
  setStatusLoading(true);
  setUpdatingOrderId(orderId); // Track the specific order being updated
  try {
    const response = await axios.put(
      `https://isans.pythonanywhere.com/shop/orderstatus/${orderId}/`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 500
    ) {
      // Update the local state with the new status
      setFormData((prevFormData) => ({
        ...prevFormData,
        orders: prevFormData.orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ),
      }));
      toast.success("Order status updated successfully.");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status. Please try again.");
  } finally {
    setStatusLoading(false);
    setUpdatingOrderId(null); // Clear the updating order ID
    fetchOrders(); // Re-fetch the orders
  }
};

  return (
    <main className="w-full overflow-x-hidden">
      <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </h2>

        <div className="w-full overflow-x-scroll pb-8">
          {/* Orders Table */}
          <table className="min-w-[90rem] border-collapse">
            <thead>
              <tr className="card">
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Total Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Delivery Company
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Order Date
                </th>
              </tr>
            </thead>
            {loadingOrder ? (
              <tfoot>
                <tr>
                  <td colSpan="7" className="text-center">
                    <Loader />
                  </td>
                </tr>
              </tfoot>
            ) : filteredOrders.length > 0 ? (
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 text-sm">
                      {order.product_details.name}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <p>{order.user_details.first_name}</p>
                      <p className="text-xs">{order.user_details.email}</p>
                      <p className="text-xs">
                        {order.user_details.shipping_address.street},{" "}
                        {order.user_details.shipping_address.city},{" "}
                        {order.user_details.shipping_address.state}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-sm">{order.quantity}</td>
                    <td className="px-4 py-2 text-sm">${order.total_price}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        {statusLoading && order.id === updatingOrderId ? (
                          <Loader smaillerSize="small" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            disabled={
                              statusLoading && order.id === updatingOrderId
                            } // Disable while loading for this specific order
                            className="border px-2 py-1 rounded card"
                          >
                            <option value="pending">Pending</option>
                            <option value="packaged">Processing</option>
                            <option value="sent_out">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {order.delivery_company.name}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tfoot>
                <tr>
                  <td colSpan="7" className="text-center">
                    No orders found for this status.
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </main>
  );
};

export default OrdersByStatusPage;

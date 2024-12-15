"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "@/components/Loader/Loader";

const AdminOrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusLoading, setStatusLoading] = useState(null);
  const ordersPerPage = 10;
  const { getToken } = useGlobalState();
  const token = getToken("admin");
  const { fetchOrders, setFormData, formData, loading } = useGlobalState();

  const orders = formData.orders;

  const updateOrderStatus = async (orderId, newStatusId) => {
    setStatusLoading(orderId);
    try {
      const response = await axios.put(
        `https://isans.pythonanywhere.com/shop/orderstatus/${orderId}/`,
        { status: newStatusId },
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
        setFormData((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatusId } : order
          )
        );
        toast.success("Order status updated successfully.");
        console.log("Order status updated response:", response.data);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
      fetchOrders();
    } finally {
      setStatusLoading(null);
      fetchOrders();
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="w-full overflow-x-hidden">
      <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">All</h2>
        {loading === "admin_order" ? (
          <div>
            <Loader />
          </div>
        ) : orders.length > 0 ? (
          <div className="w-full overflow-x-scroll  pb-8">
            {/* Orders Table */}
            <table className="min-w-[90rem] border-collapse ">
              <thead>
                <tr className="card">
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Product
                  </th>
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Customer
                  </th>
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Quantity
                  </th>
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Total Price
                  </th>
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Delivery Company
                  </th>
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className=" px-4 py-2 text-left text-sm font-medium">
                    Order Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className=" px-4 py-2 text-sm">
                      {order.product_details.name}
                    </td>
                    <td className=" px-4 py-2 text-sm">
                      <p>{order.user_details.first_name}</p>
                      <p className="text-xs">{order.user_details.email}</p>
                      <p className="text-xs">
                        {order.user_details.shipping_address.street},{" "}
                        {order.user_details.shipping_address.city},{" "}
                        {order.user_details.shipping_address.state}
                      </p>
                    </td>
                    <td className=" px-4 py-2 text-sm">{order.quantity}</td>
                    <td className=" px-4 py-2 text-sm">${order.total_price}</td>
                    <td className=" px-4 py-2 text-sm">
                      {order.delivery_company.name}
                    </td>
                    <td className=" px-4 py-2 text-sm w-full flex items-center justify-center">
                      {statusLoading === order.id ? (
                        <div>
                          <Loader smaillerSize="322" />
                        </div>
                      ) : (
                        <select
                          defaultValue={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="border card rounded p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="packaged">Processing</option>
                          <option value="sent_out">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      )}
                    </td>
                    <td className=" px-4 py-2 text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <p className="text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </main>
  );
};

export default AdminOrdersPage;

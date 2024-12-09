"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/GlobalStateProvider";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ordersPerPage = 10;
  const {getToken} = useGlobalState()
  const token = getToken(`admin`)

  // Fetch data from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/admin-orders/",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with the actual token
          },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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
    <div className=" mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <div>
          {/* Orders Table */}
          <table className="min-w-[90rem] border-collapse border border-gray-300">
            <thead>
              <tr className="card">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Product
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Customer
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Total Price
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Delivery Company
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium ">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr
                  key={order.id}
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
                    {order.product_details.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
                    <p>{order.user_details.first_name}</p>
                    <p className=" text-xs">
                      {order.user_details.email}
                    </p>
                    <p className=" text-xs">
                      {order.user_details.shipping_address.street},{" "}
                      {order.user_details.shipping_address.city},{" "}
                      {order.user_details.shipping_address.state}
                    </p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
                    {order.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
                    ${order.total_price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
                    {order.delivery_company.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm ">
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
            <p className="text-sm ">
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
  );
};

export default AdminOrdersPage;

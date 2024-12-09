"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import React, { useState } from "react";

const Page = () => {
  const { formData } = useGlobalState();
  const orderHistory = formData.userOrderHistory;

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(orderHistory?.length / ordersPerPage);

  // Get current page orders
  const currentOrders = orderHistory?.slice(
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

  return (
    <div className="min-w-[90rem] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-6">Order History</h2>

      {orderHistory && orderHistory.length > 0 ? (
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Product Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  User
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Total Price
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Delivery Company
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {order.product.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {order.user}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {order.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    ${order.total_price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    <div>
                      <p>{order.delivery_company.name}</p>
                      <p className="text-gray-500 text-xs">
                        {order.delivery_company.contact_number}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.delivery_company.branch},{" "}
                        {order.delivery_company.state}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.delivery_company.address}
                      </p>
                      <a
                        href={order.delivery_company.website}
                        target="_blank"
                        className="text-blue-500 hover:underline text-xs"
                      >
                        Visit Website
                      </a>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
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
            <p className="text-sm text-gray-600">
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
        <p>No order history available.</p>
      )}
    </div>
  );
};

export default Page;

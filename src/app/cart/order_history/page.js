"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import React, { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { PiPackage } from "react-icons/pi";
import { MdOutlinePendingActions } from "react-icons/md";


const Page = () => {
  const { formData, formatBalance } = useGlobalState();
  const orderHistory = formData.userOrderHistory;
  const statuses = [
    { status: "Pending", icon: <MdOutlinePendingActions size={18} /> },
    { status: "Packaged", icon: <PiPackage size={18} /> },
    { status: "Shipped", icon: <TbTruckDelivery size={18} /> },
    { status: "Delivered", icon: <IoMdCheckmarkCircleOutline size={18} /> },
  ];

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

  const getStatusProgress = (status) => {
    switch (status) {
      case "pending":
        return { width: "25%", bgColor: "bg-yellow-500" };
      case "packaged":
        return { width: "50%", bgColor: "bg-blue-500" };
      case "sent_out":
        return { width: "75%", bgColor: "bg-purple-500" };
      case "delivered":
        return { width: "100%", bgColor: "bg-green-500" };
      case "canceled":
        return { width: "100%", bgColor: "bg-red-500" };
      default:
        return { width: "0%", bgColor: "card" };
    }
  };

  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className=" mx-auto  py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-6">Order History</h2>

      {orderHistory && orderHistory.length > 0 ? (
        <div className="w-full overflow-x-scroll">
          <table className=" border-collapse  min-w-[90rem]">
            <thead
              className="border-b border-gray-300 my-4"
            >
              <tr className="card">
                <th className=" px-4 py-2 text-left text-sm font-medium ">#</th>
                <th className=" px-4 py-2 text-left text-sm font-medium ">
                  Product Name
                </th>
                <th className=" px-4 py-2 text-left text-sm font-medium ">
                  User
                </th>
                <th className=" px-4 py-2 text-left text-sm font-medium ">
                  Quantity
                </th>
                <th className=" px-4 py-2 text-left text-sm font-medium ">
                  Total Price
                </th>
                {/* <th className=" px-4 py-2 text-left text-sm font-medium ">
                  Status
                </th> */}
                <th className=" px-4 py-2 text-left text-sm font-medium ">
                  Delivery Company
                </th>
                <th className=" px-4 py-2 text-left text-sm font-medium ">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => {
                const { width, bgColor } = getStatusProgress(order.status);
                return (
                  <React.Fragment key={order.id}>
                    <tr className={`${index % 2 === 0 ? "card" : "card"}`}>
                      <td className=" px-4 py-2 text-sm ">{index + 1}</td>
                      <td className=" px-4 py-2 text-sm ">
                        {order.product.name}
                      </td>
                      <td className=" px-4 py-2 text-sm ">{order.user}</td>
                      <td className=" px-4 py-2 text-sm ">{order.quantity}</td>
                      <td className=" px-4 py-2 text-sm ">
                        ${order.total_price}
                      </td>
                      {/* <td className=" px-4 py-2 text-sm ">
                        <p className="text-xs  mt-1">
                          {formatStatus(order.status)}
                        </p>
                      </td> */}
                      <td className=" px-4 py-2 text-sm ">
                        <div>
                          <p>{order.delivery_company.name}</p>
                          <p className=" text-xs">
                            {order.delivery_company.contact_number}
                          </p>
                          <p className=" text-xs">
                            {order.delivery_company.branch},{" "}
                            {order.delivery_company.state}
                          </p>
                          <p className=" text-xs">
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
                      <td className=" px-4 py-2 text-sm ">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={8} className="px-4 py-2">
                        <div>
                          <span className="py-2 font-light  text-sm">
                            Progress:
                          </span>
                          <div className="w-full h-1 card rounded-lg overflow-hidden flex flex-col">
                            <div
                              className={`${bgColor} h-full`}
                              style={{ width }}
                            ></div>
                          </div>
                          {order.status === "canceled" ? (
                            <span className="flex w-full justify-center text-xs my-2">
                              Canceled
                            </span>
                          ) : (
                            <span className="flex w-full justify-evenly text-xs my-2">
                              {statuses.map((status, ind) => (
                                <span key={ind} className="flex items-center">
                                  <p>{status.status}</p>
                                  <p>{status.icon}</p>
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
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
        <p>No order history available.</p>
      )}
    </div>
  );
};

export default Page;

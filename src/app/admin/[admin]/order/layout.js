"use client";
import Link from "next/link";
import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { PiPackage } from "react-icons/pi";
import { MdCancel, MdCategory, MdOutlinePendingActions } from "react-icons/md";
import { usePathname } from "next/navigation"; // Use usePathname for Next.js 13+
import { useGlobalState } from "@/app/GlobalStateProvider";


const Layout = ({ children }) => {
  const pathname = usePathname(); // Get the current pathname
  const {formData} = useGlobalState()
const adminRoute = formData.adminFirstName ? formData.adminFirstName : 'admin';
  const statusHeader = [
    {
      route: `/admin/${adminRoute}/order`,
      status: "All",
      icon: <MdCategory size={18} />,
    },
    {
      route: `/admin/${adminRoute}/order/pending`,
      status: "Pending",
      icon: <MdOutlinePendingActions size={18} />,
    },
    {
      route: `/admin/${adminRoute}/order/packaged`,
      status: "Packaged",
      icon: <PiPackage size={18} />,
    },
    {
      route: `/admin/${adminRoute}/order/sent_out`,
      status: "Shipped",
      icon: <TbTruckDelivery size={18} />,
    },
    {
      route: `/admin/${adminRoute}/order/delivered`,
      status: "Delivered",
      icon: <IoMdCheckmarkCircleOutline size={18} />,
    },
    {
      route: `/admin/${adminRoute}/order/canceled`,
      status: "Canceled",
      icon: <MdCancel size={18} />,
    },
  ];

  return (
    <div>
      <header className="w-full text-xs flex gap-x-5 py-8 px-4 sm:px-6 lg:px-8">
        {statusHeader.map((status, ind) => (
          <Link
            href={status.route}
            key={ind}
            className={`flex items-center gap-x-2 ${
              pathname === status.route ||
              (pathname.startsWith(status.route) &&
                status.route !== "/admin/admin/order")
                ? "card px-3 py-1 rounded-lg"
                : ""
            }`}
          >
            <p className="hidden sm:flex">{status.status}</p>
            <p>{status.icon}</p>
          </Link>
        ))}
      </header>
      {children}
    </div>
  );
};

export default Layout;

// components/DeliveryCompanyOrders.jsx
import React, { useEffect, useState } from "react";
import { useDeliveryCompanyStore } from "@/stores";
import Modal from "@/components/Modal/Modal";
import {
  Package,
  Loader2,
  X,
  MapPin,
  User,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DeliveryCompanyOrders = ({ companyId, onClose }) => {
  const { fetchCompanyOrders, loadingCompanies } = useDeliveryCompanyStore();
  const [ordersData, setOrdersData] = useState({
    items: [],
    pagination: {
      page: 1,
      per_page: 20,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadOrders(currentPage);
  }, [companyId, currentPage]);

  const loadOrders = async (page = 1) => {
    const data = await fetchCompanyOrders(companyId, {
      page,
      perPage: 20,
    });
    setOrdersData(data);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { items: orders, pagination } = ordersData;

  return (
    <Modal isOpen={true} onClose={onClose} title="Company Orders">
      <div className="space-y-6">
        {/* Orders List */}
        {loadingCompanies ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="text-primary-600 animate-spin mb-3" />
            <p className="text-secondary">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-muted mx-auto mb-3" />
            <p className="text-secondary">No orders assigned to this company</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-secondary rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Order #{order.id}</span>
                    <span className="text-sm font-medium text-primary-600">
                      ₦{order.total_amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {order.user?.first_name} {order.user?.last_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {order.delivery_state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted">
                  Showing {(pagination.page - 1) * pagination.per_page + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.per_page,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default DeliveryCompanyOrders;

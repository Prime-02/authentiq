// app/admin/delivery-companies/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useDeliveryCompanyStore } from "@/stores";
import DeliveryCompanyList from "./components/DeliveryCompanyList";
import DeliveryCompanyForm from "./components/DeliveryCompanyForm";
import DeliveryCompanyOrders from "./components/DeliveryCompanyOrders";
import ReassignOrdersModal from "./components/ReassignOrdersModal";
import DeleteCompanyModal from "./components/DeleteCompanyModal";
import {
  Truck,
  Plus,
  Search,
  Building2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const DeliveryCompaniesAdminPage = () => {
  const { fetchAllDeliveryCompanies, loadingCompanies } =
    useDeliveryCompanyStore();

  const [companiesData, setCompaniesData] = useState({
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

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceAreaFilter, setServiceAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingOrders, setViewingOrders] = useState(null);
  const [reassignCompany, setReassignCompany] = useState(null);
  const [deletingCompany, setDeletingCompany] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load companies when filters change
  useEffect(() => {
    loadCompanies();
  }, [currentPage, debouncedSearch, serviceAreaFilter, statusFilter]);

  const loadCompanies = async () => {
    const filters = {
      page: currentPage,
      perPage: 20,
    };

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }

    if (serviceAreaFilter !== "all") {
      filters.serviceArea = serviceAreaFilter;
    }

    if (statusFilter !== "all") {
      filters.isActive = statusFilter === "active";
    }

    const data = await fetchAllDeliveryCompanies(filters);
    setCompaniesData(data);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadCompanies();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { items: companies, pagination } = companiesData;

  return (
    <main className="w-full mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 size={32} className="text-primary-600" />
              Delivery Companies
            </h1>
            <p className="text-secondary mt-1">
              Manage delivery companies and their orders
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 btn btn-md btn-primary"
          >
            <Plus size={20} />
            Add Company
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search by name, branch, state, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={serviceAreaFilter}
                onChange={(e) => setServiceAreaFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
              >
                <option value="all">All Service Areas</option>
                <option value="local">Local</option>
                <option value="regional">Regional</option>
                <option value="nationwide">Nationwide</option>
                <option value="worldwide">Worldwide</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {!loadingCompanies && companies.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Showing {(pagination.page - 1) * pagination.per_page + 1} -{" "}
              {Math.min(
                pagination.page * pagination.per_page,
                pagination.total,
              )}{" "}
              of {pagination.total} companies
            </span>
          </div>
        )}

        {/* Loading State */}
        {loadingCompanies && companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-primary-600 animate-spin mb-4" />
            <p className="text-secondary">Loading companies...</p>
          </div>
        ) : (
          <>
            <DeliveryCompanyList
              companies={companies}
              onEdit={handleEdit}
              onViewOrders={setViewingOrders}
              onReassign={setReassignCompany}
              onDelete={setDeletingCompany}
              onToggleActive={async (companyId, isActive) => {
                await useDeliveryCompanyStore
                  .getState()
                  .setDeliveryCompanyActive(companyId, isActive);
                loadCompanies();
              }}
            />

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: pagination.total_pages },
                    (_, i) => i + 1,
                  )
                    .filter((page) => {
                      // Show first page, last page, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.total_pages ||
                        Math.abs(page - pagination.page) <= 2
                      );
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-muted">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            page === pagination.page
                              ? "bg-primary-600 text-white"
                              : "border border-border hover:bg-secondary"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <DeliveryCompanyForm
          company={editingCompany}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* View Orders Modal */}
      {viewingOrders && (
        <DeliveryCompanyOrders
          companyId={viewingOrders}
          onClose={() => setViewingOrders(null)}
        />
      )}

      {/* Reassign Orders Modal */}
      {reassignCompany && (
        <ReassignOrdersModal
          company={reassignCompany}
          companies={companies}
          onClose={() => setReassignCompany(null)}
          onSuccess={() => {
            setReassignCompany(null);
            loadCompanies();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCompany && (
        <DeleteCompanyModal
          company={deletingCompany}
          onClose={() => setDeletingCompany(null)}
          onSuccess={() => {
            setDeletingCompany(null);
            loadCompanies();
          }}
        />
      )}
    </main>
  );
};

export default DeliveryCompaniesAdminPage;

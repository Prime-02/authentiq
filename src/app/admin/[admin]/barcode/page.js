"use client";

import { useBarcodeStore } from "@/stores/useBarcodeStore"; // Changed import
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import JsBarcode from "jsbarcode";

import StatCard from "./components/StatCard";
import BarcodeTable from "./components/BarcodeTable";
import BarcodeCard from "./components/BarcodeCard";
import BulkBar from "./components/BulkBar";
import Pagination from "./components/Pagination";
import ReassignModal from "./components/ReassignModal";
import { statPercent } from "./components/barcodeUtils";
import ExtendModal from "./components/ExtendModal";
import Toolbar from "./components/ToolBar";

const FilteredBarcodesPage = () => {
  const { status } = useParams();

  // Use new store
  const {
    barcodes,
    statistics,
    pagination,
    loadingBarcodes,
    loadingStatistics,
    fetchBarcodes,
    fetchStatistics,
    updateBarcodeStatus,
    bulkUpdateBarcodeStatus,
    extendExpiry,
    reassignBarcode,
    deleteBarcode,
    setPage,
    setPageSize,
  } = useBarcodeStore();

  const [productId, setProductId] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [viewMode, setViewMode] = useState("card");
  const [extendModal, setExtendModal] = useState(null);
  const [extending, setExtending] = useState(false)
  const [reassignModal, setReassignModal] = useState(null);
  const [extendDays, setExtendDays] = useState(365);
  const [reassignProductId, setReassignProductId] = useState("");

  const statusFilter = status === "all" ? null : status;
  const { page, pageSize, total, totalPages } = pagination;

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchStatistics();
  }, []); // Only fetch once on mount

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [statusFilter, productId, pageSize, expiryFilter, search]);

  useEffect(() => {
    fetchBarcodes({
      page,
      pageSize,
      statusFilter,
      productId: productId || undefined,
      search,
      expiryFilter: expiryFilter || undefined,
    });
  }, [page, pageSize, statusFilter, productId, search, expiryFilter]);

  const refetchAll = () => {
    fetchBarcodes({
      page,
      pageSize,
      statusFilter,
      productId: productId || undefined,
      search,
      expiryFilter: expiryFilter || undefined,
    });
    fetchStatistics();
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const downloadBarcode = (code) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, code, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 60,
      displayValue: true,
    });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${code}.png`;
    a.click();
  };

  const copyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleSelect = (id) =>
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected(
      selected.size === barcodes.length
        ? new Set()
        : new Set(barcodes.map((b) => b.id)),
    );

  const handleRowAction = async (action, barcode, extra) => {
    setOpenMenuId(null);

    try {
      if (action === "extend") {
        setExtendModal(barcode);
        setExtendDays(365);
      } else if (action === "reassign") {
        setReassignModal(barcode);
        setReassignProductId(barcode.product_id ?? "");
      } else if (action === "status") {
        await updateBarcodeStatus(barcode.id, extra);
        toast.success(`Marked barcode as ${extra}.`);
        refetchAll();
      } else if (action === "delete") {
        if (!confirm("Delete this barcode? This cannot be undone.")) return;
        await deleteBarcode(barcode.id);
        refetchAll();
      }
    } catch (error) {
      const msg =
        error.response?.data?.detail || `Failed to ${action} barcode.`;
      toast.error(msg);
    }
  };

  // ── API mutations (using store) ──────────────────────────────────────────
  const updateStatus = async (ids, newStatus) => {
    try {
      if (ids.length === 1) {
        await updateBarcodeStatus(ids[0], newStatus);
      } else {
        await bulkUpdateBarcodeStatus(ids, newStatus);
      }
      toast.success(`Marked ${ids.length} barcode(s) as ${newStatus}.`);
      refetchAll();
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to update status.";
      toast.error(msg);
    }
  };

  const deleteBulk = async () => {
    if (!confirm(`Delete ${selected.size} barcode(s)? This cannot be undone.`))
      return;
    try {
      await Promise.all([...selected].map((id) => deleteBarcode(id)));
      toast.success(`Deleted ${selected.size} barcode(s).`);
      setSelected(new Set());
      refetchAll();
    } catch (error) {
      const msg = error.response?.data?.detail || "Some deletions failed.";
      toast.error(msg);
    }
  };

  const confirmExtend = async () => {
    setExtending(true);
    try {
      await extendExpiry(extendModal.id, extendDays);
      setExtendModal(null);
      refetchAll();
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to extend expiry.";
      toast.error(msg);
    } finally {
      setExtending(false);
    }
  };

  const confirmReassign = async () => {
    try {
      await reassignBarcode(reassignModal.id, reassignProductId || null);
      toast.success("Barcode reassigned.");
      setReassignModal(null);
      refetchAll();
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to reassign barcode.";
      toast.error(msg);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const actionProps = {
    copiedId,
    openMenuId,
    onDownload: downloadBarcode,
    onCopy: copyCode,
    onMenuToggle: (id) => setOpenMenuId(openMenuId === id ? null : id),
    onMenuClose: () => setOpenMenuId(null),
    products: [], // You'll need to get products from a products store or prop
    onAction: handleRowAction,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto p-4 font-Poppins">
      {/* Stats */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total barcodes"
            value={statistics.total?.toLocaleString()}
            color="text-slate-800 dark:text-slate-100"
            accent="bg-indigo-500"
            sub="all time"
          />
          <StatCard
            label="Active"
            value={statistics.active?.toLocaleString()}
            color="text-green-700"
            accent="bg-green-500"
            sub={statPercent(statistics.active, statistics.total)}
          />
          <StatCard
            label="Used"
            value={statistics.used?.toLocaleString()}
            color="text-blue-700"
            accent="bg-blue-500"
            sub={statPercent(statistics.used, statistics.total)}
          />
          <StatCard
            label="Expired"
            value={statistics.expired?.toLocaleString()}
            color="text-red-700"
            accent="bg-red-500"
            sub="needs attention"
          />
        </div>
      )}

      <h1
        className="font-Montserrat text-2xl font-bold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Barcodes
      </h1>

      <Toolbar
        productId={productId}
        setProductId={setProductId}
        expiryFilter={expiryFilter}
        setExpiryFilter={setExpiryFilter}
        search={search}
        setSearch={setSearch}
        limit={pageSize}
        setLimit={setPageSize}
        setSkip={() => {}} // No longer needed
        products={[]} // Pass products from appropriate source
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {selected.size > 0 && (
        <BulkBar
          selected={selected}
          onUpdateStatus={updateStatus}
          onDeleteBulk={deleteBulk}
          onDeselect={() => setSelected(new Set())}
        />
      )}

      {loadingBarcodes ? (
        <div
          className="card rounded-xl border py-16 text-center text-sm font-Poppins"
          style={{
            borderColor: "var(--border-light)",
            color: "var(--text-muted)",
          }}
        >
          Loading barcodes…
        </div>
      ) : barcodes.length === 0 ? (
        <div
          className="card rounded-xl border py-16 text-center text-sm font-Poppins"
          style={{
            borderColor: "var(--border-light)",
            color: "var(--text-muted)",
          }}
        >
          No barcodes found for this filter.
        </div>
      ) : viewMode === "table" ? (
        <div
          className="card rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--border-light)" }}
        >
          <BarcodeTable
            barcodes={barcodes}
            selected={selected}
            onToggle={toggleSelect}
            onToggleAll={toggleAll}
            {...actionProps}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {barcodes.map((b) => (
            <BarcodeCard
              key={b.id}
              b={b}
              isSel={selected.has(b.id)}
              onToggle={toggleSelect}
              {...actionProps}
            />
          ))}
        </div>
      )}

      {!loadingBarcodes && barcodes.length > 0 && (
        <Pagination
          skip={(page - 1) * pageSize}
          limit={pageSize}
          barcodeCount={barcodes.length}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
          total={total}
          currentPage={page}
          totalPages={totalPages}
        />
      )}

      {extendModal && (
        <ExtendModal
          extendModal={extendModal}
          extendDays={extendDays}
          setExtendDays={setExtendDays}
          onClose={() => setExtendModal(null)}
          loading={extending}
          onConfirm={confirmExtend}
        />
      )}
      {reassignModal && (
        <ReassignModal
          reassignModal={reassignModal}
          reassignProductId={reassignProductId}
          setReassignProductId={setReassignProductId}
          products={[]} // Pass products from appropriate source
          onClose={() => setReassignModal(null)}
          onConfirm={confirmReassign}
        />
      )}
    </div>
  );
};

export default FilteredBarcodesPage;

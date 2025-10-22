import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import DataTable from "../../components/reusable/DataTable";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllRequests } from "../../api/documentApi";
import { showCustomToast } from "../../components/Toast/CustomToast";
import ViewRequestModal from "../../components/modals/ViewRequestModal";
import StatCard from "../../components/reusable/StatCard";
import {
  HourglassIcon,
  CheckCircle,
  Clock,
  XCircle,
  MailCheck,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const MyRequests = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sort_by: "created_at",
    order: "desc",
  });
  const [status, setStatus] = useState("");
  const [expandedStatus, setExpandedStatus] = useState(null);
  const scrollRef = React.useRef(null);

  const requestColumns = [
    {
      label: "Transaction ID",
      accessor: "transaction_id",
      sortable: true,
    },
    {
      label: "Document Name",
      accessor: "document_details",
      sortable: true,
      render: (docDetails) => (
        <span className="text-sm font-medium text-gray-800">
          {docDetails?.document_name || "N/A"}
        </span>
      ),
    },
    {
      label: "Request Date",
      accessor: "created_at",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === "pending"
              ? "bg-yellow-50 text-yellow-700"
              : value === "processing"
              ? "bg-blue-50 text-blue-700"
              : value === "approved"
              ? "bg-green-50 text-green-700"
              : value === "ready for pickup" || value === "ready to pickup"
              ? "bg-purple-50 text-purple-700"
              : value === "released"
              ? "bg-emerald-50 text-emerald-700"
              : value === "rejected"
              ? "bg-red-50 text-red-700"
              : "bg-gray-50 text-gray-700"
          }`}
        >
          {value
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      ),
    },
  ];

  const statusCards = [
    {
      icon: <HourglassIcon className="text-yellow-600" />,
      label: "Pending Requests",
      value: requests.filter((req) => req.status === "pending").length,
      color: "bg-yellow-50 border-yellow-100",
    },
    {
      icon: <Clock className="text-blue-600" />,
      label: "Processing",
      value: requests.filter((req) => req.status === "processing").length,
      color: "bg-blue-50 border-blue-100",
    },
    {
      icon: <CheckCircle className="text-green-600" />,
      label: "Approved",
      value: requests.filter((req) => req.status === "approved").length,
      color: "bg-green-50 border-green-100",
    },
    {
      icon: <MailCheck className="text-purple-600" />,
      label: "Ready for Pickup",
      value: requests.filter((req) => req.status === "ready to pickup").length,
      color: "bg-purple-50 border-purple-100",
    },
    {
      icon: <CheckCheck className="text-emerald-600" />,
      label: "Released",
      value: requests.filter((req) => req.status === "released").length,
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <XCircle className="text-red-600" />,
      label: "Rejected",
      value: requests.filter((req) => req.status === "rejected").length,
      color: "bg-red-50 border-red-100",
    },
  ];

  const statusLegend = [
    {
      color: "yellow",
      status: "Pending",
      description: "Your request is being reviewed by the barangay staff",
      details: "Initial verification of submitted requirements and details",
    },
    {
      color: "blue",
      status: "Processing",
      description: "Documents are being prepared by the barangay staff",
      details: "Staff is preparing, reviewing, and finalizing your documents",
    },
    {
      color: "green",
      status: "Approved",
      description:
        "Request has been approved and documents are being processed",
      details: "All requirements verified and approved by authorized personnel",
    },
    {
      color: "purple",
      status: "Ready to Pickup",
      description: "Documents are ready for collection at the barangay hall",
      details: [
        "Your documents have been processed and prepared",
        "Please bring a valid ID when claiming",
        "Present your reference number at the barangay hall",
        "Collection hours: Mon-Fri, 8am-5pm",
      ],
    },
    {
      color: "emerald",
      status: "Released",
      description: "Documents have been successfully released to the requestor",
      details: "Transaction completed and documents received by requestor",
    },
    {
      color: "red",
      status: "Rejected",
      description: "Request was not approved due to specific reasons",
      details: [
        "Incomplete or invalid requirements",
        "Expired supporting documents",
        "Incorrect information provided",
        "Unauthorized request",
        "Non-resident of the barangay",
        "Document type not available",
        "Please contact the barangay office for more details",
      ],
    },
  ];

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await getAllRequests({
          per_page: 10,
          page,
          requestor: currentUser?.id,
          status: status || undefined,
          sort_by: sortConfig.sort_by,
          order: sortConfig.order,
        });

        // Make sure we're dealing with arrays
        const requestsData = response?.data?.data || [];
        setRequests(requestsData);
        setTotal(response?.data?.total || 0);

        // Update status cards with proper array handling
        const statusCounts = {
          pending: requestsData.filter((req) => req.status === "pending").length,
          processing: requestsData.filter(
            (req) => req.status === "processing"
          ).length,
          approved: requestsData.filter((req) => req.status === "approved").length,
          ready: requestsData.filter(
            (req) => req.status === "ready to pickup"
          ).length,
          released: requestsData.filter((req) => req.status === "released").length,
          rejected: requestsData.filter((req) => req.status === "rejected").length,
        };

        // Update status cards state
        statusCards.forEach((card) => {
          card.value = statusCounts[card.status] || 0;
        });
      } catch (error) {
        console.error("Load requests error:", error);
        showCustomToast(error.message || "Failed to load requests", "error");
        setRequests([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      loadRequests();
    }
  }, [currentUser, page, sortConfig, status]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction,
    });
  };

  const handleExpandStatus = (status) => {
    setExpandedStatus(expandedStatus === status ? null : status);
  };

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.7;
    scrollRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  // Add getFileUrl function
  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^requirements\//, "");
    return `${storageUrl}/requirements/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Requests Overview
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor your ongoing and completed requests
            </p>
          </div>

          {/* Updated Status Cards Section */}
          <div className="relative w-full mb-8">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-110 transition-all duration-200 shadow-sm hidden sm:block cursor-pointer"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] sm:auto-cols-[minmax(240px,1fr)] gap-4 min-w-max px-0 sm:px-8">
                {statusCards.map((card, index) => (
                  <StatCard
                    key={index}
                    icon={card.icon}
                    label={card.label}
                    value={card.value}
                    color={card.color}
                  />
                ))}
              </div>
            </div>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-110 transition-all duration-200 shadow-sm hidden sm:block cursor-pointer"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Updated Status Legend with collapsible sections */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Request Status Guide
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {statusLegend.map(({ color, status, description, details }) => (
                <div
                  key={status}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => handleExpandStatus(status)}
                    className="w-full p-4 flex items-start justify-between gap-3 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <div
                        className={`mt-1 w-2.5 h-2.5 rounded-full bg-${color}-500 flex-shrink-0`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {status}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 flex-shrink-0 mt-1
                        ${expandedStatus === status ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedStatus === status && (
                    <div className="px-4 pb-4 pt-1">
                      {Array.isArray(details) ? (
                        <ul className="space-y-1 border-t border-gray-100 pt-2">
                          {details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-500 flex items-start gap-2"
                            >
                              <span className="min-w-[4px] h-1 w-1 rounded-full bg-gray-400 mt-1.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                          {details}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main DataTable */}
          <DataTable
            columns={requestColumns}
            data={requests}
            loading={loading}
            enableSearch={true}
            searchPlaceholder="Search by Transaction ID..."
            enablePagination={true}
            enableSelection={false}
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPage={10}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: "View Details",
                onClick: handleViewRequest,
              },
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
            comboBoxFilter={{
              label: "Status",
              value: status,
              onChange: (value) => {
                setStatus(value);
                setPage(1);
              },
              options: [
                { value: "", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "approved", label: "Approved" },
                { value: "ready to pickup", label: "Ready to Pickup" },
                { value: "released", label: "Released" },
                { value: "rejected", label: "Rejected" },
              ],
            }}
          />
        </div>
      </div>

      {/* View Request Modal */}
      <ViewRequestModal
        isOpen={showViewModal}
        isStaff={false}
        onClose={() => {
          setShowViewModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        getFileUrl={getFileUrl} // Add this back
      />
    </div>
  );
};

export default MyRequests;

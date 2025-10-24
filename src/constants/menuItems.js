import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaUserTie,
  FaChevronDown,
  FaCertificate,
  FaUserCog,
  FaArchive,
  FaUserPlus,
  FaUserAlt,
  FaBook,
  FaCommentDots,
  FaChartBar,
  FaEye,
  FaEdit,
  FaCog
} from "react-icons/fa";

const adminMenu = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    label: "Official Management",
    icon: FaUserTie,
    subMenu: [
      { to: "/admin/official-management/officials", label: "Active Officials", icon: FaUsers },
      { to: "/admin/official-management/archived", label: "Archived Officials", icon: FaArchive },
    ],
  },
  {
    label: "Worker Management",
    icon: FaUserCog,
    subMenu: [
      { to: "/admin/workers", label: "Active Workers", icon: FaUsers },
      { to: "/admin/workers/archived", label: "Archived Workers", icon: FaArchive },
    ],
  },
  {
    label: "Residence Management",
    icon: FaUserAlt,
    subMenu: [
      { to: "/admin/resident-management/new", label: "Add Resident", icon: FaUserPlus },
      { to: "/admin/resident-management/all-resident", label: "All Residents", icon: FaUsers },
      { to: "/admin/resident-management/pending", label: "Pending Residents", icon: FaEye },
      { to: "/admin/resident-management/rejected", label: "Rejected Residents", icon: FaArchive },
    ],
  },
  {
    label: "Certificate Management",
    icon: FaCertificate,
    subMenu: [
      { to: "/admin/certificates", label: "All Certificates", icon: FaCertificate },
       { to: "/admin/certificates/logs", label: "Certificate Logs", icon: FaBook },
    ],
  },
  {
    label: "Request Management",
    icon: FaCertificate,
    subMenu: [
      { to: "/admin/requests", label: "View All Requests", icon: FaFileAlt },
     ],
  },
   { to: "/admin/sumbong", label: "View Sumbong Cases", icon: FaBook },
  { to: "/admin/announcements", label: "Announcement Management", icon: FaCommentDots },
  { to: "/admin/feedback", label: "Feedback Reports", icon: FaCommentDots },
  { to: "/admin/configurations", label: "System Configuration", icon: FaCog },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: FaChartBar },
  { to: "/admin/reports", label: "Reports & Analytics", icon: FaChartBar },
];

// Worker menu with limited permissions - no user management, no archiving
const workerMenu = [
  { to: "/worker/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    label: "Request Management",
    icon: FaCertificate,
    subMenu: [
      { to: "/worker/requests", label: "View All Requests", icon: FaFileAlt },
      { to: "/worker/certificates/logs", label: "My Certificate Logs", icon: FaBook },
    ],
  },
  {
    label: "Residence Management",
    icon: FaUserAlt,
    subMenu: [
      { to: "/worker/resident-management/new", label: "Add Resident", icon: FaUserPlus },
      { to: "/worker/resident-management/all-resident", label: "All Residents", icon: FaUsers },
      { to: "/worker/resident-management/pending", label: "Pending Residents", icon: FaEye },
    ],
  },
  {
    label: "Sumbong Management",
    icon: FaBook,
    subMenu: [
      { to: "/worker/sumbong", label: "View Sumbong Cases", icon: FaBook },
    ],
  },
];

const menuItems = {
  admin: adminMenu,
  residence: [
    { to: "/resident/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    {
      label: "Certificates",
      icon: FaCertificate,
      subMenu: [
        { to: "/resident/certificates/available-certificates", label: "Available Certificates", icon: FaCertificate },
        { to: "/resident/certificates/my-requests", label: "My Requests", icon: FaFileAlt },
        { to: "/resident/certificates/logs", label: "Request History", icon: FaBook },
      ],
    },
    {
      label: "Sumbong",
      icon: FaBook,
      subMenu: [
        { to: "/resident/sumbong/my-cases", label: "My Sumbong", icon: FaBook },
      ],
    },
    { to: "/resident/feedback", label: "Submit Feedback", icon: FaCommentDots },
  ],
 staff: workerMenu,
};

export default menuItems;
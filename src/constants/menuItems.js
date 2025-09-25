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
  FaSignOutAlt
} from "react-icons/fa";

const adminMenu = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    label: "Official Management",
    icon: FaUserTie,
    subMenu: [
      { to: "/admin/official-management/officials", label: "Current Officials", icon: FaUsers },
       { to: "/admin/official-management/end-term", label: "End Term Officials", icon: FaArchive },
    ],
  },
  {
    label: "Worker Management",
    icon: FaUserCog,
    subMenu: [
      { to: "/admin/workers", label: "View Workers", icon: FaUsers },
    ],
  },
  {
    label: "Residence Management",
    icon: FaUserAlt,
    subMenu: [
      { to: "/admin/resident-management/new", label: "Add Resident", icon: FaUserPlus },
      { to: "/admin/resident-management/all-resident", label: "All Residents", icon: FaUsers },
      { to: "/admin/resident-management/pending", label: "Pending Residents", icon: FaEye },
      { to: "/admin/resident-management/archived", label: "Archived Residents", icon: FaArchive },
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
  { to: "/admin/blotter", label: "Blotter Management", icon: FaBook },
  { to: "/admin/announcements", label: "Announcement Management", icon: FaCommentDots },
  { to: "/admin/feedback", label: "Feedback Reports", icon: FaCommentDots },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: FaChartBar },
  { to: "/admin/profile", label: "My Profile", icon: FaUserAlt },
];

// Worker menu with limited permissions - no user management, no archiving
const workerMenu = [
  { to: "/worker/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    label: "Request Management",
    icon: FaCertificate,
    subMenu: [
      { to: "/worker/requests/pending", label: "Pending Requests", icon: FaEye },
      { to: "/worker/requests/processed", label: "Processed Requests", icon: FaFileAlt },
      { to: "/worker/certificates/logs", label: "My Certificate Logs", icon: FaBook },
    ],
  },
  {
    label: "Residence Management",
    icon: FaUserAlt,
    subMenu: [
      { to: "/worker/residents/new", label: "Add Resident", icon: FaUserPlus },
      { to: "/worker/residents", label: "All Residents", icon: FaUsers },
      { to: "/worker/residents/pending", label: "Pending Residents", icon: FaEye },
    ],
  },
  {
    label: "Blotter Management",
    icon: FaBook,
    subMenu: [
      { to: "/worker/blotter/new", label: "Create Blotter", icon: FaUserPlus },
      { to: "/worker/blotter", label: "All Blotter Records", icon: FaBook },
    ],
  },
  { to: "/worker/profile", label: "My Profile", icon: FaUserAlt }
];

 

const menuItems = {
  admin: [...adminMenu, { to: "/login", label: "Logout", icon: FaSignOutAlt }],
  residence: [
    { to: "/resident/chatbot", label: "Chatbot Assistant", icon: FaCommentDots },
    {
      label: "Certificates",
      icon: FaCertificate,
      subMenu: [
        { to: "/resident/certificates", label: "Available Certificates", icon: FaCertificate },
        { to: "/resident/certificates/request", label: "Request Certificate", icon: FaFileAlt },
        { to: "/resident/certificates/logs", label: "Request Logs", icon: FaBook },
      ],
    },
    { to: "/resident/feedback", label: "Submit Feedback", icon: FaCommentDots },
    { to: "/resident/profile", label: "My Profile", icon: FaUsers },
    { to: "/logout", label: "Logout", icon: FaSignOutAlt },
  ],
 staff: [...workerMenu, { to: "/logout", label: "Logout", icon: FaSignOutAlt }],
};

export default menuItems;
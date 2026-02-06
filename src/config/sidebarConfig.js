export const SIDEBAR_CONFIG = {
  "super-admin": [
    {
      section: "DASHBOARD",
      items: [{ name: "System Overview", path: "/dashboard/super-admin" }],
    },
    {
      section: "CRP OPERATIONS",
      items: [
        { name: "CRP Management", path: "/dashboard/crp-management" },
        { name: "Attendance Management", path: "/dashboard/attandence" },
        { name: "Task Assignment", path: "#" },
      ],
    },
    {
      section: "FINANCIAL MANAGEMENT",
      items: [{ name: "Honorarium Calculation", path: "" }],
    },
    {
      section: "PROGRAM MANAGEMENT",
      items: [{ name: "Event Management", path: "#" }],
    },
  ],

  "state-admin": [
    {
      section: "DASHBOARD",
      items: [{ name: "State Overview", path: "/dashboard/state-admin" }],
    },
  ],

  "district-admin": [
    {
      section: "DASHBOARD",
      items: [{ name: "District Overview", path: "/dashboard/district-admin" }],
    },
  ],

  supervisor: [
    {
      section: "DASHBOARD",
      items: [{ name: "Supervisor Panel", path: "/dashboard/supervisor" }],
    },
  ],

  finance: [
    {
      section: "FINANCE",
      items: [{ name: "Finance Dashboard", path: "/dashboard/finance" }],
    },
  ],

  crp: [
    {
      section: "CRP DASHBOARD",
      items: [{ name: "My Dashboard", path: "/dashboard/crp" }],
    },
  ],  
};

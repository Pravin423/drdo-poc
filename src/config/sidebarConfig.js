export const SIDEBAR_CONFIG = {
  "super-admin": [
    {
      section: "DASHBOARD",
      items: [{ name: "System Overview", path: "/dashboard/super-admin" }],
    },
    {
      section: "LOCATION MANAGEMENT",
      items: [
        {
          name: "Goa Location",
          subItems: [
            { name: "Districts", path: "/dashboard/location/districts" },
            { name: "Talu+kas", path: "/dashboard/location/talukas" },
            { name: "Villages", path: "/dashboard/location/villages" },
          ],
        },
      ],
    },
    {
      section: "CRP OPERATIONS",
      items: [
        { name: "CRP Management", path: "/dashboard/crp-management" },
        { name: "Attendance Management", path: "/dashboard/attandence" },
        { name: "Task Assignment", path: "/dashboard/task-assignment" },
      ],
    },
    {
      section: "FINANCIAL MANAGEMENT",
      items: [{ name: "Honorarium Calculation", path: "/dashboard/honorarium" }],
    },
    {
      section: "PROGRAM MANAGEMENT",
      items: [{ name: "Event Management", path: "/dashboard/event-management" }],
    },
    {
      section: "USERS & ROLES",
      items: [
        {
          name: "User Management",
          subItems: [
            { name: "Add User",   path: "/dashboard/user-management/add-user" },
            { name: "User List",  path: "/dashboard/user-management/user-list" },
          ],
        },
      ],
    },
    {
      section: "FORMS & SUBMISSIONS",
      items: [
        {
          name: "Activity Forms",
          subItems: [
            { name: "Create Form", path: "/dashboard/activity-forms/create" },
            { name: "All Forms",   path: "/dashboard/activity-forms/all" },
          ],
        },
      ],
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

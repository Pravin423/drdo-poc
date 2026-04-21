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
            { name: "Talukas", path: "/dashboard/location/talukas" },
            { name: "Villages", path: "/dashboard/location/villages" },
          ],
        },
      ],
    },

    {
      section: "CRP OPERATIONS",
      items: [
        {
          name: "CRP Management",
          subItems: [
            { name: "CRP List", path: "/dashboard/crp-management" },
            { name: "CRP SHGs Mapping", path: "/dashboard/crp-management/crp-shg-mapping" },
            { name: "CRP Vertical Mapping", path: "/dashboard/crp-management/crp-vertical-mapping" },
            { name: "CRP Village Mapping", path: "/dashboard/crp-management/crp-village-mapping" },

          ],
        },
        { name: "Attendance Management", path: "/dashboard/attandence" },
      ],
    },
    {
      section: "SHG MANAGEMENT",
      items: [
        { name: "SHG Repository", path: "/dashboard/shg-repository" },
      ],
    },
    {
      section: "VERTICAL MANAGEMENT",
      items: [
        { name: "Verticals", path: "/dashboard/vertical" },
      ]
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
            { name: "Add User", path: "/dashboard/user-management/add-user" },
            { name: "User List", path: "/dashboard/user-management/user-list" },
          ],
        },
      ],
    },
    {
      section: "FORMS & SUBMISSIONS",
      items: [
        {
          name: "Activity Forms",
          path: "/dashboard/activity-forms/all",
        },
      ],
    },
    {
      section: "Task and Assignments",
      items: [
        { name: "All Tasks", path: "/dashboard/task-assignment" }
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

  "supervisor": [
    {
      section: "DASHBOARD",
      items: [{ name: "Supervisor Panel", path: "/dashboard/supervisor" }],
    },
  ],

  "finance": [
    {
      section: "FINANCE",
      items: [{ name: "Finance Dashboard", path: "/dashboard/finance" }],
    },
  ],

  "crp": [
    {
      section: "CRP DASHBOARD",
      items: [{ name: "My Dashboard", path: "/dashboard/crp" }],
    },
  ],
};

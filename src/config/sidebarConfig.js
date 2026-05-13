export const SIDEBAR_CONFIG = {
  "super-admin": [
    {
      section: "DASHBOARD",
      items: [{ name: "System Overview", path: "/dashboard/super-admin" }],
       accessTo:[ 'state-admin'],
      
    },
    {
      section: "LOCATION MANAGEMENT",
      accessTo:[ 'state-admin'],
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
      accessTo:[ 'state-admin'],
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
      accessTo:[ 'state-admin'],
      items: [
        { name: "SHG Repository", path: "/dashboard/shg-repository" },
      ],
    },
    {
      section: "VERTICAL MANAGEMENT",
      accessTo:[ 'state-admin'],
      items: [
        { name: "Verticals", path: "/dashboard/vertical" },
      ]
    },
    {
      section: "FINANCIAL MANAGEMENT",
      accessTo:[ 'state-admin'],
      items: [{ name: "Honorarium Calculation", path: "/dashboard/honorarium" }],
    },
    {
      section: "PROGRAM MANAGEMENT",
      accessTo:[ 'state-admin'],
      items: [{ name: "Event Management", path: "/dashboard/event-management" }],
    },
    {
      section: "USERS & ROLES",
      accessTo:[ 'state-admin'],
      items: [
        {
          name: "User Management",
          path: "/dashboard/user-management/user-list",
        },
      ],
    },
    {
      section: "FORMS & SUBMISSIONS",
      accessTo:[ 'state-admin'],
      items: [
        {
          name: "Activity Forms",
          path: "/dashboard/activity-forms/all",
        },
      ],
    },
    {
      section: "Task and Assignments",
      accessTo:[ 'state-admin'],
      items: [
        { name: "All Tasks", path: "/dashboard/task-assignment" }
      ],
    },
  ],

 

  "district-admin": [
    {
      section: "DASHBOARD",
      items: [{ name: "District Overview", path: "/dashboard/district-admin" }],
    },
  ],

  "state-admin": [
    {
      section: "COMMUNICATION & ESCALATIONS",
      items: [
        { name: "Escalations Inbox", path: "/dashboard/state-admin/escalations" },
      ],
    },
  ],

  "Block-admin": [
    {
      section: "SELF MANAGEMENT",
      items: [
        { name: "My Attendance & Leave", path: "/dashboard/block-admin/self-management" },
      ],
    },
    {
      section: "DASHBOARD",
      items: [
        { name: "Block Overview", path: "/dashboard/block-admin" },
        { name: "Performance across talukas", path: "/dashboard/block-admin/performance" },
        { name: "CRP Performance Insights", path: "/dashboard/block-admin/low-performing-crps" },
      ],
    },
    {
      section: "CRP OPERATIONS",
      items: [
        { name: "View all CRPs under them", path: "/dashboard/crp-management" },
      ],
    },
    {
      section: "COMMUNICATION & ESCALATIONS",
      items: [
        { name: "Escalate to SPM", path: "/dashboard/block-admin/escalations" },
      ],
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

export const getSidebarForRole = (roleOrUser) => {
  // Support both a raw role string or a hydrated User context object
  const userObj = typeof roleOrUser === 'object' ? roleOrUser : { role: roleOrUser };
  const role = userObj?.role;
  const rawRoleName = (userObj?.role_name || "").toLowerCase();

  // Super-admin sees all sections with full access
  if (role === "super-admin") {
    return SIDEBAR_CONFIG["super-admin"];
  }

  // 1. Get the role's own specifically defined sections (if any)
  const ownSections = SIDEBAR_CONFIG[role] ? [...SIDEBAR_CONFIG[role]] : [];

  // 2. Scan super-admin sections for view-only access
  const superAdminSections = SIDEBAR_CONFIG["super-admin"] || [];
  
  const viewOnlySections = superAdminSections
    .filter((section) => {
      // Check the accessTo array for all roles
      return section.accessTo && section.accessTo.includes(role);
    })
    .map((section) => ({
      ...section,
      viewOnly: true,
    }));

  // 3. Combine configurations
  let activeMenus = [...ownSections, ...viewOnlySections];

  // 4. Enforce strict runtime role constraints (e.g. isolate BPM specific modules from general Block Managers)
  if (role === "Block-admin") {
    const isBpm = rawRoleName.includes("block program manager");
    if (!isBpm) {
      // Prune the CRP Operations item for regular Block Managers who share this technical role key
      activeMenus = activeMenus.filter(section => section.section !== "CRP OPERATIONS");
    }
  }

  return activeMenus;
};


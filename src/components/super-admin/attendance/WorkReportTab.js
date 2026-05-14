import React, { useState, useEffect, memo } from "react";
import { 
  ChevronDown, RefreshCw, AlertCircle, Calendar, Timer 
} from "lucide-react";
import DataTable from "../../common/DataTable";

const WorkReportTab = memo(function WorkReportTab({ employees = [] }) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/employee-work-report?user_id=&month=${selectedMonth}&year=${selectedYear}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        const data = await response.json();
        if (data.status === 1 || data.success) {
          setInitialData(data.data || data);
        }
      } catch (err) {
        console.error("Failed to fetch initial report data for users", err);
      }
    };
    fetchInitialData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedEmployee) {
        setReportData(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/employee-work-report?user_id=${selectedEmployee}&month=${selectedMonth}&year=${selectedYear}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        const data = await response.json();
        if (data.status === 1 || data.success) {
          setReportData(data.data || data);
        } else {
          setReportData(data.data || data); 
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the report.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [selectedEmployee, selectedMonth, selectedYear]);

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month - 1, 1).getDay();

  const daysInMonth = getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear));
  const firstDayOfMonth = getFirstDayOfMonth(parseInt(selectedMonth), parseInt(selectedYear));

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const dropdownUsers = initialData?.users || (reportData && reportData.users) || employees || [];

  const empDetailsMatch = dropdownUsers.find(e => {
    const user = e.user || e;
    return user?.id?.toString() === selectedEmployee || user?.crp_id?.toString() === selectedEmployee || user?.username?.toString() === selectedEmployee;
  });
  const empDetails = empDetailsMatch?.user || empDetailsMatch || {};

  const getDayRecord = (day) => {
     if(!reportData || !reportData.calendar) return null;
     return reportData.calendar.find(a => a.day === day);
  };

  const isFutureDay = (day) => {
    if (!day) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, day);
    target.setHours(0, 0, 0, 0);
    return target > today;
  };

  const getDummyStatus = (day) => {
    if (!selectedEmployee) return null;
    
    // Never show absent for future dates
    if (isFutureDay(day)) {
      // Future holidays are still valid to show
      if ([1, 8, 15, 22, 29].includes(day)) return "Holiday";
      return null;
    }

    if ([1, 8, 15, 22, 29].includes(day)) return "Holiday";
    if ([2,3,4,5,6,7,9,10,11,12,13,14, 16,17,18,19,20,21,23,24,25,26,27,28,30,31].includes(day)) return "Absent";
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Employee</label>
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium appearance-none"
              >
                <option value="">Select an employee...</option>
                {dropdownUsers.map((emp, index) => {
                  const user = emp.user || emp;
                  return (
                    <option key={user.id || index} value={user.id}>
                      {user.fullname || user.name || `Employee ${index+1}`} ({user.crp_id || user.employee_id || `CRP00${index+1}`})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Month</label>
             <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium appearance-none"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Year</label>
             <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium appearance-none"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Card: Employee Details */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4 overflow-hidden border-2 border-slate-100 shadow-sm relative">
                {reportData?.userProfile?.profile || empDetails.profile ? (
                  <img src={reportData?.userProfile?.profile || empDetails.profile} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${reportData?.userProfile?.fullname || empDetails.fullname || selectedEmployee}`} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center">
                {reportData?.userProfile?.fullname || empDetails.fullname || empDetails.name || "Employee Name"}
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-6">
                ID: {reportData?.userProfile?.crp_id || empDetails.crp_id || empDetails.employee_id || `CRP00${selectedEmployee}`}
              </p>

              <div className="w-full space-y-4 text-[13px] mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email</span>
                  <span className="font-bold text-slate-900 truncate pl-2 max-w-[150px]">{reportData?.userProfile?.email || empDetails.email || "No Email"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Phone</span>
                  <span className="font-bold text-slate-900">{reportData?.userProfile?.mobile || reportData?.userProfile?.phone || empDetails.mobile || empDetails.phone || "No Phone"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Gender</span>
                  <span className="font-bold text-slate-900">{reportData?.userProfile?.gender || empDetails.gender || "Female"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase text-white bg-emerald-600 rounded">
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[16px] overflow-hidden mb-5">
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.totalWorkingDays ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Working Days</p>
                </div>
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.totalWorkingHours ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Hrs</p>
                </div>
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.daysPayable ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Days Payable</p>
                </div>
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.totalTasksCount ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Tasks</p>
                </div>
              </div>

              <div className="w-full mb-5 px-3">
                 <div className="flex justify-between items-center py-2 border-b border-slate-100/80">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                       <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                         Regular Tasks <span className="text-slate-400 ml-0.5 tracking-normal">({reportData?.regularTasksCount ?? 0})</span>
                       </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹ {reportData?.regularAmount ?? 0}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 mt-1">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
                       <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                         Special Tasks <span className="text-slate-400 ml-0.5 tracking-normal">({reportData?.specialTasksCount ?? 0})</span>
                       </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹ {reportData?.specialAmount ?? 0}</span>
                 </div>
              </div>

              <div className="w-full relative overflow-hidden rounded-[20px] bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-center shadow-[0_8px_20px_rgba(16,185,129,0.25)] border border-emerald-400/30">
                <div className="absolute -right-4 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
                
                <p className="text-[10px] font-extrabold text-emerald-100 uppercase tracking-widest mb-1 shadow-sm relative z-10">Total Honorarium</p>
                <p className="text-[32px] font-black text-white relative z-10 drop-shadow-md tracking-tight leading-none">
                  ₹ {(Number(reportData?.totalHonorarium) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>

            </div>
          </div>

          {/* Right Card: Calendar */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-visible h-full flex flex-col relative z-0">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900">
                      {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Hover on <strong className="text-emerald-600">Present</strong> cards to see check-in details
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-slate-500 text-white rounded-lg text-[11px] font-bold shadow-sm">
                    Today: {new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                
                <div className="flex-1 px-6 pb-6 pt-2">
                    {loading && !reportData ? (
                      <div className="h-full flex items-center justify-center min-h-[400px]">
                          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                      </div>
                    ) : error ? (
                      <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                          <p className="font-semibold text-slate-900">{error}</p>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-white pt-px">
                        {/* Headers */}
                        <div className="grid grid-cols-7 bg-slate-50/70 rounded-2xl border border-slate-200/60 mb-3.5 overflow-hidden">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className={`py-3 text-center text-[11px] font-black uppercase tracking-widest ${day === 'Sun' ? 'text-rose-600' : 'text-slate-500'}`}>
                                {day}
                              </div>
                            ))}
                        </div>
                        
                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-2.5">
                            {calendarDays.map((day, index) => {
                              if (!day) {
                                return <div key={`empty-${index}`} className="min-h-[105px] p-2 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200/60" />
                              }
                              
                              let record = getDayRecord(day);
                              let status = record ? record.status : null;
                              if (!status) {
                                  status = getDummyStatus(day); 
                              }

                              const isSunday = index % 7 === 0;
                              const isFuture = isFutureDay(day);

                              let cellClass = "min-h-[105px] p-3 rounded-2xl border relative transition-all duration-300 flex flex-col items-center justify-center group hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-[1px] ";
                              let textClass = "absolute top-2.5 right-3 text-[12px] font-bold ";
                              let badgeClass = "text-[9px] font-black uppercase tracking-widest mb-1 px-2.5 py-1 rounded-lg border shadow-xs ";

                              if (status === "Holiday" || status === "H" || (isSunday && status !== "A" && status !== "Absent" && status !== "P" && status !== "Present")) {
                                cellClass += "bg-amber-50/30 border-amber-100/70 hover:bg-amber-50 hover:border-amber-200 "; 
                                textClass += "text-rose-500";
                                status = "Holiday";
                                badgeClass += "text-amber-700 bg-white border-amber-100/60";
                              } else if (status === "Absent" || status === "A") {
                                if (isFuture) {
                                  cellClass += "bg-white border-slate-100/80 hover:border-slate-200 ";
                                  textClass += "text-slate-400";
                                  badgeClass = "hidden";
                                  status = null;
                                } else {
                                  cellClass += "bg-rose-50/30 border-rose-100/70 hover:bg-rose-50 hover:border-rose-200 "; 
                                  textClass += "text-slate-900";
                                  badgeClass += "text-rose-600 bg-white border-rose-100/60";
                                  status = "Absent";
                                }
                              } else if (status === "Present" || status === "P") {
                                cellClass += "bg-emerald-50/70 border-emerald-200/80 cursor-pointer hover:bg-emerald-100/60 hover:border-emerald-300/80 "; 
                                textClass += "text-slate-900 font-extrabold";
                                badgeClass += "text-white bg-emerald-600 border-emerald-600 shadow-md shadow-emerald-600/10 group-hover:scale-95 group-hover:opacity-0 transition-all duration-200";
                                status = "Present";
                              } else if (status === "Late" || status === "L") {
                                cellClass += "bg-orange-50/30 border-orange-100/70 hover:bg-orange-50 hover:border-orange-200 "; 
                                textClass += "text-slate-900";
                                badgeClass += "text-orange-600 bg-white border-orange-100/60";
                                status = "Late";
                              } else {
                                cellClass += isFuture 
                                  ? "bg-slate-50/20 border-slate-100/60 opacity-70 hover:opacity-100 hover:bg-slate-50 " 
                                  : "bg-white border-slate-100/80 hover:border-slate-200 ";
                                textClass += isFuture ? "text-slate-300 font-medium" : "text-slate-500 font-bold";
                                badgeClass = "hidden";
                                status = null;
                              }

                              if (day === 17 && status === "Absent" && !record) {
                                  cellClass = cellClass.replace("bg-rose-50/30", "bg-rose-100/50");
                              }

                              return (
                                <div key={day} className={cellClass}>
                                  <span className={textClass}>{day}</span>
                                  {status && status !== "None" && (
                                    <span className={badgeClass}>{status}</span>
                                  )}
                                  
                                  {record?.details && status === "Present" && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] p-4 flex flex-col justify-start opacity-0 pointer-events-none group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out border border-slate-100/50 w-[140px] h-auto ring-1 ring-slate-900/5">
                                      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2 w-full">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                        <p className="text-slate-800 text-[10px] font-extrabold uppercase tracking-widest">
                                           Present
                                        </p>
                                      </div>
                                      
                                      <div className="flex flex-col gap-2.5 w-full">
                                        {record.details.checkin && record.details.checkin !== "-" && (
                                          <div className="flex flex-col w-full">
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Check In</span>
                                            <span className="text-xs text-slate-900 font-black">{record.details.checkin}</span>
                                          </div>
                                        )}
                                        
                                        {record.details.checkout && record.details.checkout !== "-" && (
                                          <div className="flex flex-col w-full">
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Check Out</span>
                                            <span className="text-xs text-slate-900 font-black">{record.details.checkout}</span>
                                          </div>
                                        )}
                                        
                                        {record.details.total_hours && record.details.total_hours !== "0" && (
                                          <div className="flex flex-col w-full mt-0.5 pt-2 border-t border-slate-100">
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Total Time</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm text-blue-600 font-black">{record.details.total_hours}</span>
                                                <span className="text-[9px] text-slate-400 font-bold">hrs</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            {Array.from({ length: (7 - (calendarDays.length % 7)) % 7 }).map((_, i) => (
                              <div key={`pad-${i}`} className="min-h-[105px] p-2 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200/60" />
                            ))}
                        </div>
                      </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Breakdown section */}
      {reportData?.tasks && reportData.tasks.length > 0 && (
        <div className="mt-8">
          <DataTable
            columns={[
              {
                header: "Task Information",
                key: "task_name",
                render: (val, row) => (
                  <div className="py-1">
                    <p className="text-slate-900 font-bold text-sm tracking-tight">{val}</p>
                    {row.task_description && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-[280px] line-clamp-1" title={row.task_description}>
                        {row.task_description}
                      </p>
                    )}
                  </div>
                )
              },
              {
                header: "Categorization",
                key: "task_type",
                render: (val) => (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    val === 'special' 
                      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${val === 'special' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                    {val}
                  </span>
                )
              },
              {
                header: "Assigned Form",
                key: "form_name",
                render: (val) => <span className="text-sm font-semibold text-slate-600">{val || '—'}</span>
              },
              {
                header: "Temporal Range",
                key: "start_date",
                render: (_, row) => (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(row.start_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })} — {new Date(row.end_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      {new Date(row.start_date).getFullYear()}
                    </span>
                  </div>
                )
              },
              {
                header: "Compensation",
                key: "honorarium_amount",
                align: "right",
                render: (val) => (
                  <span className="text-sm font-black text-emerald-600 tracking-tight">
                    ₹ {Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )
              },
              {
                header: "Execution Status",
                key: "status",
                align: "center",
                render: (val) => (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    val === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    val === 'inprogress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-slate-50 text-slate-600 border border-slate-100'
                  }`}>
                    {val}
                  </span>
                )
              }
            ]}
            data={reportData.tasks}
            loading={loading}
            headerActions={
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Assigned Tasks</h3>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                  {reportData.tasks.length} Total
                </span>
              </div>
            }
            footerProps={{
              totalRecords: reportData.tasks.length,
              showPagination: false
            }}
          />
        </div>
      )}
    </div>
  );
});

export default WorkReportTab;

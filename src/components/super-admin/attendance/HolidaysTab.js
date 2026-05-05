import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Edit, Trash2, Tag, Calendar, Activity, MapIcon 
} from "lucide-react";
import DataTable from "../../common/DataTable";
import ConfirmationModal from "../../common/ConfirmationModal";
import { AddHolidayModal, EditHolidayModal } from "./HolidayModals";

const HolidaysTab = memo(function HolidaysTab({ isViewOnly }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Add Modal State ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    holiday_name: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // ── Edit Modal State ──
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    holiday_name: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // ── Delete Confirm State ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const isHoliday = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(h => dateStr >= h.date && dateStr <= (h.end_date || h.date));
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const isToday = (day) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // ── Fetch Holidays ──
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch('/api/holiday', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        let holidayData = data?.data || [];
        if (!Array.isArray(holidayData)) holidayData = [];

        const formatted = holidayData
          .filter(h => h.status === 'active')
          .map((h, index) => {
            const dateObj = new Date(h.start_date);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const normalizedDate = `${yyyy}-${mm}-${dd}`;

            return {
              id: h.id || index,
              name: h.holiday_name,
              date: normalizedDate,
              end_date: h.end_date || normalizedDate,
              status: h.status,
              day: isNaN(dateObj.getTime())
                ? 'N/A'
                : dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
            };
          });

        setHolidays(formatted);
      } catch (err) {
        console.error("Holiday fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // ── Add Holiday Handler ──
  const handleAddHoliday = async () => {
    setAddError('');

    if (!addForm.holiday_name.trim()) return setAddError('Holiday name is required.');
    if (!addForm.start_date) return setAddError('Start date is required.');
    if (!addForm.end_date) return setAddError('End date is required.');
    if (addForm.end_date < addForm.start_date) return setAddError('End date cannot be before start date.');

    setAddLoading(true);
    try {
      const res = await fetch('/api/add-holiday', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();

      if (res.ok && (data.status === 1 || data.status === true)) {
        const dateObj = new Date(addForm.start_date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const normalizedDate = `${yyyy}-${mm}-${dd}`;

        const newHoliday = {
          id: data?.data?.id || Date.now(),
          name: addForm.holiday_name,
          date: normalizedDate,
          end_date: addForm.end_date,
          status: addForm.status,
          day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        };

        setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
        setShowAddModal(false);
        setAddForm({ holiday_name: '', start_date: '', end_date: '', status: 'active' });
      } else {
        setAddError(data?.message || 'Failed to create holiday. Please try again.');
      }
    } catch (err) {
      console.error("Add holiday error:", err);
      setAddError('Something went wrong. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Open Edit Modal ──
  const openEditModal = (holiday) => {
    setEditForm({
      id: holiday.id,
      holiday_name: holiday.name,
      start_date: holiday.date,
      end_date: holiday.end_date || holiday.date,
      status: holiday.status || 'active',
    });
    setEditError('');
    setShowEditModal(true);
  };

  // ── Update Holiday Handler ──
  const handleUpdateHoliday = async () => {
    setEditError('');

    if (!editForm.holiday_name.trim()) return setEditError('Holiday name is required.');
    if (!editForm.start_date) return setEditError('Start date is required.');
    if (!editForm.end_date) return setEditError('End date is required.');
    if (editForm.end_date < editForm.start_date) return setEditError('End date cannot be before start date.');

    setEditLoading(true);
    try {
      const res = await fetch('/api/update-holiday', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok && (data.status === 1 || data.status === true)) {
        const dateObj = new Date(editForm.start_date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const normalizedDate = `${yyyy}-${mm}-${dd}`;

        const updatedHoliday = {
          id: editForm.id,
          name: editForm.holiday_name,
          date: normalizedDate,
          end_date: editForm.end_date,
          status: editForm.status,
          day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        };

        setHolidays(prev =>
          prev
            .map(h => (h.id === editForm.id ? updatedHoliday : h))
            .sort((a, b) => a.date.localeCompare(b.date))
        );
        setShowEditModal(false);
      } else {
        setEditError(data?.message || 'Failed to update holiday. Please try again.');
      }
    } catch (err) {
      console.error("Update holiday error:", err);
      setEditError('Something went wrong. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Open Delete Confirm ──
  const openDeleteModal = (holiday) => {
    setDeleteTarget({ id: holiday.id, name: holiday.name });
    setDeleteError('');
    setShowDeleteModal(true);
  };

  // ── Delete Holiday Handler ──
  const handleDeleteHoliday = async () => {
    if (!deleteTarget?.id) return;
    setDeleteError('');
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/delete-holiday', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      const data = await res.json();

      if (res.ok && (data.status === 1 || data.status === true)) {
        setHolidays(prev => prev.filter(h => h.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        setDeleteError(data?.message || 'Failed to delete holiday. Please try again.');
      }
    } catch (err) {
      console.error("Delete holiday error:", err);
      setDeleteError('Something went wrong. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── Calendar ── */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 h-fit">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h2 className="text-[22px] font-black text-[#111827] tracking-tight shrink-0">Calendar</h2>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="px-3 py-1.5 rounded-[8px] border border-slate-200 bg-white shadow-sm flex justify-center shrink-0">
              <span className="font-extrabold text-[#111827] text-[13px] whitespace-nowrap">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#3b52ab]/20 bg-[#eff2ff] text-[#3b52ab] text-[12px] font-bold hover:bg-[#3b52ab]/10 transition-colors shadow-sm shrink-0"
              title="Go to today"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[11px] font-extrabold text-[#9ca3af] py-2 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5">
          {generateCalendarDays().map((day, idx) => {
            const holi = isHoliday(day);
            const isDayToday = isToday(day);
            return (
              <div
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-[14px] text-[14px] font-bold transition-all relative
                  ${!day ? 'invisible' : 'visible'}
                  ${isDayToday
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.05] z-10'
                    : holi
                      ? 'bg-[#3b52ab] text-white shadow-lg shadow-[#3b52ab]/30 scale-[1.05] z-10'
                      : 'bg-[#fafafa] text-[#374151] hover:bg-slate-100 cursor-pointer border border-transparent'}
                `}
                title={holi ? holi.name : isDayToday ? "Today" : ""}
              >
                {day}
                {holi && <div className="absolute -bottom-1 w-[5px] h-[5px] bg-white rounded-full shadow-sm"></div>}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100/80 flex flex-col gap-3 text-[14px] font-semibold text-[#4b5563]">
          <div className="flex items-center gap-2.5 transition-all hover:translate-x-1">
            <span className="w-3.5 h-3.5 bg-emerald-600 rounded-full inline-block shadow-sm ring-2 ring-emerald-50 shadow-emerald-600/20"></span>
            <span>Today's Date</span>
          </div>
          <div className="flex items-center gap-2.5 transition-all hover:translate-x-1">
            <span className="w-3.5 h-3.5 bg-[#3b52ab] rounded-full inline-block shadow-sm ring-2 ring-[#eff2ff] shadow-[#3b52ab]/20"></span>
            <span>Official Holidays</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Holiday List 2026</h2>
            <p className="text-sm text-slate-500 mt-1">Manage official and regional holidays</p>
          </div>
          {!isViewOnly && (
            <button
              onClick={() => { setShowAddModal(true); setAddError(''); }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a2e7a] rounded-xl hover:bg-[#13225a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              + Add Holiday
            </button>
          )}
        </div>

        <div className="p-0">
          <DataTable
            columns={[
              {
                header: "Calendar Date",
                key: "date",
                render: (val, row) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#eff2ff] to-[#f0f4ff] text-[#3b52ab] flex flex-col items-center justify-center font-bold ring-1 ring-[#3b52ab]/10 flex-shrink-0">
                      <span className="text-lg leading-none mb-0.5">{new Date(val).getDate()}</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#3b52ab]/60">
                        {new Date(val).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{new Date(val).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(val).getFullYear()}</span>
                    </div>
                  </div>
                )
              },
              {
                header: "Holiday Designation",
                key: "name",
                render: (val, row) => (
                   <div className="flex flex-col gap-1">
                      <p className="font-bold text-slate-900 text-[15px] tracking-tight">{val}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#3b52ab] bg-[#eff2ff] px-2 py-0.5 rounded-md border border-[#3b52ab]/10">
                          {formatDate(row.date)}
                        </span>
                        {row.end_date && row.end_date !== row.date && (
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50 uppercase tracking-tighter">
                             Multi-day Event
                           </span>
                        )}
                      </div>
                   </div>
                )
              },
              {
                header: "Status",
                key: "status",
                render: (val) => (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    val === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    {val || 'active'}
                  </span>
                )
              }
            ]}
            data={holidays}
            isLoading={loading}
            emptyState={{
              icon: MapIcon,
              message: "No holidays found for this period"
            }}
            actions={!isViewOnly ? [
              {
                icon: Edit,
                title: "Edit Holiday",
                onClick: (row) => openEditModal(row),
                className: "hover:text-[#3b52ab] hover:bg-[#eff2ff]"
              },
              {
                icon: Trash2,
                title: "Delete Holiday",
                onClick: (row) => openDeleteModal(row),
                className: "hover:text-rose-600 hover:bg-rose-50"
              }
            ] : []}
            footerProps={{
              totalRecords: holidays.length,
              showPagination: false
            }}
          />
        </div>
      </div>

      <AddHolidayModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        form={addForm}
        setForm={setAddForm}
        loading={addLoading}
        error={addError}
        onConfirm={handleAddHoliday}
      />

      <EditHolidayModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        form={editForm}
        setForm={setEditForm}
        loading={editLoading}
        error={editError}
        onConfirm={handleUpdateHoliday}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteHoliday}
        title="Delete Holiday?"
        message={`This action cannot be undone. Are you sure you want to permanently delete "${deleteTarget?.name}"?`}
        type="delete"
        confirmText="Yes, Delete"
        cancelText="Keep It"
        isLoading={deleteLoading}
      />
    </div>
  );
});

export default HolidaysTab;

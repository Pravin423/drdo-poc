import React, { useState, useEffect } from 'react'
import { FileText, UserCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../../../components/ProtectedRoute'
import DashboardLayout from '../../../components/DashboardLayout'

// Sub-components
import AttendanceCalendarModal from '../../../components/block-admin/self/AttendanceCalendarModal'
import MarkAttendanceModal from '../../../components/block-admin/self/MarkAttendanceModal'
import ApplyLeaveModal from '../../../components/block-admin/self/ApplyLeaveModal'
import SelfAttendanceTab from '../../../components/block-admin/self/SelfAttendanceTab'
import SelfLeaveTab from '../../../components/block-admin/self/SelfLeaveTab'

export default function SelfManagement() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  
  // Attendance Form State
  const [attendanceType, setAttendanceType] = useState('office');
  const [lateReason, setLateReason] = useState('');
  const [isLate, setIsLate] = useState(false);
  const [distance, setDistance] = useState(250); // mock distance in meters
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if it's late (e.g., after 10:00 AM)
    const now = new Date();
    if (now.getHours() >= 10) {
      setIsLate(true);
    } else {
      setIsLate(false);
    }
  }, [isMarkModalOpen]);

  // Mock Calendar Data
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: Math.random() > 0.8 ? 'absent' : 'present'
  }));

  const handleMarkAttendance = () => {
    if (attendanceType === 'office' && distance > 500) {
      alert("You are too far from the office range (500m) to mark attendance.");
      return;
    }
    if (isLate && !lateReason) {
      alert("Please provide a reason for being late.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsMarkModalOpen(false);
      alert("Attendance marked successfully!");
    }, 1500);
  };

  return (
    <ProtectedRoute allowedRole={["Block-admin", "super-admin", "district-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto p-4 space-y-8 relative">
          
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Self <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage your personal attendance and leave requests.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <UserCheck size={18} />
              Self Attendance
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'leave' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <FileText size={18} />
              Self Leave
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8"
              >
                {activeTab === 'attendance' ? (
                  <SelfAttendanceTab 
                    onOpenCalendar={() => setIsCalendarOpen(true)}
                    onOpenMarkModal={() => setIsMarkModalOpen(true)}
                  />
                ) : (
                  <SelfLeaveTab onOpenApplyModal={() => setIsApplyLeaveOpen(true)} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </DashboardLayout>

      {/* Modals moved outside DashboardLayout for unrestricted overlay */}
      <AttendanceCalendarModal 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        currentMonthDays={currentMonthDays}
      />

      <MarkAttendanceModal 
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        attendanceType={attendanceType}
        setAttendanceType={setAttendanceType}
        isLate={isLate}
        lateReason={lateReason}
        setLateReason={setLateReason}
        distance={distance}
        isSubmitting={isSubmitting}
        onMark={handleMarkAttendance}
      />

      <ApplyLeaveModal 
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
      />
    </ProtectedRoute>
  )
}

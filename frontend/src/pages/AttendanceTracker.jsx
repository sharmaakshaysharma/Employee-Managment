import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Calendar as CalendarIcon, Save } from 'lucide-react';
import api from '../lib/api';

const AttendanceTracker = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch both employees and current date's records
                const [empRes, attendanceRes] = await Promise.all([
                    api.get('/employees/'),
                    api.get(`/attendance-records/${date}`)
                ]);

                setEmployees(empRes.data);

                // Map out current records from backend
                const records = {};
                empRes.data.forEach(emp => {
                    // Use saved status if exists, otherwise default to 'Absent'
                    records[emp.id] = attendanceRes.data[emp.id] || 'Absent';
                });
                setAttendanceRecords(records);
            } catch (err) {
                console.error("Error fetching attendance data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date]);


    const handleMark = (empId, status) => {
        setAttendanceRecords(prev => ({ ...prev, [empId]: status }));
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // Intentionally sending all individually as API is designed currently to take 1 by 1
            for (const emp of employees) {
                if (attendanceRecords[emp.id]) {
                    await api.post(`/employees/${emp.id}/attendance/`, {
                        date: date,
                        status: attendanceRecords[emp.id]
                    });
                }
            }
            alert('Attendance saved successfully!');
        } catch (err) {
            alert('Error saving attendance');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Daily Attendance</h1>
                    <p className="text-slate-500 mt-2">Mark presence for all employees.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 pl-3">
                        <CalendarIcon size={18} className="text-indigo-500" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-2 py-1 text-slate-700 font-medium border-none focus:outline-none focus:ring-0 bg-transparent"
                        />
                    </div>
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/20"
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Records'}
                    </button>
                </div>
            </div>

            <div className="glass shadow-sm rounded-2xl overflow-hidden animate-slide-up bg-white">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading directory...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-500 text-sm font-medium border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold">Employee</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                                                {emp.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{emp.full_name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{emp.employee_id} • {emp.department}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleMark(emp.id, 'Present')}
                                                className={`px-4 py-2 rounded-l-xl border text-sm font-medium transition-colors flex items-center gap-2 ${attendanceRecords[emp.id] === 'Present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 z-10' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                <CheckCircle2 size={16} className={attendanceRecords[emp.id] === 'Present' ? 'text-emerald-600' : 'opacity-50'} /> Present
                                            </button>
                                            <button
                                                onClick={() => handleMark(emp.id, 'Absent')}
                                                className={`px-4 py-2 rounded-r-xl border text-sm font-medium transition-colors flex items-center gap-2 -ml-3 ${attendanceRecords[emp.id] === 'Absent' ? 'bg-rose-50 border-rose-200 text-rose-700 z-10' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                <XCircle size={16} className={attendanceRecords[emp.id] === 'Absent' ? 'text-rose-600' : 'opacity-50'} /> Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="p-12 text-center text-slate-500">
                                        No employees available to mark attendance.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AttendanceTracker;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, DailyStats, CategoryStat } from '../types';
import { getAdminStats } from '../services/mockDataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  user: User | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ daily: DailyStats[], categories: CategoryStat[] } | null>(null);

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
      navigate('/');
      return;
    }
    getAdminStats().then(setStats);
  }, [user, navigate]);

  if (!stats) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
           <p className="text-3xl font-bold text-gray-900 mt-2">1,245</p>
           <span className="text-xs text-green-500 font-bold">+12% this week</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-sm font-medium text-gray-500 uppercase">Total Videos</p>
           <p className="text-3xl font-bold text-gray-900 mt-2">842</p>
           <span className="text-xs text-green-500 font-bold">+5 today</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-sm font-medium text-gray-500 uppercase">Server Load</p>
           <p className="text-3xl font-bold text-gray-900 mt-2">24%</p>
           <span className="text-xs text-gray-400">Stable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Daily Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">User Activity (Last 5 Days)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.daily}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeUsers" name="Active Users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newUsers" name="New Registrations" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-6">Content Distribution</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={stats.categories}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       fill="#8884d8"
                       paddingAngle={5}
                       dataKey="count"
                       nameKey="name"
                       label
                    >
                       {stats.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Management Link */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex justify-between items-center">
        <div>
           <h3 className="font-bold text-indigo-900">Content Management</h3>
           <p className="text-sm text-indigo-700">Audit new uploads or manage user reports.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
           Go to CMS
        </button>
      </div>
    </div>
  );
};

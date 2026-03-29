import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Users, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllUsers();
        console.log("Admin Data Received:", res.data); 
        setUsers(res.data || []);
      } catch (err) {
        setError("Could not load users. Check if Backend is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center py-20">
      <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
      <p className="text-slate-400">Fetching User Database...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
      <p className="text-white font-bold">{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-rose-500/20 rounded-2xl">
          <ShieldAlert className="text-rose-500" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Management</h1>
          <p className="text-slate-400">Total Registered Users: {users.length}</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-slate-900/50 p-10 rounded-3xl border border-dashed border-white/10 text-center">
          <Users className="mx-auto text-slate-700 mb-4" size={48} />
          <p className="text-slate-500">No users found in the database.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map(u => (
            <div key={u.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{u.name}</p>
                    <p className="text-slate-500 text-sm">{u.email} • <span className="text-rose-400">{u.role}</span></p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
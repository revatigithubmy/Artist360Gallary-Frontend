import { useEffect, useState } from 'react';
import api from '../services/api';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import Loading from '../components/common/Loading';
import { LayoutDashboard, BarChart3, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const [myArt, setMyArt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/artworks/my-art')
      .then(res => setMyArt(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <LayoutDashboard className="text-violet-500" /> Artist Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Manage your creations and see your impact.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500"><ImageIcon /></div>
          <div><p className="text-slate-500 text-xs uppercase font-bold">Total Works</p><p className="text-2xl font-bold text-white">{myArt.length}</p></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-4">Your Gallery</h2>
      {myArt.length > 0 ? <ArtworkGrid artworks={myArt} /> : <p className="text-slate-500">You haven't uploaded anything yet.</p>}
    </div>
  );
};

export default Dashboard;
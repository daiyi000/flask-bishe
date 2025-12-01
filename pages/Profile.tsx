import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Video } from '../types';
import { getVideoById } from '../services/mockDataService';
import { VideoCard } from '../components/VideoCard';
import { History, Heart, User as UserIcon } from 'lucide-react';

interface ProfileProps {
  user: User | null;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'history';
  
  const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const videoIds = activeTab === 'history' ? user.history : user.favorites;
      const promises = videoIds.map(id => getVideoById(id));
      const results = await Promise.all(promises);
      setDisplayVideos(results.filter((v): v is Video => !!v));
      setLoading(false);
    };
    
    fetchData();
  }, [user, activeTab, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
       {/* Profile Header */}
       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50">
             <img src={user.avatar} alt={user.username} className="w-full h-full object-cover"/>
          </div>
          <div>
             <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
             <p className="text-gray-500">{user.role}</p>
             <div className="flex gap-4 mt-3">
                <div className="text-center">
                   <span className="block font-bold text-gray-900">{user.history.length}</span>
                   <span className="text-xs text-gray-500 uppercase">Watched</span>
                </div>
                <div className="text-center">
                   <span className="block font-bold text-gray-900">{user.favorites.length}</span>
                   <span className="text-xs text-gray-500 uppercase">Favorites</span>
                </div>
             </div>
          </div>
       </div>

       {/* Tabs */}
       <div className="border-b border-gray-200 mb-6 flex gap-8">
          <button 
            onClick={() => navigate('/profile?tab=history')}
            className={`pb-3 flex items-center gap-2 font-medium transition-colors relative ${
              activeTab === 'history' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
             <History size={18} /> Watch History
             {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>}
          </button>
          <button 
             onClick={() => navigate('/profile?tab=favorites')}
             className={`pb-3 flex items-center gap-2 font-medium transition-colors relative ${
              activeTab === 'favorites' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
             <Heart size={18} /> Favorites
             {activeTab === 'favorites' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>}
          </button>
       </div>

       {/* Grid */}
       {loading ? (
         <div className="text-center py-12">Loading...</div>
       ) : displayVideos.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.map(video => (
               <VideoCard key={video.id} video={video} />
            ))}
         </div>
       ) : (
         <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No videos found in this list.</p>
         </div>
       )}
    </div>
  );
};

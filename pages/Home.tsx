import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Video, User } from '../types';
import { getVideos, searchVideos, getRecommendations } from '../services/mockDataService';
import { VideoCard } from '../components/VideoCard';
import { Sparkles } from 'lucide-react';

interface HomeProps {
  user: User | null;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [recommended, setRecommended] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (query) {
          const results = await searchVideos(query);
          setVideos(results);
          setRecommended([]); // Hide recs on search
        } else {
          const allVideos = await getVideos();
          setVideos(allVideos);
          
          // Personalized Recommendation (Core Feature)
          const recs = await getRecommendations(user);
          setRecommended(recs);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero / Recommendation Section */}
      {!query && recommended.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
             <Sparkles className="text-yellow-500 fill-current" />
             <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.slice(0, 4).map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          <div className="border-b border-gray-200 my-8"></div>
        </section>
      )}

      {/* Main Grid */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {query ? `Search Results for "${query}"` : 'Latest Videos'}
        </h2>
        
        {videos.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No videos found.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={`main-${video.id}`} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

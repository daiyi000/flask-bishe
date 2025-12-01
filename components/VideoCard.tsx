import React from 'react';
import { Video } from '../types';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
  video: Video;
  compact?: boolean; // For sidebar lists
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, compact = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${video.id}`);
  };

  if (compact) {
    return (
      <div 
        onClick={handleClick}
        className="flex gap-3 mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
      >
        <div className="relative flex-shrink-0 w-32 h-20 bg-gray-200 rounded overflow-hidden">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{video.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{video.author}</p>
          <p className="text-xs text-gray-400">{video.views.toLocaleString()} views</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer flex flex-col gap-2 transition hover:translate-y-[-2px]"
    >
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-md">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" fill="rgba(0,0,0,0.5)" />
        </div>
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
          12:30
        </span>
      </div>
      <div className="flex gap-3 mt-1">
        <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} alt={video.author} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 leading-tight">{video.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{video.author}</p>
          <div className="flex items-center text-sm text-gray-500">
             <span>{video.views.toLocaleString()} views</span>
             <span className="mx-1">•</span>
             <span>{video.uploadDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

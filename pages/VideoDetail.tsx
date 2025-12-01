import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Video, User, Comment } from '../types';
import { getVideoById, getRecommendations, getComments, postComment } from '../services/mockDataService';
import { generateVideoSummary, chatAboutVideo } from '../services/geminiService';
import { VideoCard } from '../components/VideoCard';
import { ThumbsUp, Share2, Bookmark, Send, Sparkles, MessageSquare } from 'lucide-react';

interface VideoDetailProps {
  user: User | null;
}

export const VideoDetail: React.FC<VideoDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  // AI Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!id) return;
      const vid = await getVideoById(id);
      if (vid) {
        setVideo(vid);
        setComments(await getComments(id));
        setRelatedVideos(await getRecommendations(user, id));
        
        // Reset AI states
        setAiSummary('');
        setChatResponse('');
        setChatQuery('');
      }
    };
    fetchVideoData();
  }, [id, user]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !video || !newComment.trim()) return;
    const added = await postComment(video.id, user, newComment);
    setComments([added, ...comments]);
    setNewComment('');
  };

  const handleGenerateSummary = async () => {
    if (!video) return;
    setLoadingAi(true);
    const summary = await generateVideoSummary(video.title, video.description);
    setAiSummary(summary);
    setLoadingAi(false);
  };
  
  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !chatQuery.trim()) return;
    setChatLoading(true);
    const answer = await chatAboutVideo(video.title, video.description, chatQuery);
    setChatResponse(answer);
    setChatLoading(false);
  };

  if (!video) return <div className="p-8 text-center">Loading Video...</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Player & Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video Player Wrapper */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
          <video 
            src={video.videoUrl} 
            controls 
            className="w-full h-full"
            poster={video.thumbnail}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4">
             <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} className="w-10 h-10 rounded-full bg-gray-200" alt="author"/>
                <div>
                   <p className="font-semibold text-gray-900">{video.author}</p>
                   <p className="text-xs text-gray-500">10K subscribers</p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition ml-2">Subscribe</button>
             </div>

             <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-sm font-medium">
                  <ThumbsUp size={18} /> {video.likes}
                </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-sm font-medium">
                  <Share2 size={18} /> Share
                </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-sm font-medium">
                  <Bookmark size={18} /> Save
                </button>
             </div>
          </div>
        </div>

        {/* Smart Description Box */}
        <div className="bg-gray-100 rounded-xl p-4">
           <div className="flex gap-2 text-sm text-gray-600 font-medium mb-2">
             <span>{video.views.toLocaleString()} views</span>
             <span>•</span>
             <span>{video.uploadDate}</span>
             {video.tags.map(t => <span key={t} className="text-indigo-600">#{t}</span>)}
           </div>
           
           <p className="text-gray-800 whitespace-pre-wrap">{video.description}</p>
           
           {/* Gemini AI Integration 1: Summary */}
           <div className="mt-4 pt-4 border-t border-gray-200">
             {!aiSummary ? (
                <button 
                  onClick={handleGenerateSummary}
                  disabled={loadingAi}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
                >
                  <Sparkles size={16} /> 
                  {loadingAi ? 'Generating AI Summary...' : 'Generate AI Summary'}
                </button>
             ) : (
               <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase mb-1">
                    <Sparkles size={12} /> AI Summary
                  </div>
                  <p className="text-sm text-indigo-900">{aiSummary}</p>
               </div>
             )}
           </div>
        </div>

        {/* Gemini AI Integration 2: Chat */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
             <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               <MessageSquare size={16} /> Ask AI about this video
             </h3>
             <form onSubmit={handleAiChat} className="flex gap-2 mb-2">
                <input 
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="e.g. What is the main conclusion?"
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  type="submit" 
                  disabled={chatLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                   {chatLoading ? '...' : 'Ask'}
                </button>
             </form>
             {chatResponse && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                   <span className="font-bold">AI:</span> {chatResponse}
                </div>
             )}
        </div>

        {/* Comments Section */}
        <div>
           <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>
           {user && (
             <form onSubmit={handlePostComment} className="flex gap-4 mb-8">
               <img src={user.avatar} className="w-10 h-10 rounded-full" alt="me" />
               <div className="flex-1">
                 <input 
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   className="w-full border-b border-gray-300 py-2 focus:border-indigo-600 outline-none bg-transparent transition"
                   placeholder="Add a comment..."
                 />
                 <div className="flex justify-end mt-2">
                    <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition">
                      Comment
                    </button>
                 </div>
               </div>
             </form>
           )}
           
           <div className="space-y-6">
             {comments.map(comment => (
               <div key={comment.id} className="flex gap-3">
                 <img src={comment.avatar} className="w-10 h-10 rounded-full" alt={comment.username} />
                 <div>
                   <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                   </div>
                   <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Right Column: Recommendations */}
      <div>
        <h3 className="font-bold text-gray-700 mb-4">Up Next</h3>
        <div className="flex flex-col">
          {relatedVideos.map(vid => (
             <VideoCard key={`rel-${vid.id}`} video={vid} compact />
          ))}
        </div>
      </div>
    </div>
  );
};

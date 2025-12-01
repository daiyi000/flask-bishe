import { MOCK_VIDEOS, MOCK_COMMENTS, MOCK_USERS } from '../constants';
import { User, Video, Comment, DailyStats, CategoryStat } from '../types';

// Simulate Network Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- User Logic ---
export const loginUser = async (username: string): Promise<User | null> => {
  await delay(500);
  const user = MOCK_USERS.find(u => u.username === username);
  return user ? { ...user } : null; // Return copy
};

// --- Video Logic ---
export const getVideos = async (): Promise<Video[]> => {
  await delay(300);
  return [...MOCK_VIDEOS];
};

export const getVideoById = async (id: string): Promise<Video | undefined> => {
  await delay(200);
  return MOCK_VIDEOS.find(v => v.id === id);
};

export const searchVideos = async (query: string): Promise<Video[]> => {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return MOCK_VIDEOS.filter(v => 
    v.title.toLowerCase().includes(lowerQuery) || 
    v.category.toLowerCase().includes(lowerQuery) ||
    v.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// --- Recommendation Logic (The Core) ---
// Simulates Content-based + Collaborative Filtering (simplified)
export const getRecommendations = async (currentUser: User | null, currentVideoId?: string): Promise<Video[]> => {
  await delay(400);
  
  let recs: Video[] = [];

  if (!currentUser && !currentVideoId) {
    // Cold Start: Return popular videos (sorted by views)
    recs = [...MOCK_VIDEOS].sort((a, b) => b.views - a.views);
  } else if (currentVideoId) {
    // Content-Based (Item-to-Item): Recommend videos with same category or tags
    const currentVideo = MOCK_VIDEOS.find(v => v.id === currentVideoId);
    if (currentVideo) {
      recs = MOCK_VIDEOS.filter(v => 
        v.id !== currentVideoId && // Exclude self
        (v.category === currentVideo.category || 
         v.tags.some(t => currentVideo.tags.includes(t)))
      );
    }
  } else if (currentUser) {
    // User-Based (Personalized): Based on history tags
    // 1. Collect tags from user history
    const historyVideos = MOCK_VIDEOS.filter(v => currentUser.history.includes(v.id));
    const interestTags = new Set<string>();
    historyVideos.forEach(v => v.tags.forEach(t => interestTags.add(t)));
    
    // 2. Score other videos
    recs = MOCK_VIDEOS.filter(v => !currentUser.history.includes(v.id))
      .map(v => {
        let score = 0;
        v.tags.forEach(t => { if (interestTags.has(t)) score += 1; });
        return { video: v, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.video);
  }

  // Fallback if no specific recs found
  if (recs.length === 0) {
    recs = [...MOCK_VIDEOS].sort((a, b) => b.likes - a.likes);
  }

  return recs.slice(0, 5); // Return top 5
};

// --- Interaction Logic ---
export const getComments = async (videoId: string): Promise<Comment[]> => {
  await delay(200);
  return MOCK_COMMENTS.filter(c => c.videoId === videoId);
};

export const postComment = async (videoId: string, user: User, content: string): Promise<Comment> => {
  await delay(300);
  const newComment: Comment = {
    id: `c${Date.now()}`,
    videoId,
    username: user.username,
    avatar: user.avatar,
    content,
    timestamp: 'Just now',
  };
  MOCK_COMMENTS.unshift(newComment); // Add to mock DB in memory
  return newComment;
};

// --- Admin Stats ---
export const getAdminStats = async (): Promise<{ daily: DailyStats[], categories: CategoryStat[] }> => {
  await delay(500);
  const daily: DailyStats[] = [
    { date: '2023-11-01', newUsers: 12, activeUsers: 150 },
    { date: '2023-11-02', newUsers: 19, activeUsers: 180 },
    { date: '2023-11-03', newUsers: 8, activeUsers: 170 },
    { date: '2023-11-04', newUsers: 25, activeUsers: 220 },
    { date: '2023-11-05', newUsers: 30, activeUsers: 300 },
  ];
  
  // Calculate category stats from actual mock data
  const catMap = new Map<string, number>();
  MOCK_VIDEOS.forEach(v => {
    catMap.set(v.category, (catMap.get(v.category) || 0) + 1);
  });
  
  const categories: CategoryStat[] = Array.from(catMap).map(([name, count]) => ({ name, count }));
  
  return { daily, categories };
};

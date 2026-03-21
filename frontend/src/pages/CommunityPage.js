import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Users, Calendar, Megaphone, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'general'
  });

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.post_type = filter;
      }
      const response = await axios.get(`${API}/community/posts`, { params });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API}/community/posts`,
        {
          ...formData,
          images: []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Post created successfully!');
      setDialogOpen(false);
      setFormData({ title: '', content: '', post_type: 'general' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const getPostIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-orange-500" />;
      default:
        return <Users className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="community-heading">
          Community
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-community-post-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Community Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="post_type">Post Type</Label>
                <Select
                  value={formData.post_type}
                  onValueChange={(value) => setFormData({ ...formData, post_type: value })}
                >
                  <SelectTrigger data-testid="post-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  data-testid="post-title-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  data-testid="post-content-textarea"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" data-testid="submit-post-button" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white">
                Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          data-testid="filter-all-posts"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          All
        </button>
        <button
          data-testid="filter-events"
          onClick={() => setFilter('event')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'event' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Events
        </button>
        <button
          data-testid="filter-announcements"
          onClick={() => setFilter('announcement')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'announcement' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Announcements
        </button>
        <button
          data-testid="filter-general"
          onClick={() => setFilter('general')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'general' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          General
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20" data-testid="no-community-posts">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No posts yet</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            Create First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} data-testid={`community-post-${post.id}`} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getPostIcon(post.post_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>{post.title}</h3>
                      <p className="text-sm text-gray-500">by {post.user_name} • {post.society_name}</p>
                    </div>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      {post.post_type}
                    </span>
                  </div>
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;

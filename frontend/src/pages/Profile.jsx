import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useUserStore, { MOVIE_CATALOG } from '../store/useUserStore';
import { Edit3, Plus, Trash2, Camera, Save, Star, X, Film, ThumbsUp, Heart, Bookmark, MessageSquare, PlusCircle, Check } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const createCustomList = useUserStore((state) => state.createCustomList);
  const deleteCustomList = useUserStore((state) => state.deleteCustomList);
  const addMovieToCustomList = useUserStore((state) => state.addMovieToCustomList);
  const removeMovieFromCustomList = useUserStore((state) => state.removeMovieFromCustomList);

  const [activeTab, setActiveTab] = useState("Liked Movies");
  
  // Edit Profile modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // Custom List creation state
  const [newListName, setNewListName] = useState("");
  const [addingMovieToListId, setAddingMovieToListId] = useState(null);
  const [movieSearchQuery, setMovieSearchQuery] = useState("");

  // Mock avatar options for editing
  const avatarOptions = [
    "/images/actor_1.png",
    "/images/actor_hero_bg.png"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated || !user) {
      navigate('/auth');
    } else {
      setEditName(user.name || "");
      setEditBio(user.bio || "");
      setEditAvatar(user.avatar || "");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Handle Profile Save
  const handleSaveProfile = () => {
    updateProfile(editName, editBio, editAvatar);
    setIsEditModalOpen(false);
  };

  // Handle Custom List Creation
  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createCustomList(newListName.trim());
    setNewListName("");
  };

  // Find movie details helper
  const getMovieById = (id) => {
    return MOVIE_CATALOG.find(m => m.id === id);
  };

  // Search filtered movies to add to custom list
  const filteredCatalogForList = MOVIE_CATALOG.filter(m => 
    m.title.toLowerCase().includes(movieSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-10">
        
        {/* Profile Card Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar circle */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#EAB513]/20 p-1 bg-white/5 shrink-0 shadow-lg">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Profile detail details */}
            <div className="flex-1 text-center md:text-left flex flex-col pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{user.name}</h1>
                  <p className="text-xs text-gray-500 font-bold tracking-wider mt-1">{user.username}</p>
                </div>
                
                {/* Buttons row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Button 
                    onClick={() => {
                      setEditName(user.name);
                      setEditBio(user.bio);
                      setEditAvatar(user.avatar);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-[#EAB513] hover:bg-[#EAB513] text-black font-black text-xs px-6 py-4.5 rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="outline" 
                    className="border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-bold text-xs px-6 py-4.5 rounded-lg cursor-pointer"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>

              {/* Bio quote */}
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed italic mb-6">
                "{user.bio}"
              </p>

              {/* Followers metric */}
              <div className="flex items-center justify-center md:justify-start gap-6 font-bold">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg text-white font-black">1,234</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Following</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg text-white font-black">5,678</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left / Middle: Collections Sections */}
          <div className="lg:col-span-2 flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
              <Film className="w-5.5 h-5.5 text-[#EAB513]" />
              Movie Collections
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-white/5 mb-8">
              {["Liked Movies", "Wishlist", "My Reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-xs md:text-sm font-black tracking-wider uppercase transition-all relative cursor-pointer ${
                    activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EAB513]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Poster Grid & Reviews List */}
            {activeTab === "Liked Movies" && (
              user.favoriteMovies && user.favoriteMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                  {user.favoriteMovies.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/movie/${item.id}`)}
                      className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 group cursor-pointer shadow-xl hover:border-[#EAB513]/40 transition-all duration-300 relative"
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2.5 right-2.5 bg-black/60 p-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl mb-12">
                  <p className="text-gray-500 text-sm font-medium">No liked movies yet.</p>
                  <Button onClick={() => navigate('/explore')} className="mt-4 bg-[#EAB513] hover:bg-[#EAB513] text-black font-bold text-xs px-4 py-2 rounded-lg">Browse Cinema</Button>
                </div>
              )
            )}

            {activeTab === "Wishlist" && (
              user.watchlist && user.watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                  {user.watchlist.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/movie/${item.id}`)}
                      className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 group cursor-pointer shadow-xl hover:border-[#EAB513]/40 transition-all duration-300 relative"
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2.5 right-2.5 bg-black/60 p-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Bookmark className="w-4 h-4 text-[#EAB513] fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl mb-12">
                  <p className="text-gray-500 text-sm font-medium">No movies in your wishlist.</p>
                  <Button onClick={() => navigate('/explore')} className="mt-4 bg-[#EAB513] hover:bg-[#EAB513] text-black font-bold text-xs px-4 py-2 rounded-lg">Browse Cinema</Button>
                </div>
              )
            )}

            {activeTab === "My Reviews" && (
              user.reviews && user.reviews.length > 0 ? (
                <div className="flex flex-col gap-4 mb-12">
                  {user.reviews.map((rev) => {
                    const media = getMovieById(rev.movieId);
                    const userRating = user.ratings?.find(r => r.id === rev.movieId)?.rating;
                    return (
                      <div key={rev.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:border-white/20 transition-all">
                        {media && (
                          <div 
                            onClick={() => navigate(`/movie/${media.id}`)}
                            className="w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-white/5 cursor-pointer"
                          >
                            <img src={media.image} alt={media.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-extrabold text-white text-base hover:text-[#EAB513] transition-colors cursor-pointer" onClick={() => navigate(`/movie/${rev.movieId}`)}>
                                {media ? media.title : `Movie #${rev.movieId}`}
                              </h4>
                              {userRating && (
                                <div className="flex items-center gap-1 bg-[#EAB513]/10 border border-[#EAB513]/20 px-2 py-0.5 rounded text-xs font-black text-[#EAB513]">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  {userRating}/10
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{new Date(rev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            <p className="text-sm text-gray-300 mt-3 leading-relaxed italic">"{rev.text}"</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl mb-12">
                  <p className="text-gray-500 text-sm font-medium">You haven't written any reviews yet.</p>
                  <Button onClick={() => navigate('/explore')} className="mt-4 bg-[#EAB513] hover:bg-[#EAB513] text-black font-bold text-xs px-4 py-2 rounded-lg">Browse & Review</Button>
                </div>
              )
            )}

            {/* Custom Lists Section */}
            <section className="border-t border-white/5 pt-12 mt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <PlusCircle className="w-5.5 h-5.5 text-[#EAB513]" />
                    Your Lists
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Create customized movie lists to share and track.</p>
                </div>

                {/* Create Custom List Form */}
                <form onSubmit={handleCreateList} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g. Nolan Collection..."
                    className="flex-1 md:w-60 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 text-xs text-white placeholder:text-gray-600"
                  />
                  <button
                    type="submit"
                    className="bg-[#EAB513] hover:bg-[#EAB513] text-black px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all shadow-md shrink-0"
                  >
                    Create List
                  </button>
                </form>
              </div>

              {/* Render Lists */}
              {user.customLists && user.customLists.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {user.customLists.map((list) => (
                    <div key={list.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative">
                      {/* Delete List Trigger */}
                      <button 
                        onClick={() => deleteCustomList(list.id)}
                        className="absolute top-5 right-5 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete List"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col gap-1 mb-5">
                        <h3 className="text-lg font-black text-white leading-tight">{list.name}</h3>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{list.movies?.length || 0} {list.movies?.length === 1 ? 'Title' : 'Titles'}</span>
                      </div>

                      {/* Movie Posters inside list */}
                      {list.movies && list.movies.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6">
                          {list.movies.map((movie) => (
                            <div key={movie.id} className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/5 group shadow-lg">
                              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                <button
                                  onClick={() => removeMovieFromCustomList(list.id, movie.id)}
                                  className="p-1.5 rounded-full bg-red-500 text-white cursor-pointer hover:scale-115 transition-transform"
                                  title="Remove from list"
                                >
                                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 font-medium italic mb-6">This list is empty. Add some titles below!</p>
                      )}

                      {/* Add Movie Panel */}
                      <div className="relative">
                        {addingMovieToListId === list.id ? (
                          <div className="bg-[#121016]/95 border border-white/10 p-3 rounded-xl max-w-sm absolute bottom-full left-0 mb-2 z-20 shadow-2xl flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                              <span className="text-xs font-bold text-white">Add Movie</span>
                              <button onClick={() => { setAddingMovieToListId(null); setMovieSearchQuery(""); }} className="text-gray-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <input
                              type="text"
                              value={movieSearchQuery}
                              onChange={(e) => setMovieSearchQuery(e.target.value)}
                              placeholder="Search titles..."
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-600 focus:outline-none"
                              autoFocus
                            />
                            <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
                              {filteredCatalogForList.map((m) => (
                                <button
                                  key={m.id}
                                  onClick={() => {
                                    addMovieToCustomList(list.id, m);
                                    setAddingMovieToListId(null);
                                    setMovieSearchQuery("");
                                  }}
                                  className="flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg hover:bg-[#EAB513] hover:text-black text-xs font-bold text-gray-300 transition-colors cursor-pointer group"
                                >
                                  <div className="w-6 h-9 rounded bg-white/5 overflow-hidden shrink-0 border border-white/10">
                                    <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate text-white group-hover:text-black font-extrabold">{m.title}</span>
                                    <span className="text-[10px] text-gray-500 group-hover:text-black/60 mt-0.5">{m.year} • {m.director}</span>
                                  </div>
                                </button>
                              ))}
                              {filteredCatalogForList.length === 0 && <span className="text-[10px] text-gray-600 text-center py-2">No movies found</span>}
                            </div>
                          </div>
                        ) : null}

                        <button
                          onClick={() => setAddingMovieToListId(list.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer shadow-md"
                        >
                          <Plus className="w-4 h-4 text-[#EAB513]" />
                          Add Movie to List
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <p className="text-gray-500 text-xs font-medium">Create lists like "Comfort Movies" or "Weekend Watchlist" to start customizing.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Quick Stats */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
              <h3 className="text-lg font-black text-white tracking-tight border-b border-white/5 pb-4 mb-2">
                Quick Stats
              </h3>

              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Movies Watched</span>
                <span className="text-2xl font-black text-white">{user.watchedMovies?.length || 0}</span>
              </div>

              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Favorite Genre</span>
                <span className="text-2xl font-black text-[#EAB513]">{user.favoriteGenres?.[0] || "None"}</span>
              </div>

              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cinephile Score</span>
                <span className="text-2xl font-black text-[#EAB513]">{user.cinephileScore?.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* === GLASSMORPHIC EDIT PROFILE MODAL === */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121016]/95 border border-white/15 w-full max-w-[460px] rounded-3xl p-7 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-left">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
              <Edit3 className="w-5.5 h-5.5 text-[#EAB513]" />
              Edit Profile
            </h3>

            <div className="flex flex-col gap-5">
              {/* Profile Avatar Options Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Choose Avatar</label>
                <div className="flex gap-4">
                  {avatarOptions.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => setEditAvatar(opt)}
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all p-0.5 bg-white/5 relative ${
                        editAvatar === opt ? 'border-[#EAB513] scale-105' : 'border-transparent'
                      }`}
                    >
                      <img src={opt} className="w-full h-full object-cover rounded-full" />
                      {editAvatar === opt && (
                        <div className="absolute inset-0 bg-[#EAB513]/20 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-black bg-[#EAB513] rounded-full p-0.5" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 text-sm text-white placeholder:text-gray-600"
                />
              </div>

              {/* Quote / Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quote / Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Your cinema motto..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 text-sm text-white placeholder:text-gray-600 resize-none min-h-[80px]"
                />
              </div>

              {/* Future Enhancements Notices */}
              <div className="flex flex-col gap-2 bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Favourite Genres</span>
                  <span className="text-[9px] font-black text-[#EAB513] bg-[#EAB513]/10 px-2 py-0.5 rounded uppercase tracking-wider">Future</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Favourite Actors</span>
                  <span className="text-[9px] font-black text-[#EAB513] bg-[#EAB513]/10 px-2 py-0.5 rounded uppercase tracking-wider">Future</span>
                </div>
              </div>

              {/* Actions */}
              <Button 
                onClick={handleSaveProfile}
                className="w-full bg-[#EAB513] hover:bg-[#EAB513] text-black font-black text-sm py-4 mt-2 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;

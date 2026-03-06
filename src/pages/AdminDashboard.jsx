import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingArticles, setIsLoadingArticles] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Category state
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryForm, setEditCategoryForm] = useState({ name: '' });

    // Article state
    const [showAddArticle, setShowAddArticle] = useState(false);
    const [articleForm, setArticleForm] = useState({ title: '', content: '', categoryId: '' });
    const [editingArticle, setEditingArticle] = useState(null);
    const [editArticleForm, setEditArticleForm] = useState({ title: '', content: '' });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (!token || role !== 'ROLE_ADMIN') navigate('/login');
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchArticles();
        fetchCategories();
    }, []);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUsers(data);
        } catch { console.error('Gagal fetch users'); }
        finally { setIsLoadingUsers(false); }
    };

    const fetchArticles = async () => {
        setIsLoadingArticles(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setArticles(data);
        } catch { console.error('Gagal fetch articles'); }
        finally { setIsLoadingArticles(false); }
    };

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setCategories(data);
        } catch { console.error('Gagal fetch categories'); }
        finally { setIsLoadingCategories(false); }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(u => u.userId !== id));
        } catch { alert('Gagal menghapus user'); }
    };

    const handleDeleteArticle = async (id) => {
        if (!confirm('Yakin ingin menghapus artikel ini?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setArticles(articles.filter(a => a.id !== id));
        } catch { alert('Gagal menghapus artikel'); }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(categories.filter(c => c.id !== id));
            if (selectedCategory?.id === id) setSelectedCategory(null);
        } catch { alert('Gagal menghapus kategori'); }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: categoryForm.name }),
            });
            if (!res.ok) throw new Error('Gagal menambah kategori');
            setCategoryForm({ name: '' });
            setShowAddCategory(false);
            fetchCategories();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCategory = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editingCategory.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: editCategoryForm.name }),
            });
            if (!res.ok) throw new Error('Gagal mengedit kategori');
            setEditingCategory(null);
            setEditCategoryForm({ name: '' });
            fetchCategories();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddArticle = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: articleForm.title,
                    content: articleForm.content,
                    categoryId: selectedCategory?.id || null,
                }),
            });
            if (!res.ok) throw new Error('Gagal menambah artikel');
            setArticleForm({ title: '', content: '', categoryId: selectedCategory?.id || '' });
            setFormSuccess('Artikel berhasil ditambahkan!');
            setShowAddArticle(false);
            fetchArticles();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditArticle = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${editingArticle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: editArticleForm.title,
                    content: editArticleForm.content,
                    categoryId: selectedCategory?.id || null,
                }),
            });
            if (!res.ok) throw new Error('Gagal mengedit artikel');
            setEditingArticle(null);
            setEditArticleForm({ title: '', content: '' });
            fetchArticles();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const filteredArticles = selectedCategory
        ? articles.filter(a => a.categoryId === selectedCategory.id)
        : [];

    return (
        <div className="min-h-screen bg-[#0B0D1A] text-white font-sans">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#0F1224] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">G</div>
                    <span className="font-semibold text-lg tracking-wide">Gatra Admin</span>
                </div>
                <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-400 transition border border-gray-700 hover:border-red-500 px-3 py-1.5 rounded-lg">
                    Logout
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#131627] rounded-2xl p-5 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Total Peserta</p>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-[#131627] rounded-2xl p-5 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Total Bacaan</p>
                        <p className="text-3xl font-bold">{articles.length}</p>
                    </div>
                    <div className="bg-[#131627] rounded-2xl p-5 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Kategori</p>
                        <p className="text-3xl font-bold">{categories.length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['users', 'categories'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSelectedCategory(null); setShowAddArticle(false); setShowAddCategory(false); setFormError(''); setEditingCategory(null); setEditingArticle(null); }}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-[#131627] text-gray-400 hover:text-white border border-gray-800'}`}
                        >
                            {tab === 'users' ? 'Peserta' : 'Kategori & Bacaan'}
                        </button>
                    ))}
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-[#131627] rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-800">
                            <h2 className="font-semibold text-sm">Daftar Peserta</h2>
                        </div>
                        {isLoadingUsers ? (
                            <div className="p-8 text-center text-gray-500 text-sm">Memuat data...</div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">Belum ada peserta.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="text-xs text-gray-500 border-b border-gray-800">
                                        <th className="text-left px-6 py-3 font-medium">Username</th>
                                        <th className="text-left px-6 py-3 font-medium">Display Name</th>
                                        <th className="text-left px-6 py-3 font-medium">Email</th>
                                        <th className="text-left px-6 py-3 font-medium">No. HP</th>
                                        <th className="text-left px-6 py-3 font-medium">Role</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user, i) => (
                                        <tr key={user.userId || i} className="border-b border-gray-800/50 hover:bg-white/5 transition">
                                            <td className="px-6 py-4 font-medium">{user.username || '-'}</td>
                                            <td className="px-6 py-4 text-gray-300">{user.displayName || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400">{user.email || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400">{user.phoneNumber || '-'}</td>
                                            <td className="px-6 py-4">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ROLE_ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                        {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Peserta'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {user.role !== 'ROLE_ADMIN' && (
                                                    <button onClick={() => handleDeleteUser(user.userId)} className="text-xs text-red-400 hover:text-red-300 transition">
                                                        Hapus
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && !selectedCategory && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-sm text-gray-300">Daftar Kategori</h2>
                            <button
                                onClick={() => { setShowAddCategory(!showAddCategory); setFormError(''); setEditingCategory(null); }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl transition font-medium"
                            >
                                {showAddCategory ? 'Batal' : '+ Tambah Kategori'}
                            </button>
                        </div>

                        {/* Add Category Form */}
                        {showAddCategory && (
                            <div className="bg-[#131627] rounded-2xl border border-gray-800 p-6 mb-6">
                                <h3 className="font-semibold text-sm mb-4">Tambah Kategori Baru</h3>
                                {formError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-xs">{formError}</div>}
                                <form onSubmit={handleAddCategory} className="flex gap-3">
                                    <input
                                        type="text" required placeholder="Nama kategori"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ name: e.target.value })}
                                        className="flex-1 bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                                    />
                                    <button type="submit" disabled={isSubmitting}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Edit Category Form */}
                        {editingCategory && (
                            <div className="bg-[#131627] rounded-2xl border border-yellow-500/30 p-6 mb-6">
                                <h3 className="font-semibold text-sm mb-4 text-yellow-400">Edit Kategori</h3>
                                <form onSubmit={handleEditCategory} className="flex gap-3">
                                    <input
                                        type="text" required
                                        value={editCategoryForm.name}
                                        onChange={(e) => setEditCategoryForm({ name: e.target.value })}
                                        className="flex-1 bg-[#1E2235] border border-yellow-500/30 focus:border-yellow-500 rounded-xl p-3 text-sm outline-none text-white transition"
                                    />
                                    <button type="submit" disabled={isSubmitting}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                                        {isSubmitting ? 'Menyimpan...' : 'Update'}
                                    </button>
                                    <button type="button" onClick={() => setEditingCategory(null)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm transition">
                                        Batal
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Categories List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {isLoadingCategories ? (
                                <div className="col-span-3 p-8 text-center text-gray-500 text-sm">Memuat data...</div>
                            ) : categories.length === 0 ? (
                                <div className="col-span-3 p-8 text-center text-gray-500 text-sm">Belum ada kategori.</div>
                            ) : categories.map((cat) => (
                                <div key={cat.id} className="bg-[#131627] rounded-2xl border border-gray-800 p-5 hover:border-blue-500/50 transition cursor-pointer group"
                                     onClick={() => { setSelectedCategory(cat); setShowAddArticle(false); setFormError(''); setFormSuccess(''); setArticleForm({ title: '', content: '', categoryId: cat.id }); }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-sm group-hover:text-blue-400 transition">{cat.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{articles.filter(a => a.categoryId === cat.id).length} bacaan</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-blue-400 group-hover:text-blue-300">Lihat →</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setEditCategoryForm({ name: cat.name }); setShowAddCategory(false); }}
                                                className="text-xs text-yellow-400 hover:text-yellow-300 transition opacity-0 group-hover:opacity-100"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                                className="text-xs text-red-400 hover:text-red-300 transition opacity-0 group-hover:opacity-100"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Articles inside Category */}
                {activeTab === 'categories' && selectedCategory && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => { setSelectedCategory(null); setShowAddArticle(false); setFormError(''); setEditingArticle(null); }}
                                className="text-xs text-gray-400 hover:text-white transition border border-gray-700 px-3 py-1.5 rounded-lg"
                            >
                                ← Kembali
                            </button>
                            <h2 className="font-semibold">{selectedCategory.name}</h2>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-400">{filteredArticles.length} bacaan</p>
                            <button
                                onClick={() => { setShowAddArticle(!showAddArticle); setFormError(''); setFormSuccess(''); setEditingArticle(null); }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl transition font-medium"
                            >
                                {showAddArticle ? 'Batal' : '+ Tambah Bacaan'}
                            </button>
                        </div>

                        {/* Add Article Form */}
                        {showAddArticle && (
                            <div className="bg-[#131627] rounded-2xl border border-gray-800 p-6 mb-6">
                                <h3 className="font-semibold text-sm mb-4">Tambah Bacaan — {selectedCategory.name}</h3>
                                {formError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-xs">{formError}</div>}
                                {formSuccess && <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-4 text-xs">{formSuccess}</div>}
                                <form onSubmit={handleAddArticle} className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Judul</label>
                                        <input type="text" required placeholder="Judul bacaan"
                                               value={articleForm.title}
                                               onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                                               className="w-full bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Konten</label>
                                        <textarea required placeholder="Tulis konten bacaan..." rows={5}
                                                  value={articleForm.content}
                                                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                                                  className="w-full bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition resize-none"
                                        />
                                    </div>
                                    <button type="submit" disabled={isSubmitting}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Bacaan'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Edit Article Form */}
                        {editingArticle && (
                            <div className="bg-[#131627] rounded-2xl border border-yellow-500/30 p-6 mb-6">
                                <h3 className="font-semibold text-sm mb-4 text-yellow-400">Edit Bacaan</h3>
                                <form onSubmit={handleEditArticle} className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Judul</label>
                                        <input type="text" required
                                               value={editArticleForm.title}
                                               onChange={(e) => setEditArticleForm({ ...editArticleForm, title: e.target.value })}
                                               className="w-full bg-[#1E2235] border border-yellow-500/30 focus:border-yellow-500 rounded-xl p-3 text-sm outline-none text-white transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Konten</label>
                                        <textarea required rows={5}
                                                  value={editArticleForm.content}
                                                  onChange={(e) => setEditArticleForm({ ...editArticleForm, content: e.target.value })}
                                                  className="w-full bg-[#1E2235] border border-yellow-500/30 focus:border-yellow-500 rounded-xl p-3 text-sm outline-none text-white transition resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit" disabled={isSubmitting}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                                            {isSubmitting ? 'Menyimpan...' : 'Update Bacaan'}
                                        </button>
                                        <button type="button" onClick={() => setEditingArticle(null)}
                                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm transition">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Articles List */}
                        <div className="bg-[#131627] rounded-2xl border border-gray-800 overflow-hidden">
                            {isLoadingArticles ? (
                                <div className="p-8 text-center text-gray-500 text-sm">Memuat data...</div>
                            ) : filteredArticles.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">Belum ada bacaan di kategori ini.</div>
                            ) : (
                                <div className="divide-y divide-gray-800">
                                    {filteredArticles.map((article, i) => (
                                        <div key={article.id || i} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-white/5 transition">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{article.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.content}</p>
                                            </div>
                                            <div className="flex gap-3 shrink-0">
                                                <button
                                                    onClick={() => { setEditingArticle(article); setEditArticleForm({ title: article.title, content: article.content }); setShowAddArticle(false); }}
                                                    className="text-xs text-yellow-400 hover:text-yellow-300 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                    className="text-xs text-red-400 hover:text-red-300 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
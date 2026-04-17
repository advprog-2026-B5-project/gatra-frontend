import React, { useState, useEffect } from 'react';
import { getAllAchievements, createAchievement, updateAchievement, deleteAchievement } from '../api/achievement';

const AchievementManager = ({ onUpdateCount }) => {
    const token = localStorage.getItem('token');

    const ACTION_TYPE_OPTIONS = [
        { value: 'READ_ARTICLE', label: 'Baca Artikel' },
        { value: 'FINISH_QUIZ', label: 'Selesaikan Kuis' },
    ];
    const getActionTypeLabel = (value) => ACTION_TYPE_OPTIONS.find(o => o.value === value)?.label || value;

    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        name: '',
        category: '',
        milestoneThreshold: '',
        description: '',
        badgeUrl: ''
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllAchievements(token);
            setAchievements(data);
            if (onUpdateCount) {
                onUpdateCount(data.length);
            }
        } catch (err) {
            console.error('Gagal fetch achievements', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setFormData(initialForm);
        setEditingId(null);
        setShowForm(false);
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');
        try {
            const payload = {
                name: formData.name,
                category: formData.category,
                milestoneThreshold: parseInt(formData.milestoneThreshold),
                description: formData.description || null,
                badgeUrl: formData.badgeUrl || null,
            };

            if (editingId) {
                await updateAchievement(token, editingId, payload);
                setFormSuccess('Achievement berhasil diperbarui!');
            } else {
                await createAchievement(token, payload);
                setFormSuccess('Achievement baru berhasil ditambahkan!');
            }

            handleReset();
            fetchData();
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (achievement) => {
        setEditingId(achievement.id);
        setFormData({
            name: achievement.name,
            category: achievement.category || '',
            milestoneThreshold: achievement.milestoneThreshold,
            description: achievement.description || '',
            badgeUrl: achievement.badgeUrl || '',
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus achievement ini?')) {
            try {
                await deleteAchievement(token, id);
                fetchData();
                setFormSuccess('Achievement dihapus.');
                setTimeout(() => setFormSuccess(''), 3000);
            } catch (err) {
                alert('Gagal menghapus achievement: ' + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-sm text-gray-300">Daftar Achievement</h2>
                <button
                    onClick={() => (showForm ? handleReset() : setShowForm(true))}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl transition font-medium shadow-lg shadow-blue-900/20"
                >
                    {showForm ? 'Batal' : '+ Tambah Achievement'}
                </button>
            </div>

            {formSuccess && !showForm && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-2xl text-xs animate-fade-in mb-6">
                    {formSuccess}
                </div>
            )}

            {showForm && (
                <div className={`bg-[#131627] rounded-2xl border ${editingId ? 'border-yellow-500/30' : 'border-gray-800'} p-6 shadow-2xl animate-fade-in mb-6`}>
                    <h3 className={`font-semibold text-sm mb-6 ${editingId ? 'text-yellow-400' : 'text-white'}`}>
                        {editingId ? 'Edit Achievement' : 'Tambah Achievement Baru'}
                    </h3>

                    {formError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-xs">
                            {formError}
                        </div>
                    )}
                    
                    {formSuccess && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl mb-6 text-xs transform -translate-y-2">
                            {formSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Nama Achievement *</label>
                                <input
                                    type="text" name="name" required placeholder="Nama achievement"
                                    value={formData.name} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Kategori *</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none transition appearance-none cursor-pointer ${
                                        formData.category ? 'text-white' : 'text-gray-500'
                                    }`}
                                >
                                    <option value="" disabled className="text-gray-500 bg-[#1E2235]">
                                        Pilih kategori
                                    </option>
                                    {ACTION_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="text-white bg-[#1E2235]">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Milestone Threshold *</label>
                                <input
                                    type="number" name="milestoneThreshold" required min="1" placeholder="Minimal 1"
                                    value={formData.milestoneThreshold} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Badge URL</label>
                                <input
                                    type="url" name="badgeUrl" placeholder="URL gambar badge (opsional)"
                                    value={formData.badgeUrl} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs text-gray-400 mb-1.5 ml-1">Deskripsi</label>
                            <textarea
                                name="description" placeholder="Deskripsi achievement (opsional)" rows={3}
                                value={formData.description} onChange={handleInputChange}
                                className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition resize-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit" disabled={isSubmitting}
                                className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'} px-8 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-lg`}
                            >
                                {isSubmitting ? 'Proses...' : (editingId ? 'Update Achievement' : 'Simpan Achievement')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#131627] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="font-semibold text-sm">Daftar Achievement</h2>
                </div>
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 text-sm">Memuat data...</div>
                ) : achievements.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 text-sm italic">Belum ada achievement.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-xs text-gray-500 border-b border-gray-800 bg-white/5">
                                <th className="text-left px-6 py-3 font-medium">Nama</th>
                                <th className="text-left px-6 py-3 font-medium">Kategori</th>
                                <th className="text-left px-6 py-3 font-medium">Milestone</th>
                                <th className="text-left px-6 py-3 font-medium">Deskripsi</th>
                                <th className="text-left px-6 py-3 font-medium">Badge</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {achievements.map((ach) => (
                                <tr key={ach.id} className="border-b border-gray-800/50 hover:bg-white/5 transition group">
                                    <td className="px-6 py-4 font-medium">{ach.name}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {ach.category ? (
                                            <span className={`text-xs px-2 py-1 rounded-full ${ach.category === 'READ_ARTICLE' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                                {getActionTypeLabel(ach.category)}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">{ach.milestoneThreshold}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{ach.description || '-'}</td>
                                    <td className="px-6 py-4">
                                        {ach.badgeUrl ? (
                                            <img src={ach.badgeUrl} alt="badge" className="w-8 h-8 rounded-lg object-cover border border-gray-700" />
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(ach)}
                                                className="text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ach.id)}
                                                className="text-xs text-red-500 hover:text-red-400 font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementManager;

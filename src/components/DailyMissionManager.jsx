import React, { useState, useEffect } from 'react';
import { getAllMissions, createMission, updateMission, deleteMission } from '../api/dailyMission';

const DailyMissionManager = () => {
    const token = localStorage.getItem('token');
    const [missions, setMissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form & UI States
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        title: '',
        description: '',
        targetCount: 1,
        rewardPoints: 10,
        actionType: 'FINISH_QUIZ',
        status: 'INACTIVE'
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllMissions(token);
            setMissions(data);
        } catch (err) {
            setFormError(err.message);
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
                ...formData,
                targetCount: parseInt(formData.targetCount),
                rewardPoints: parseInt(formData.rewardPoints)
            };

            if (editingId) {
                await updateMission(token, editingId, payload);
                setFormSuccess('Daily Mission berhasil diperbarui!');
            } else {
                await createMission(token, payload);
                setFormSuccess('Daily Mission baru berhasil ditambahkan!');
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

    const startEdit = (mission) => {
        setEditingId(mission.id);
        setFormData({
            title: mission.title,
            description: mission.description,
            targetCount: mission.targetCount,
            rewardPoints: mission.rewardPoints,
            actionType: mission.actionType,
            status: mission.status
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus daily mission ini?')) {
            try {
                await deleteMission(token, id);
                fetchData();
                setFormSuccess('Mission dihapus.');
                setTimeout(() => setFormSuccess(''), 3000);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-sm text-gray-300">Daftar Daily Mission</h2>
                <button
                    onClick={() => (showForm ? handleReset() : setShowForm(true))}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl transition font-medium shadow-lg shadow-blue-900/20"
                >
                    {showForm ? 'Batal' : '+ Tambah Mission'}
                </button>
            </div>

            {formSuccess && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-2xl text-xs animate-fade-in">
                    {formSuccess}
                </div>
            )}

            {/* Form Section */}
            {showForm && (
                <div className={`bg-[#131627] rounded-2xl border ${editingId ? 'border-yellow-500/30' : 'border-gray-800'} p-6 shadow-2xl animate-fade-in`}>
                    <h3 className={`font-semibold text-sm mb-6 ${editingId ? 'text-yellow-400' : 'text-white'}`}>
                        {editingId ? 'Edit Daily Mission' : 'Konfigurasi Mission Baru'}
                    </h3>

                    {formError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-xs">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Judul Mission</label>
                                <input
                                    type="text" name="title" required placeholder="Contoh: Sang Kutu Buku"
                                    value={formData.title} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3 text-sm outline-none text-white transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Reward Points</label>
                                <input
                                    type="number" name="rewardPoints" required min="1"
                                    value={formData.rewardPoints} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Target (Milestone)</label>
                                <input
                                    type="number" name="targetCount" required min="1"
                                    value={formData.targetCount} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Tipe Aksi</label>
                                <select
                                    name="actionType" value={formData.actionType} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white transition cursor-pointer"
                                >
                                    <option value="READ_ARTICLE">Membaca Artikel</option>
                                    <option value="FINISH_QUIZ">Menyelesaikan Kuis</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Status</label>
                                <select
                                    name="status" value={formData.status} onChange={handleInputChange}
                                    className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white transition cursor-pointer"
                                >
                                    <option value="ACTIVE">Aktif (Rotasi)</option>
                                    <option value="INACTIVE">Nonaktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Deskripsi Mission</label>
                            <textarea
                                name="description" required rows={3}
                                value={formData.description} onChange={handleInputChange}
                                className="w-full bg-[#1E2235] border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white transition resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit" disabled={isSubmitting}
                                className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'} px-8 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-lg`}
                            >
                                {isSubmitting ? 'Proses...' : (editingId ? 'Update Data' : 'Simpan Mission')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-[#131627] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 text-sm">Menghubungkan ke server...</div>
                ) : missions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 text-sm italic">Belum ada misi harian yang terdaftar.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-white/5">
                                <th className="text-left px-6 py-4 font-bold">Informasi Misi</th>
                                <th className="text-left px-6 py-4 font-bold">Target</th>
                                <th className="text-left px-6 py-4 font-bold">Reward</th>
                                <th className="text-left px-6 py-4 font-bold">Tipe</th>
                                <th className="text-left px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                            {missions.map((mission) => (
                                <tr key={mission.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-white mb-0.5">{mission.title}</p>
                                        <p className="text-[11px] text-gray-500 line-clamp-1">{mission.description}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                                                {mission.targetCount}x
                                            </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-yellow-500">{mission.rewardPoints} Pts</span>
                                    </td>
                                    <td className="px-6 py-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {mission.actionType === 'FINISH_QUIZ' ? 'KUIS' : 'BACAAN'}
                                            </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {mission.status === 'ACTIVE' ? (
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 font-bold">AKTIF</span>
                                        ) : (
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-bold">NONAKTIF</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-4 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(mission)} className="text-xs text-yellow-400 hover:text-yellow-300 font-medium">Edit</button>
                                            <button onClick={() => handleDelete(mission.id)} className="text-xs text-red-500 hover:text-red-400 font-medium">Hapus</button>
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

export default DailyMissionManager;
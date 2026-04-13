import React, { useState, useEffect } from 'react';
import { getAllMissions, createMission, updateMission, deleteMission } from '../api/dailyMission';

const DailyMissionManager = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk Form & UI
    const [showAddMission, setShowAddMission] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialFormState = {
        title: '',
        description: '',
        targetCount: 1,
        actionType: 'FINISH_QUIZ',
        active: false
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            setLoading(true);
            const data = await getAllMissions();
            setMissions(data);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditId(null);
        setShowAddMission(false);
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');
        try {
            if (isEditing) {
                await updateMission(editId, formData);
                setFormSuccess('Mission berhasil diupdate!');
            } else {
                await createMission(formData);
                setFormSuccess('Mission berhasil ditambahkan!');
            }
            resetForm();
            setTimeout(() => setFormSuccess(''), 3000);
            fetchMissions();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (mission) => {
        setIsEditing(true);
        setShowAddMission(true);
        setEditId(mission.id);
        setFormData({
            title: mission.title,
            description: mission.description,
            targetCount: mission.targetCount,
            actionType: mission.actionType,
            active: mission.active
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus mission ini?')) {
            try {
                await deleteMission(id);
                fetchMissions();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div>
            {/* Header Area */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-sm text-gray-300">Daftar Daily Mission</h2>
                <button
                    onClick={() => {
                        if (showAddMission || isEditing) {
                            resetForm();
                        } else {
                            setShowAddMission(true);
                        }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl transition font-medium"
                >
                    {showAddMission || isEditing ? 'Batal' : '+ Tambah Mission'}
                </button>
            </div>

            {formSuccess && <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-4 text-xs">{formSuccess}</div>}

            {/* Form Tambah/Edit */}
            {(showAddMission || isEditing) && (
                <div className={`bg-[#131627] rounded-2xl border ${isEditing ? 'border-yellow-500/30' : 'border-gray-800'} p-6 mb-6`}>
                    <h3 className={`font-semibold text-sm mb-4 ${isEditing ? 'text-yellow-400' : ''}`}>
                        {isEditing ? 'Edit Daily Mission' : 'Tambah Daily Mission Baru'}
                    </h3>
                    {formError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-xs">{formError}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Judul Mission *</label>
                                <input
                                    type="text" name="title" required placeholder="Contoh: Rajin Membaca"
                                    value={formData.title} onChange={handleInputChange}
                                    className={`w-full bg-[#1E2235] border ${isEditing ? 'border-yellow-500/30 focus:border-yellow-500' : 'border-transparent focus:border-blue-500'} rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Target Angka (Milestone) *</label>
                                <input
                                    type="number" name="targetCount" required min="1" placeholder="Minimal 1"
                                    value={formData.targetCount} onChange={handleInputChange}
                                    className={`w-full bg-[#1E2235] border ${isEditing ? 'border-yellow-500/30 focus:border-yellow-500' : 'border-transparent focus:border-blue-500'} rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition`}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">Tipe Aksi *</label>
                                <select
                                    name="actionType" value={formData.actionType} onChange={handleInputChange}
                                    className={`w-full bg-[#1E2235] border ${isEditing ? 'border-yellow-500/30 focus:border-yellow-500' : 'border-transparent focus:border-blue-500'} rounded-xl p-3 text-sm outline-none text-white transition`}
                                >
                                    <option value="READ_ARTICLE">Membaca Artikel</option>
                                    <option value="FINISH_QUIZ">Menyelesaikan Kuis</option>
                                </select>
                            </div>
                            <div className="flex items-center mt-6 ml-2">
                                <label className="flex items-center text-sm text-gray-300 cursor-pointer hover:text-white transition">
                                    <input
                                        type="checkbox" name="active"
                                        checked={formData.active} onChange={handleInputChange}
                                        className="mr-3 w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-[#1E2235]"
                                    />
                                    Aktifkan Misi Ini (Masuk Rotasi Harian)
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 ml-1">Deskripsi *</label>
                            <textarea
                                name="description" required placeholder="Deskripsi mission..." rows={3}
                                value={formData.description} onChange={handleInputChange}
                                className={`w-full bg-[#1E2235] border ${isEditing ? 'border-yellow-500/30 focus:border-yellow-500' : 'border-transparent focus:border-blue-500'} rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition resize-none`}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={isSubmitting}
                                    className={`${isEditing ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'} px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50`}>
                                {isSubmitting ? 'Menyimpan...' : (isEditing ? 'Update Mission' : 'Simpan Mission')}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={resetForm}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm transition">
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel Daftar Misi */}
            <div className="bg-[#131627] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="font-semibold text-sm">Daftar Misi Tersimpan</h2>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500 text-sm">Memuat data...</div>
                ) : missions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">Belum ada daily mission.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-xs text-gray-500 border-b border-gray-800">
                                <th className="text-left px-6 py-3 font-medium">Judul</th>
                                <th className="text-left px-6 py-3 font-medium">Target</th>
                                <th className="text-left px-6 py-3 font-medium">Tipe Aksi</th>
                                <th className="text-left px-6 py-3 font-medium">Deskripsi</th>
                                <th className="text-left px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {missions.map((mission) => (
                                <tr key={mission.id} className="border-b border-gray-800/50 hover:bg-white/5 transition">
                                    <td className="px-6 py-4 font-medium">{mission.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">{mission.targetCount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                                {mission.actionType === 'FINISH_QUIZ' ? 'Kuis' : 'Bacaan'}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{mission.description}</td>
                                    <td className="px-6 py-4">
                                        {mission.active ? (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Aktif</span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Nonaktif</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                onClick={() => handleEdit(mission)}
                                                className="text-xs text-yellow-400 hover:text-yellow-300 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mission.id)}
                                                className="text-xs text-red-400 hover:text-red-300 transition"
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

export default DailyMissionManager;
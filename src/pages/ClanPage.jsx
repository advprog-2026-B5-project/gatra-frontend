import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllClans,
    getMyClan,
    createClan,
    applyToClan,
    decideMembership,
    deleteClan,
    kickMember,
    leaveClan,
    getAllTierLeaderboards,
} from '../api/clan';

function Spinner() {
    return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
    );
}

function Feedback({ type, message }) {
    if (!message) return null;
    const colors =
        type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400';
    return (
        <div className={`mb-6 p-4 rounded-2xl text-sm border ${colors}`}>
            {message}
        </div>
    );
}

// make clan modal
function MakeClanModal({ onClose, onCreated, token }) {
    const [form, setForm] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Nama clan wajib diisi.'); return; }
        setLoading(true);
        setError('');
        try {
            const clan = await createClan(token, form);
            onCreated(clan);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5,9,24,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-[#131627] border border-gray-700/60 rounded-3xl p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-1">Buat Clan Baru</h2>
                <p className="text-gray-500 text-xs mb-6">Kamu akan otomatis menjadi Ketua Clan.</p>

                {error && (
                    <div className="mb-4 p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/30 text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1.5 block">
                            Nama Clan *
                        </label>
                        <input
                            type="text"
                            placeholder="contoh: Nusantara Readers"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1.5 block">
                            Deskripsi
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Ceritakan sedikit tentang clan kamu..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 text-sm font-bold text-gray-400 border border-gray-700 rounded-xl py-2.5 hover:border-gray-500 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 transition disabled:opacity-50 shadow-lg shadow-blue-600/20"
                        >
                            {loading ? 'Membuat...' : 'Buat Clan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// all clan tab
function AllClansTab({ token, myClan, pendingClanId, onApply }) {
    const [clans, setClans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        getAllClans()
            .then(setClans)
            .catch((err) => setFeedback({ type: 'error', message: err.message }))
            .finally(() => setLoading(false));
    }, []);

    const handleApply = async (clanId) => {
        setApplyingId(clanId);
        setFeedback({ type: '', message: '' });
        try {
            await applyToClan(token, clanId);
            setFeedback({ type: 'success', message: 'Berhasil apply! Menunggu persetujuan ketua.' });
            onApply(clanId);
        } catch (err) {
            setFeedback({ type: 'error', message: err.message });
        } finally {
            setApplyingId(null);
        }
    };

    if (loading) return <Spinner />;

    return (
        <>
            <Feedback {...feedback} />

            {clans.length === 0 ? (
                <div className="bg-[#131627] border border-gray-800 rounded-3xl p-16 text-center">
                    <div className="text-4xl mb-4">🏰</div>
                    <p className="text-gray-400">Belum ada clan yang terbentuk.</p>
                    <p className="text-gray-500 text-sm mt-2">Jadilah yang pertama!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {clans.map((clan) => {
                        const isMyApprovedClan = myClan?.id === clan.id && myClan?.membershipStatus === 'APPROVED';
                        const isPending = pendingClanId === clan.id;

                        return (
                            <div
                                key={clan.id}
                                className={`bg-[#131627] border rounded-2xl p-6 transition-all ${
                                    isMyApprovedClan
                                        ? 'border-blue-500/30'
                                        : 'border-gray-800 hover:border-gray-700'
                                }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Avatar placeholder */}
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/40 to-lilac-sky-500/30 border border-white/10 flex items-center justify-center text-xl font-black text-white shrink-0">
                                        {clan.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-bold text-white truncate">{clan.name}</h3>
                                            {isMyApprovedClan && (
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg shrink-0">
                                                    Clan Kamu
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {clan.description || 'Tidak ada deskripsi.'}
                                        </p>
                                        <p className="text-[10px] text-gray-600 mt-1">
                                            {clan.memberCount ?? '—'} anggota
                                        </p>
                                    </div>

                                    {/* Action button */}
                                    <div className="shrink-0">
                                        {!token ? (
                                            <span className="text-xs text-gray-600 italic">Login untuk join</span>
                                        ) : isMyApprovedClan ? (
                                            <span className="text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
                                                ✓ Bergabung
                                            </span>
                                        ) : isPending ? (
                                            <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl animate-pulse">
                                                ⏳ PENDING
                                            </span>
                                        ) : myClan ? (
                                            <span className="text-xs text-gray-600 italic">Sudah di clan lain</span>
                                        ) : (
                                            <button
                                                onClick={() => handleApply(clan.id)}
                                                disabled={applyingId === clan.id}
                                                className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl transition disabled:opacity-50 shadow-lg shadow-blue-600/20"
                                            >
                                                {applyingId === clan.id ? 'Mendaftar...' : 'Join'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

// your clan tab
function YourClanTab({ token, myClan, pendingClanId, onClanDeleted, onMemberKicked }) {
    // Belum join atau masih pending
    if (!myClan || myClan.membershipStatus === 'PENDING' || pendingClanId) {
        return (
            <div className="bg-[#131627] border border-gray-800 rounded-3xl p-16 text-center">
                <div className="text-4xl mb-4">
                    {pendingClanId || myClan?.membershipStatus === 'PENDING' ? '⏳' : '🏕️'}
                </div>
                <p className="text-gray-400 font-bold">
                    {pendingClanId || myClan?.membershipStatus === 'PENDING'
                        ? 'Menunggu persetujuan ketua clan...'
                        : 'Kamu belum bergabung dengan clan manapun.'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                    {pendingClanId || myClan?.membershipStatus === 'PENDING'
                        ? 'Sabar ya, ketua clan akan segera memutuskan.'
                        : 'Cari clan di tab "Semua Clan" atau buat clan baru.'}
                </p>
            </div>
        );
    }

    const clan = myClan;
    const isLeader = clan.myRole === 'LEADER';

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [memberToKick, setMemberToKick] = useState(null);
    const [kicking, setKicking] = useState(null);
    const [kickError, setKickError] = useState('');
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [leaveError, setLeaveError] = useState('');

    const handleDeleteClan = async () => {
        setDeleting(true);
        setDeleteError('');
        try {
            await deleteClan(token, clan.id);
            setShowDeleteConfirm(false);
            onClanDeleted();
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleKick = async () => {
        if (!memberToKick) return;
        setKicking(true);
        setKickError('');
        try {
            await kickMember(token, clan.id, memberToKick.userId);
            setMemberToKick(null);
            if (onMemberKicked) onMemberKicked();
        } catch (err) {
            setKickError(err.message);
        } finally {
            setKicking(false);
        }
    }

    const handleLeave = async () => {
        if (isLeader) return;
        setLeaving(true);
        setLeaveError('');
        try {
            await leaveClan(token, clan.id);
            setShowLeaveConfirm(false);
            onMemberKicked();
        } catch (err) {
            setLeaveError(err.message);
        } finally {
            setLeaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Clan card */}
            <div className="bg-[#131627] border border-blue-500/20 rounded-3xl p-8">
                <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/40 to-lilac-sky-500/30 border border-white/10 flex items-center justify-center text-3xl font-black text-white shrink-0">
                        {clan.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-white">{clan.name}</h2>
                            {isLeader && (
                                <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg">
                                    👑 Ketua
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            {clan.description || 'Tidak ada deskripsi.'}
                        </p>
                        <div className="flex items-end justify-between mt-3">
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">Anggota</p>
                                    <p className="text-sm font-bold text-white">{clan.memberCount ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">Tier</p>
                                    <p className="text-sm font-bold text-white">{clan.tier ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">Skor</p>
                                    <p className="text-sm font-bold text-white">{clan.score ?? '—'}</p>
                                </div>
                            </div>

                            {/* Hapus Clan, hanya leader */}
                            {isLeader && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl transition"
                                >
                                    🗑 Hapus Clan
                                </button>
                            )}

                            {!isLeader && (
                                <button
                                    onClick={() => setShowLeaveConfirm(true)}
                                    className="text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl transition"
                                >
                                    🚪 Keluar dari Clan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Member list */}
            {clan.members && clan.members.length > 0 && (
                <div className="bg-[#131627] border border-gray-800 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Anggota</h3>
                    <div className="space-y-3">
                        {clan.members.map((member) => (
                            <div key={member.userId} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                    {member.displayName?.charAt(0).toUpperCase() ?? '?'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">{member.displayName}</p>
                                </div>
                                {member.role === 'LEADER' && (
                                    <span className="text-[10px] text-yellow-400">👑 Ketua</span>
                                )}

                                {/* Tombol kick, hanya untuk leader */}
                                {isLeader && member.role !== 'LEADER' && (
                                    <button
                                        onClick={() => setMemberToKick(member)}
                                        className="transition-opacity text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20"
                                    >
                                        Kick
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending applications hanya bisa diliat leader */}
            {isLeader && clan.pendingApplications && clan.pendingApplications.length > 0 && (
                <div className="bg-[#131627] border border-yellow-500/20 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4">
                        Permintaan Bergabung ({clan.pendingApplications.length})
                    </h3>
                    <div className="space-y-3">
                        {clan.pendingApplications.map((app) => (
                            <PendingApplicationRow key={app.userId} app={app} clanId={clan.id} token={token} />
                        ))}
                    </div>
                </div>
            )}

            {/* konfirmasi hapus clan */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(5,9,24,0.85)', backdropFilter: 'blur(6px)' }}
                    onClick={() => !deleting && setShowDeleteConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm bg-[#131627] border border-red-500/30 rounded-3xl p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-3xl mb-3 text-center">⚠️</div>
                        <h2 className="text-lg font-bold text-white text-center mb-1">Hapus Clan?</h2>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Clan <span className="text-white font-bold">"{clan.name}"</span> akan dihapus permanen beserta seluruh anggotanya. Aksi ini tidak bisa dibatalkan.
                        </p>

                        {deleteError && (
                            <div className="mb-4 p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/30 text-red-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="flex-1 text-sm font-bold text-gray-400 border border-gray-700 rounded-xl py-2.5 hover:border-gray-500 transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteClan}
                                disabled={deleting}
                                className="flex-1 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl py-2.5 transition disabled:opacity-50"
                            >
                                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi kick member */}
            {memberToKick && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(5,9,24,0.85)', backdropFilter: 'blur(6px)' }}
                    onclick={() => !kicking && setMemberToKick(null)}
                >
                    <div
                        className="w-full max-w-sm bg-[#131627] border border-red-500/30 rounded-3xl p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-3xl mb-3 text-center">⚠️</div>
                        <h2 className="text-lg font-bold text-white text-center mb-1">Hapus Clan?</h2>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Apakah kamu yakin ingin mengeluarkan <span className="text-white font-bold">"{memberToKick.displayName}"</span> dari clan?
                        </p>

                        {kickError && (
                            <div className="mb-4 p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/30 text-red-400">
                                {kickError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setMemberToKick(null)}
                                disabled={kicking}
                                className="flex-1 text-sm font-bold text-gray-400 border border-gray-700 rounded-xl py-2.5 hover:border-gray-500 transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleKick}
                                disabled={kicking}
                                className="flex-1 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl py-2.5 transition disabled:opacity-50"
                            >
                                {kicking ? 'Memproses...' : 'Ya, kick'}
                            </button>
                        </div>
                    </div>
                </div> 
            )}

            {/* Modal konfirmasi leave clan*/}
            {showLeaveConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(5,9,24,0.85)', backdropFilter: 'blur(6px)' }}
                    onclick={() => !leaving && setShowLeaveConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm bg-[#131627] border border-red-500/30 rounded-3xl p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-3xl mb-3 text-center">⚠️</div>
                        <h2 className="text-lg font-bold text-white text-center mb-1">Hapus Clan?</h2>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Apakah kamu yakin ingin keluar dari clan <span className="text-white font-bold">"{clan.name}"</span>?
                        </p>

                        {leaveError && (
                            <div className="mb-4 p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/30 text-red-400">
                                {leaveError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLeaveConfirm(false)}
                                disabled={leaving}
                                className="flex-1 text-sm font-bold text-gray-400 border border-gray-700 rounded-xl py-2.5 hover:border-gray-500 transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLeave}
                                disabled={leaving}
                                className="flex-1 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl py-2.5 transition disabled:opacity-50"
                            >
                                {kicking ? 'Memproses...' : 'Ya, keluar'}
                            </button>
                        </div>
                    </div>
                </div> 
            )}
        </div>
    );
}

function PendingApplicationRow({ app, clanId, token }) {
    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(null);

    const decide = async (decision) => {
        setLoading(decision);
        try {
            await decideMembership(token, clanId, app.userId, decision);
            setStatus(decision);
        } catch {
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                {app.displayName?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <p className="flex-1 text-sm text-white">{app.displayName}</p>

            {status === 'PENDING' ? (
                <div className="flex gap-2">
                    <button
                        onClick={() => decide('APPROVED')}
                        disabled={!!loading}
                        className="text-xs font-bold bg-green-600/80 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition disabled:opacity-50"
                    >
                        {loading === 'APPROVED' ? '...' : 'Terima'}
                    </button>
                    <button
                        onClick={() => decide('REJECTED')}
                        disabled={!!loading}
                        className="text-xs font-bold bg-red-600/40 hover:bg-red-500/60 text-red-300 px-3 py-1 rounded-lg transition disabled:opacity-50"
                    >
                        {loading === 'REJECTED' ? '...' : 'Tolak'}
                    </button>
                </div>
            ) : status === 'APPROVED' ? (
                <span className="text-xs text-green-400 font-bold">✓ Diterima</span>
            ) : (
                <span className="text-xs text-red-400 font-bold">✗ Ditolak</span>
            )}
        </div>
    );
}

const TIER_COLORS = {
    BRONZE: { border: 'border-amber-700/40', text: 'text-amber-600', bg: 'bg-amber-700/10', badge: '🥉' },
    SILVER: { border: 'border-gray-400/40', text: 'text-gray-300', bg: 'bg-gray-400/10', badge: '🥈' },
    GOLD: { border: 'border-yellow-400/40', text: 'text-yellow-400', bg: 'bg-yellow-400/10', badge: '🥇' },
    DIAMOND: { border: 'border-cyan-400/40', text: 'text-cyan-400', bg: 'bg-cyan-400/10', badge: '💎' },
};

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LeaderboardTab() {
    const [leaderboards, setLeaderboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTier, setActiveTier] = useState('BRONZE');

    useEffect(() => {
        getAllTierLeaderboards()
            .then(setLeaderboards)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;
    if (error) return <Feedback type="error" message={error} />;

    const currentTierData = leaderboards.find((lb) => lb.tier === activeTier);

    return (
        <div className="space-y-4">
            {/* Tier selector */}
            <div className="flex gap-1 bg-white/5 border border-gray-800 rounded-2xl p-1 w-fit">
                {Object.keys(TIER_COLORS).map((tier) => {
                    const colors = TIER_COLORS[tier];
                    return (
                        <button
                            key={tier}
                            onClick={() => setActiveTier(tier)}
                            className={`text-sm font-bold px-4 py-2 rounded-xl transition ${
                                activeTier === tier
                                    ? `${colors.bg} ${colors.text} border ${colors.border}`
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {colors.badge} {tier}
                        </button>
                    );
                })}
            </div>

            {/* Rankings */}
            <div className="bg-[#131627] border border-gray-800 rounded-3xl p-6">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${TIER_COLORS[activeTier].text}`}>
                    {TIER_COLORS[activeTier].badge} Tier {activeTier}
                </h3>

                {!currentTierData || currentTierData.rankings.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-sm">Belum ada clan di tier ini.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentTierData.rankings.map((entry) => (
                            <div
                                key={entry.clanId}
                                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                                    entry.rank <= 3
                                        ? `${TIER_COLORS[activeTier].bg} ${TIER_COLORS[activeTier].border}`
                                        : 'bg-white/5 border-gray-800'
                                }`}
                            >
                                {/* Rank */}
                                <div className="w-8 text-center shrink-0">
                                    {RANK_MEDALS[entry.rank] ? (
                                        <span className="text-xl">{RANK_MEDALS[entry.rank]}</span>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-500">#{entry.rank}</span>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/40 to-purple-500/30 border border-white/10 flex items-center justify-center text-sm font-black text-white shrink-0">
                                    {entry.clanName.charAt(0).toUpperCase()}
                                </div>

                                {/* Clan name */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{entry.clanName}</p>
                                    <p className="text-xs text-gray-500">Tier {entry.tier}</p>
                                </div>

                                {/* Score */}
                                <div className="shrink-0 text-right">
                                    <p className={`text-sm font-bold ${TIER_COLORS[activeTier].text}`}>
                                        {entry.score.toFixed(1)}
                                    </p>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">poin</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// main page
const ClanPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [activeTab, setActiveTab] = useState('all');
    const [myClan, setMyClan] = useState(null);
    const [pendingClanId, setPendingClanId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingMyClan, setLoadingMyClan] = useState(true);

    useEffect(() => {
        if (!token) { setLoadingMyClan(false); return; }
        getMyClan(token)
            .then((data) => {
                if (data?.membershipStatus === 'PENDING') {
                    setPendingClanId(data.id);
                    setMyClan(data);
                } else {
                    setMyClan(data);
                }
            })
            .catch(() => {})
            .finally(() => setLoadingMyClan(false));
    }, []);

    const handleClanCreated = (clan) => {
        setMyClan({ ...clan, myRole: 'LEADER', membershipStatus: 'APPROVED' });
        setShowModal(false);
        setActiveTab('your');
    };

    const handleApplied = (clanId) => {
        setPendingClanId(clanId);
    };

    const handleClanDeleted = () => {
        setMyClan(null);
        setPendingClanId(null);
        setActiveTab('all');
    };

    const refreshClanData = () => {
        getMyClan(token).then(setMyClan).catch(() => {});
    }

    // bisa buat clan jika belum masuk di clan manapun (termasuk pending)
    const canMakeClan = token && !myClan && !pendingClanId;

    const tabs = [
        { key: 'all', label: 'Semua Clan' },
        { key: 'your', label: 'Clan Kamu' },
        { key: 'leaderboard', label: 'Leaderboard' },
    ];

    return (
        <div className="min-h-screen bg-[#0B0D1A] p-6 md:p-8 text-white">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-lilac-sky-400 bg-clip-text text-transparent">
                            Clan
                        </h1>
                        <p className="text-gray-400 mt-1 text-sm">
                            Bergabunglah dengan clan dan bersaing di liga bersama.
                        </p>
                    </div>

                    <button
                        onClick={() => canMakeClan && setShowModal(true)}
                        disabled={!canMakeClan}
                        title={
                            !token
                                ? 'Login untuk membuat clan'
                                : !canMakeClan
                                    ? 'Kamu sudah bergabung dengan sebuah clan'
                                    : 'Buat clan baru'
                        }
                        className={`shrink-0 text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg ${
                            canMakeClan
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 cursor-pointer'
                                : 'bg-white/5 text-gray-600 border border-gray-800 cursor-not-allowed'
                        }`}
                    >
                        + Make Clan
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex gap-1 bg-white/5 border border-gray-800 rounded-2xl p-1 mb-6 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-sm font-bold px-5 py-2 rounded-xl transition ${
                                activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {loadingMyClan ? (
                    <Spinner />
                ) : activeTab === 'all' ? (
                    <AllClansTab
                        token={token}
                        myClan={myClan}
                        pendingClanId={pendingClanId}
                        onApply={handleApplied}
                    />
                ) : activeTab === 'leaderboard' ? (
                    <LeaderboardTab />
                ) : (
                    <YourClanTab
                        token={token}
                        myClan={myClan}
                        pendingClanId={pendingClanId}
                        onClanDeleted={handleClanDeleted}
                        onMemberKicked={refreshClanData}
                    />
                )}
            </div>

            {/* Clan modal */}
            {showModal && (
                <MakeClanModal
                    token={token}
                    onClose={() => setShowModal(false)}
                    onCreated={handleClanCreated}
                />
            )}
        </div>
    );
};

export default ClanPage;
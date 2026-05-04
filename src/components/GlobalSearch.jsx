import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../api/social';

const GlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const data = await searchUsers(token, query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query, token]);

    const handleSelectUser = (username) => {
        setIsOpen(false);
        setQuery('');
        navigate(`/u/${username}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-sm hidden md:block z-50">
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Cari user..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-full bg-[#131627] border border-gray-800 text-sm text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500"
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-[#131627] border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    {results.map((user) => (
                        <div
                            key={user.userId}
                            onClick={() => handleSelectUser(user.username)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#1E2235] cursor-pointer transition-colors border-b border-gray-800/50 last:border-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                                {user.displayName ? user.displayName.charAt(0) : user.username.charAt(0)}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-white truncate">{user.displayName || user.username}</span>
                                <span className="text-xs text-gray-400 truncate">@{user.username}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
                <div className="absolute mt-2 w-full bg-[#131627] border border-gray-800 rounded-xl shadow-2xl p-4 text-center text-sm text-gray-500">
                    Tidak ada user ditemukan.
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
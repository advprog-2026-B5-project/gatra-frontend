import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyMissionManager from '../components/DailyMissionManager';
import AchievementManager from '../components/AchievementManager';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const API = import.meta.env.VITE_API_URL;

    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('users');

    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingArticles, setIsLoadingArticles] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [achievementCount, setAchievementCount] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [showAddArticle, setShowAddArticle] = useState(false);
    const [articleForm, setArticleForm] = useState({ title: '', content: '' });

    const [editingArticle, setEditingArticle] = useState(null);
    const [editArticleForm, setEditArticleForm] = useState({ title: '', content: '' });

    const [expandedQuizArticleId, setExpandedQuizArticleId] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState({});

    const [questionForm, setQuestionForm] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        type: 'MULTIPLE_CHOICE'
    });

    const [editQuestionForm, setEditQuestionForm] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        type: 'MULTIPLE_CHOICE'
    });

    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showAddQuestion, setShowAddQuestion] = useState(false);

    const [passingScoreForm, setPassingScoreForm] = useState('');
    const [quizError, setQuizError] = useState('');
    const [quizSuccess, setQuizSuccess] = useState('');

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
        try {
            const res = await fetch(`${API}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(await res.json());
        } catch {}
        setIsLoadingUsers(false);
    };

    const fetchArticles = async () => {
        try {
            const res = await fetch(`${API}/api/articles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(await res.json());
        } catch {}
        setIsLoadingArticles(false);
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(await res.json());
        } catch {}
        setIsLoadingCategories(false);
    };

    const fetchQuestions = async (articleId) => {
        try {
            const res = await fetch(`${API}/api/quiz/article/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setQuizQuestions(prev => ({ ...prev, [articleId]: data }));
        } catch {}
    };

    const toggleQuiz = (articleId, currentPassingScore) => {
        if (expandedQuizArticleId === articleId) {
            setExpandedQuizArticleId(null);
        } else {
            setExpandedQuizArticleId(articleId);
            setPassingScoreForm(currentPassingScore ?? '');
            fetchQuestions(articleId);
        }
    };

    const handleAddQuestion = async (articleId) => {
        setQuizError('');

        try {
            const res = await fetch(`${API}/api/quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...questionForm, articleId }),
            });

            if (!res.ok) throw new Error();

            setQuizSuccess('Berhasil tambah soal');
            fetchQuestions(articleId);
        } catch {
            setQuizError('Gagal tambah soal');
        }
    };

    const handleEditQuestion = async (articleId) => {
        try {
            const res = await fetch(`${API}/api/quiz/${editingQuestion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editQuestionForm),
            });

            if (!res.ok) throw new Error();

            setEditingQuestion(null);
            fetchQuestions(articleId);
        } catch {
            setQuizError('Gagal edit');
        }
    };

    const handleDeleteQuestion = async (id, articleId) => {
        await fetch(`${API}/api/quiz/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchQuestions(articleId);
    };

    const handleSetPassingScore = async (articleId) => {
        await fetch(`${API}/api/quiz/passing-score/${articleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ passingScore: Number(passingScoreForm) }),
        });
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-xl mb-4">Admin Dashboard</h1>

            <div className="flex gap-2 mb-4">
                {['users', 'categories', 'achievements', 'missions'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'categories' && (
                <div>
                    {categories.map(cat => (
                        <div key={cat.id} onClick={() => setSelectedCategory(cat)}>
                            {cat.name}
                        </div>
                    ))}
                </div>
            )}

            {selectedCategory && (
                <div>
                    {articles
                        .filter(a => a.categoryId === selectedCategory.id)
                        .map(article => (
                            <div key={article.id}>
                                <p>{article.title}</p>

                                <button onClick={() => toggleQuiz(article.id, article.passingScore)}>
                                    Quiz
                                </button>

                                {expandedQuizArticleId === article.id && (
                                    <div>
                                        <input
                                            value={passingScoreForm}
                                            onChange={e => setPassingScoreForm(e.target.value)}
                                        />

                                        <button onClick={() => handleSetPassingScore(article.id)}>
                                            Save Score
                                        </button>

                                        <button onClick={() => setShowAddQuestion(!showAddQuestion)}>
                                            Add Question
                                        </button>

                                        {showAddQuestion && (
                                            <button onClick={() => handleAddQuestion(article.id)}>
                                                Submit Question
                                            </button>
                                        )}

                                        {(quizQuestions[article.id] || []).map(q => (
                                            <div key={q.id}>
                                                {q.text}
                                                <button onClick={() => handleDeleteQuestion(q.id, article.id)}>
                                                    delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            )}

            {activeTab === 'achievements' && (
                <AchievementManager onUpdateCount={setAchievementCount} />
            )}

            {activeTab === 'missions' && (
                <DailyMissionManager />
            )}
        </div>
    );
};

export default AdminDashboard;

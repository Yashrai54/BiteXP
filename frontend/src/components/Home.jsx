import React, { useState, useEffect, useMemo } from 'react';
 import { useAppContext } from '../context/UserContext'; // <-- COMMENTED OUT: Use MOCK definition below to resolve environment issue.
import axios from 'axios'; // <-- COMMENTED OUT: Use MOCK definition below to resolve environment issue.
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const { serverurl, user,completeRecipe } = useAppContext();
    const badgeThresholds=[50,100,200]
    const nextBadgeXP = badgeThresholds.find(xp => xp > user?.xp) || badgeThresholds[badgeThresholds.length - 1];
    const [recipes, setRecipes] = useState([]);
    const navigate=useNavigate();

    const progressPercent = useMemo(() => {
       
        if (!user || user.xp === undefined || nextBadgeXP=== undefined || nextBadgeXP<= 0) return 0;
        return Math.min(100, (user.xp / nextBadgeXP) * 100);
    }, [user]);

    // Original useEffect Hook
    useEffect(() => {
        const getRecipes = async () => {
            try {
                // NOTE: axios now refers to the mock object above for compilation
                const res = await axios.get(`${serverurl}/api/recipe`);
                console.log(res.data);
                setRecipes(res.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };
        getRecipes();
    }, [serverurl]);

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-4 sm:p-8 font-mono">
            <div className="max-w-4xl mx-auto border-4 border-slate-700 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                
                {/* ======================= HEADER SECTION ======================= */}
                <header className="mb-8 border-b-2 border-cyan-500 pb-4">
                    <h1 className="text-5xl font-extrabold text-yellow-400 tracking-widest mb-3 uppercase">
                        BITE<span className="text-cyan-400">XP</span>
                    </h1>
                    
                    {/* XP Summary and Progress Bar */}
                    <div className="mt-6">
                        <h2 className="font-extrabold text-xl text-yellow-400 tracking-widest uppercase mb-2">
                            XP: {user?.xp} / {nextBadgeXP|| 'N/A'}
                        </h2>
                        
                        {/* Gamified XP Bar: Gold/Dark Contrast */}
                        <div className="w-full bg-gray-700 border-2 border-yellow-500 rounded-lg h-6 overflow-hidden shadow-xl shadow-yellow-500/20">
                            <div
                                className="h-full 
                                           flex items-center justify-end pr-2 
                                           font-bold text-sm text-gray-900 
                                           transition-all duration-700 ease-out 
                                           bg-gradient-to-r from-yellow-300 to-yellow-500"
                                style={{ width: `${progressPercent}%` }}
                            >
                                {progressPercent > 10 && <span>{Math.round(progressPercent)}%</span>}
                            </div>
                        </div>
                    </div>
                    
                    {/* Badge Summary */}
                    <h3 className="text-sm font-semibold uppercase text-cyan-400 mt-6 mb-3 tracking-wider border-b border-gray-700 pb-1">
                        AWARDS / BADGE SUMMARY
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {Array.isArray(user?.badges)
                            ? user.badges.map((badge, i) => (
                                <span
                                    key={i}
                                    className="bg-cyan-700 text-white 
                                               px-3 py-1 rounded-md text-xs font-bold 
                                               border-2 border-cyan-400 shadow-lg 
                                               hover:bg-cyan-600 transition-colors"
                                >
                                    <span className="mr-1">★</span> {badge}
                                </span>
                            ))
                            : <span className="text-gray-500 text-sm">No awards acquired.</span>
                        }
                    </div>
                </header>

                {/* ======================= MAIN CONTENT (RECIPE QUESTS) ======================= */}
                <main>
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide border-b border-gray-700 pb-2 mb-4">
                            Featured Quests
                        </h1>
                        
                        <div className="space-y-4">
                            {recipes.map((recipe) => {
                                // Added optional chaining for safer access
                                const isCompleted = user?.completedRecipes?.includes(recipe._id);
                                
                                return (
                                    // Recipe Card: Replaced <li> with <div> for better styling control
                                    <div 
                                        key={recipe._id} 
                                        className={`p-4 rounded-xl transition-all duration-300
                                                    ${isCompleted 
                                                        ? 'bg-gray-800 opacity-60 border-l-4 border-green-500' 
                                                        : 'bg-slate-800 border-l-4 border-yellow-500 hover:bg-slate-700 shadow-xl'
                                                    } 
                                                    flex justify-between items-center flex-wrap gap-2`}
                                    >
                                        
                                        {/* Recipe Title and XP Reward Display */}
                                        <div className="flex flex-col flex-grow min-w-0 pr-4">
                                            <span className={`text-xl font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                                                {recipe.title}
                                            </span>
                                            
                                            {/* XP Reward (Moved from its own <span> to be grouped) */}
                                            <span className="text-sm text-yellow-400 font-mono mt-1 flex items-center">
                                                {/* Replaced generic span with an icon for XP */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.638-.921 1.938 0l2.077 6.398h6.766c.969 0 1.371 1.24.588 1.81l-5.462 3.963 2.078 6.397c.3.921-.755 1.688-1.542 1.144L10 17.066l-5.46 3.963c-.787.544-1.841-.223-1.542-1.144l2.077-6.397-5.462-3.963c-.783-.57-.38-1.81.588-1.81h6.766l2.077-6.398z" />
                                                </svg>
                                                <span className="font-bold">{recipe.xpReward} XP</span>
                                            </span>
                                        </div>

                                        {/* Completion Button Styling */}
                                        <div className="mt-2 sm:mt-0">
                                            <button
                                                onClick={() => navigate("/recipe")}
                                                disabled={isCompleted}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all duration-200 
                                                            ${isCompleted 
                                                                ? 'bg-green-800 text-green-400 disabled:opacity-70 cursor-not-allowed border border-green-700' 
                                                                : 'bg-green-600 text-white hover:bg-green-500 active:scale-95 border-b-4 border-green-800 hover:border-b-2'
                                                            }`}
                                            >
                                                {isCompleted ? "QUEST COMPLETE" : "ACCEPT QUEST"}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;

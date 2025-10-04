import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/UserContext'; // <-- Replaced with MOCK definition
import axios from 'axios'; // <-- Replaced with MOCK definition
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
    const { serverurl, completeRecipe, user } = useAppContext();
    const [recipes, setRecipes] = useState([]);
    const navigate=useNavigate()
    
    // XP & Badge Logic
    const badgeThresholds = [100, 500, 1000, 5000];
    const userXP = user?.xp || 0;
    
    const nextBadgeXP = useMemo(() => {
        return badgeThresholds.find(xp => xp > userXP) || badgeThresholds[badgeThresholds.length - 1];
    }, [userXP]);
    
    const progressPercent = useMemo(() => {
        return Math.min((userXP / nextBadgeXP) * 100, 100);
    }, [userXP, nextBadgeXP]);

    // Badge Unlock State Logic
    const [prevXP, setPrevXP] = useState(userXP);
    const [unlockedBadge, setUnlockedBadge] = useState(false);
    
    // NOTE: completedBadges state was unused in the original context, removed for cleanliness.

    // Effect for fetching recipes
    useEffect(() => {
        const getRecipes = async () => {
            try {
                // NOTE: axios is the MOCK definition here
                const res = await axios.get(`${serverurl}/api/recipe`);
                console.log(res.data);
                setRecipes(res.data);
            } catch (error) {
                 console.error("Error fetching quests:", error);
            }
        };
        getRecipes();
    }, [serverurl]);

    // Effect for handling badge unlock animation
    useEffect(() => {
        if (!user) return;
        
        // This logic is slightly improved to check if any new badge was crossed
        const unlocked = badgeThresholds.filter(
            (threshold) => prevXP < threshold && userXP >= threshold
        );
        
        if (unlocked.length > 0) {
            setUnlockedBadge(true);
            setTimeout(() => setUnlockedBadge(false), 3000);
        }
        
        // Only update prevXP if userXP is greater, to avoid resetting the animation prematurely
        if (userXP > prevXP) {
            setPrevXP(userXP);
        }
    }, [userXP, prevXP, badgeThresholds, user]);


    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-4 sm:p-8 font-mono">
            <div className="max-w-4xl mx-auto border-4 border-slate-700 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                
                {/* Badge Unlock Notification (Gamified Style) */}
                {unlockedBadge && (
                    <div className="fixed top-10 right-10 z-50 
                                    bg-gray-800 border-4 border-yellow-400 
                                    text-white font-extrabold text-2xl 
                                    px-8 py-4 rounded-xl shadow-2xl shadow-yellow-500/50
                                    transform scale-105 animate-pulse">
                        
                        <span className="text-4xl mr-3">👑</span> LEGENDARY BADGE ACQUIRED!
                        
                    </div>
                )}
                
                <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wide border-b border-gray-700 pb-2 mb-6">
                    QUEST LOG: RECIPES
                </h1>

                {/* ======================= XP SUMMARY & PROGRESS ======================= */}
                <div className="mb-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <h2 className="font-extrabold text-xl text-yellow-400 tracking-widest uppercase mb-2">
                        CURRENT XP: {userXP}
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
                    
                    {/* XP Goal Line */}
                    <p className="text-sm text-gray-400 mt-2">
                        {userXP} / {nextBadgeXP} required for next rank!
                    </p>

                    {/* Badge Display */}
                    <h3 className="text-xs font-semibold uppercase text-cyan-400 mt-4 mb-2 tracking-wider">
                        UNLOCKED ACHIEVEMENTS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(user?.badges)
                            ? user.badges.map((badge, i) => (
                                <span
                                    key={i}
                                    className="bg-cyan-700 text-white 
                                               px-3 py-1 rounded-md text-xs font-bold 
                                               border border-cyan-400 shadow-md"
                                >
                                    <span className="mr-1">★</span> {badge}
                                </span>
                            ))
                            : <span className="text-gray-500 text-xs">No achievements yet.</span>
                        }
                    </div>
                </div>

                {/* ======================= RECIPE QUEST LIST ======================= */}
                <div className="space-y-4">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => {
                            const isCompleted = user?.completedRecipes?.includes(recipe._id);
                            
                            return (
                                <div 
                                    key={recipe._id} 
                                    // Gamified Quest Card Styling
                                    className={`p-4 rounded-xl transition-all duration-300
                                                ${isCompleted 
                                                    ? 'bg-gray-800 opacity-60 border-l-4 border-green-500' 
                                                    : 'bg-slate-800 border-l-4 border-yellow-500 hover:bg-slate-700 shadow-xl'
                                                } 
                                                flex justify-between items-center flex-wrap gap-2`}
                                >
                                    
                                    {/* Recipe Title and XP Reward */}
                                    <div className="flex flex-col flex-grow min-w-0 pr-4">
                                        <span className={`text-xl font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                                            {recipe.title}
                                        </span>
                                        
                                        <span className="text-sm text-yellow-400 font-mono mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.638-.921 1.938 0l2.077 6.398h6.766c.969 0 1.371 1.24.588 1.81l-5.462 3.963 2.078 6.397c.3.921-.755 1.688-1.542 1.144L10 17.066l-5.46-3.963c-.787.544-1.841-.223-1.542-1.144l2.077-6.397-5.462-3.963c-.783-.57-.38-1.81.588-1.81h6.766l2.077-6.398z" />
                                            </svg>
                                            <span className="font-bold">{recipe.xpReward} XP REWARD</span>
                                        </span>
                                    </div>

                                    {/* Completion Button */}
                                    <div className="mt-2 sm:mt-0">
                                        <button
                                            onClick={() => navigate(`${recipe._id}`)}
                                            disabled={isCompleted}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all duration-200 
                                                        ${isCompleted 
                                                            ? 'bg-gray-700 text-green-400 disabled:opacity-70 cursor-not-allowed border border-gray-600' 
                                                            : 'bg-green-600 text-white hover:bg-green-500 active:scale-95 border-b-4 border-green-800 hover:border-b-2'
                                                        }`}
                                        >
                                            {isCompleted ? "QUEST COMPLETE" : "ACCEPT QUEST"}
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-center text-gray-500 p-8 border border-gray-700 rounded-lg">
                            Loading available quests...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecipeList;

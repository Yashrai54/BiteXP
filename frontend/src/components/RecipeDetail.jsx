import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // <-- Replaced with MOCK definition
import { useAppContext } from '../context/UserContext'; // <-- Replaced with MOCK definition
import axios from 'axios'; // <-- Replaced with MOCK definition

const RecipeDetail = () => {
    const { id } = useParams();
    const { serverurl, completeRecipe, user } = useAppContext();
    const [recipe, setRecipe] = useState({});
    const [checkbox, setCheckbox] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);


    const fetchRecipe = async (recipeId) => {
        try {
            // NOTE: axios is the MOCK definition here
            const res = await axios.get(`${serverurl}/api/recipe/${recipeId}`);
            setRecipe(res.data);
            // Check completion status from user context (if available)
            // MOCK adjustment: We rely on a hypothetical user object here
            const mockUserIsCompleted = MOCK_USER.completedRecipes.includes(recipeId);
            setIsCompleted(mockUserIsCompleted);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) fetchRecipe(id);
    }, [id, serverurl]);


    // Function to handle completion logic
    const handleCompleteQuest = () => {
        if (checkbox) {
            // Call the context function to complete the recipe
            completeRecipe(id);
            // In a real app, the server response would update the user context,
            // which would then set isCompleted via a dependency.
            setIsCompleted(true); // MOCK update for visual feedback
        }
    }
    
    // Custom checkbox toggle handler
    const handleCheckboxToggle = () => {
        setCheckbox(prev => !prev);
    }

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-4 sm:p-8 font-mono">
            <div className="max-w-3xl mx-auto border-4 border-cyan-700 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.2)] bg-gray-900">
                
                {/* Title and XP */}
                <header className="border-b border-gray-700 pb-4 mb-6">
                    <p className="text-xl text-cyan-400 uppercase tracking-widest mb-1">
                        MISSION BRIEFING: {id}
                    </p>
                    <h1 className="text-5xl font-extrabold text-white mb-2">
                        {recipe.title || "Loading Quest Data..."}
                    </h1>
                    {recipe.xpReward && (
                        <span className="text-xl font-bold text-yellow-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.638-.921 1.938 0l2.077 6.398h6.766c.969 0 1.371 1.24.588 1.81l-5.462 3.963 2.078 6.397c.3.921-.755 1.688-1.542 1.144L10 17.066l-5.46-3.963c-.787.544-1.841-.223-1.542-1.144l2.077-6.397-5.462-3.963c-.783-.57-.38-1.81.588-1.81h6.766l2.077-6.398z" />
                            </svg>
                            REWARD: {recipe.xpReward} XP
                        </span>
                    )}
                </header>

                {/* ======================= INGREDIENTS/COMPONENTS ======================= */}
                <section className="mb-8">
                    <h3 className="text-2xl font-bold text-cyan-400 border-l-4 border-cyan-400 pl-3 mb-4 uppercase tracking-wider">
                        Required Components
                    </h3>
                    <ul className="space-y-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                        {recipe.ingredients?.map((ing, idx) => (
                            <li key={idx} className="flex items-center text-lg text-gray-200 before:content-['>'] before:text-yellow-400 before:mr-3">
                                {ing}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ======================= STEPS/PROCEDURE ======================= */}
                <section className="mb-8">
                    <h3 className="text-2xl font-bold text-cyan-400 border-l-4 border-cyan-400 pl-3 mb-4 uppercase tracking-wider">
                        Execution Procedure
                    </h3>
                    <ol className="space-y-4">
                        {recipe.steps?.map((step, idx) => (
                            <li key={idx} className="flex text-lg text-gray-300">
                                <span className="font-extrabold text-yellow-400 text-xl mr-3">{idx + 1}.</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* ======================= COMPLETION CHECK & BUTTON ======================= */}
                <div className="pt-6 border-t border-gray-700">
                    <div className={`p-4 rounded-lg mb-4 transition-all duration-300 
                                     ${isCompleted 
                                        ? 'bg-green-900 border-2 border-green-500 text-green-300' 
                                        : 'bg-yellow-900/20 border-2 border-yellow-500/50 text-yellow-200'
                                    }`}>
                        {isCompleted ? (
                            <p className="font-extrabold text-xl text-center flex items-center justify-center">
                                <span className="text-3xl mr-3">✅</span> MISSION STATUS: COMPLETE
                            </p>
                        ) : (
                            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleCheckboxToggle}>
                                {/* Custom Checkbox */}
                                <div className={`w-6 h-6 rounded border-2 transition-colors duration-200
                                                ${checkbox ? 'bg-cyan-500 border-cyan-500' : 'bg-gray-700 border-cyan-400'}`}>
                                    {checkbox && (
                                        <svg className="w-full h-full text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    )}
                                </div>
                                <label className="text-lg font-semibold select-none">
                                    I confirm protocol execution is complete (Mark as Done)
                                </label>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleCompleteQuest} 
                        disabled={!checkbox || isCompleted}
                        className={`w-full py-4 rounded-lg text-xl font-bold uppercase tracking-wider 
                                    shadow-xl transition-all duration-200 
                                    ${(!checkbox || isCompleted)
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-b-2 border-gray-600' 
                                        : 'bg-gradient-to-r from-green-500 to-lime-600 text-white hover:from-green-400 hover:to-lime-500 active:scale-[0.98] border-b-4 border-green-800'
                                    }`}
                    >
                        {isCompleted ? "MISSION ACHIEVED" : "SUBMIT COMPLETION REPORT"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;

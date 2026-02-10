
import React, { useState, useCallback } from 'react';
import { fetchVegetableData, fetchVegetableImage } from './services/geminiService';
import { VegetableState } from './types';
import NutritionCharts from './components/NutritionCharts';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState<VegetableState>({
    data: null,
    imageUrl: null,
    loading: false,
    error: null,
  });

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch both simultaneously
      const [data, imageUrl] = await Promise.all([
        fetchVegetableData(searchTerm),
        fetchVegetableImage(searchTerm)
      ]);
      
      setState({
        data,
        imageUrl,
        loading: false,
        error: null
      });
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Oops! We couldn't find that vegetable. Please try another name."
      }));
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-leaf"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">VeggieVital</h1>
          </div>
          <div className="hidden md:block text-sm text-slate-500 font-medium">
            AI-Powered Nutrition Explorer
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-emerald-50 border-b border-emerald-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
            Discover the power of nature's bounty.
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Enter the name of any vegetable to explore its complete nutritional profile, health benefits, and cooking tips.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter vegetable (e.g., Spinach, Kale, Broccoli)"
              className="w-full px-6 py-4 rounded-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-lg shadow-sm transition-all"
            />
            <button
              type="submit"
              disabled={state.loading}
              className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full font-semibold transition-colors disabled:opacity-50"
            >
              {state.loading ? <i className="fas fa-spinner fa-spin"></i> : 'Explore'}
            </button>
          </form>
          {state.error && <p className="mt-4 text-red-500 font-medium">{state.error}</p>}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        {!state.data && !state.loading && (
          <div className="text-center py-20 animate-fade-in">
             <div className="text-slate-300 text-6xl mb-6">
               <i className="fas fa-carrot"></i>
             </div>
             <p className="text-slate-500 text-lg">Search for a vegetable to see its details</p>
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium animate-pulse">Analyzing nutrient data & generating visual profile...</p>
          </div>
        )}

        {state.data && !state.loading && (
          <div className="animate-fade-in space-y-12">
            {/* Top Section: Overview & Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src={state.imageUrl || 'https://picsum.photos/800/800'}
                    alt={state.data.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-4xl font-serif text-slate-900 mb-1">{state.data.name}</h2>
                  <p className="text-emerald-600 font-medium italic mb-4">{state.data.scientificName}</p>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {state.data.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Calories</span>
                    <span className="text-2xl font-bold text-slate-800">{state.data.calories}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Protein</span>
                    <span className="text-2xl font-bold text-slate-800">{state.data.macros.protein}g</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Carbs</span>
                    <span className="text-2xl font-bold text-slate-800">{state.data.macros.carbohydrates}g</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Fiber</span>
                    <span className="text-2xl font-bold text-slate-800">{state.data.macros.fiber}g</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl w-fit">
                  <i className="far fa-calendar-alt text-emerald-500"></i>
                  <span className="text-sm">Best Seasonality: <span className="font-semibold text-slate-700">{state.data.seasonality}</span></span>
                </div>
              </div>
            </div>

            {/* Middle Section: Visualizations */}
            <NutritionCharts data={state.data} />

            {/* Bottom Section: Insights & Minerals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <i className="fas fa-heartbeat"></i>
                  <h3 className="text-lg font-bold">Health Benefits</h3>
                </div>
                <ul className="space-y-3">
                  {state.data.healthBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                  <i className="fas fa-utensils"></i>
                  <h3 className="text-lg font-bold">Cooking Tips</h3>
                </div>
                <ul className="space-y-3">
                  {state.data.cookingTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <i className="fas fa-lightbulb text-blue-400 mt-1"></i>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-amber-600">
                  <i className="fas fa-flask"></i>
                  <h3 className="text-lg font-bold">Key Minerals</h3>
                </div>
                <div className="space-y-4">
                  {state.data.minerals.map((mineral, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{mineral.name}</span>
                        <span className="text-slate-400">{mineral.amount}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full"
                          style={{ width: `${Math.min(mineral.percentageDV, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="w-6 h-6 bg-slate-500 rounded flex items-center justify-center text-white">
              <i className="fas fa-leaf text-xs"></i>
            </div>
            <span className="font-bold text-slate-700">VeggieVital</span>
          </div>
          <p className="text-slate-400 text-sm">
            Powered by Gemini AI • Always consult a nutritionist for professional advice.
          </p>
          <div className="flex gap-4 text-slate-400">
            <i className="fab fa-instagram hover:text-emerald-500 cursor-pointer"></i>
            <i className="fab fa-twitter hover:text-emerald-500 cursor-pointer"></i>
            <i className="fab fa-github hover:text-emerald-500 cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

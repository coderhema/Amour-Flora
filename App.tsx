
import React, { useState, useEffect } from 'react';
import { AppTab, LetterOccasion, LetterTone, FlowerStyle, LetterRequest, FlowerRequest, LetterCategory, FlowerOption, ColorOption } from './types';
import { generateLetter, generateFlower } from './services/geminiService';
import { LETTER_TEMPLATES } from './data/templates';
import { Button } from './components/Button';
import { TextInput, TextArea, Select } from './components/Input';
import { LetterView } from './components/LetterView';
import { FlowerView } from './components/FlowerView';
import { BackgroundPatterns } from './components/BackgroundPatterns';

const FLOWER_OPTIONS: FlowerOption[] = [
  { id: 'roses', name: 'Roses', icon: '🌹' },
  { id: 'tulips', name: 'Tulips', icon: '🌷' },
  { id: 'lilies', name: 'Lilies', icon: '💮' },
  { id: 'sunflowers', name: 'Sunflowers', icon: '🌻' },
  { id: 'peonies', name: 'Peonies', icon: '🌸' },
  { id: 'lavender', name: 'Lavender', icon: '🌿' },
  { id: 'orchids', name: 'Orchids', icon: '🪴' },
  { id: 'wildflowers', name: 'Wildflowers', icon: '💐' },
];

const COLOR_OPTIONS: ColorOption[] = [
  { id: 'ruby', name: 'Ruby Red', class: 'bg-red-600' },
  { id: 'blush', name: 'Blush Pink', class: 'bg-rose-300' },
  { id: 'sunset', name: 'Sunset Orange', class: 'bg-orange-400' },
  { id: 'sky', name: 'Sky Blue', class: 'bg-sky-400' },
  { id: 'lavender', name: 'Soft Purple', class: 'bg-purple-300' },
  { id: 'cream', name: 'Cream White', class: 'bg-stone-100 border border-stone-200' },
  { id: 'berry', name: 'Berry Mix', class: 'bg-gradient-to-br from-pink-500 to-purple-700', isGradient: true },
  { id: 'meadow', name: 'Spring Meadow', class: 'bg-gradient-to-br from-emerald-400 to-yellow-300', isGradient: true },
  { id: 'twilight', name: 'Twilight', class: 'bg-gradient-to-br from-indigo-900 to-pink-500', isGradient: true },
  { id: 'golden', name: 'Golden Hour', class: 'bg-gradient-to-br from-yellow-500 to-red-500', isGradient: true },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LETTERS);
  const [loading, setLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // States
  const [draftContent, setDraftContent] = useState<string>('');
  const [generatedFlower, setGeneratedFlower] = useState<string | null>(null);

  // AI Form States
  const [showAIForm, setShowAIForm] = useState(false);
  const [letterForm, setLetterForm] = useState<LetterRequest>({
    recipient: '',
    occasion: LetterOccasion.LOVE,
    tone: LetterTone.ROMANTIC,
    details: ''
  });

  const [flowerForm, setFlowerForm] = useState<FlowerRequest>({
    flowerType: 'Roses',
    colorPalette: 'Ruby Red',
    style: FlowerStyle.OIL_PAINTING
  });

  // Check URL for shared note
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const note = params.get('note');
    if (note) {
      try {
        setDraftContent(decodeURIComponent(note));
        setIsPreviewMode(true);
      } catch (e) {
        console.error("Failed to parse note from URL");
      }
    }
  }, []);

  // Template Filtering
  const [selectedCategory, setSelectedCategory] = useState<LetterCategory>(LetterCategory.PERSONAL);
  const filteredTemplates = LETTER_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (content: string) => {
    setDraftContent(content);
    setIsPreviewMode(false);
  };

  const handleReset = () => {
    setIsPreviewMode(false);
    setDraftContent('');
    setActiveTab(AppTab.LETTERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({}, document.title, window.location.pathname);
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterForm.recipient || !letterForm.details) return;
    
    setLoading(true);
    try {
      const result = await generateLetter(letterForm);
      setDraftContent(result);
      setShowAIForm(false);
    } catch (error) {
      alert("Failed to generate letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowerForm.flowerType) return;

    setLoading(true);
    setGeneratedFlower(null);
    try {
      const result = await generateFlower(flowerForm);
      setGeneratedFlower(result);
    } catch (error) {
      alert("Failed to generate flower. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 selection:bg-rose-200 selection:text-rose-900 pb-20 font-sans relative">
      <BackgroundPatterns />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🌹</span>
            <h1 className="font-serif text-2xl font-semibold text-stone-800 tracking-tight">
              Amour <span className="text-rose-500">&</span> Flora
            </h1>
          </div>
          {/* GitHub link removed per user request */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Tab Navigation */}
        {!isPreviewMode && (
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-stone-200 flex gap-1">
              <button
                onClick={() => setActiveTab(AppTab.LETTERS)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === AppTab.LETTERS 
                    ? 'bg-rose-50 text-rose-700 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                Letter Writer
              </button>
              <button
                onClick={() => setActiveTab(AppTab.FLOWERS)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === AppTab.FLOWERS 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                Flower Garden
              </button>
            </div>
          </div>
        )}

        {/* Letter Writer Section */}
        {activeTab === AppTab.LETTERS && (
          <div className="transition-opacity duration-300">
            {isPreviewMode ? (
              <LetterView 
                content={draftContent} 
                onEdit={() => {
                  setIsPreviewMode(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onReset={handleReset}
              />
            ) : (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-4xl text-stone-800 mb-4">Craft Your Sentiment</h2>
                  <p className="text-stone-500">Choose a template, write from the heart, or let AI guide you.</p>
                </div>

                {/* Template Selector */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-stone-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-2">
                    {Object.values(LetterCategory).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === cat 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.content)}
                        className="text-left p-3 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50 transition-all text-xs md:text-sm bg-white/50"
                      >
                        <span className="font-medium text-stone-700 block mb-1">{template.title}</span>
                        <span className="text-stone-400 text-[10px] line-clamp-2">{template.content}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Editor */}
                <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100">
                  <textarea 
                    className="w-full min-h-[300px] p-6 rounded-xl outline-none resize-y text-lg leading-relaxed text-stone-700 placeholder:text-stone-300 font-serif bg-transparent"
                    placeholder="Your letter will appear here. Start writing or select a template..."
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                  />
                  <div className="bg-stone-50/50 px-4 py-3 rounded-b-xl flex justify-between items-center border-t border-stone-100">
                    <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                      {draftContent.length} characters
                    </span>
                    <Button 
                      onClick={() => {
                        setIsPreviewMode(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      disabled={!draftContent.trim()}
                    >
                      Preview & Sign
                    </Button>
                  </div>
                </div>

                {/* AI Assistant Toggle */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
                  <button 
                    onClick={() => setShowAIForm(!showAIForm)}
                    className="w-full flex items-center justify-between p-4 bg-stone-50/50 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-stone-700 font-medium">
                      <span className="text-xl">✨</span>
                      <span>Need help writing? Use AI Assistant</span>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-stone-400 transition-transform ${showAIForm ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showAIForm && (
                    <div className="p-6 border-t border-stone-100 bg-white/50 animate-fade-in">
                      <form onSubmit={handleAIGenerate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <TextInput 
                            label="Recipient Name" 
                            placeholder="e.g. My Beloved"
                            value={letterForm.recipient}
                            onChange={(e) => setLetterForm({...letterForm, recipient: e.target.value})}
                          />
                          <Select 
                            label="Occasion"
                            value={letterForm.occasion}
                            onChange={(e) => setLetterForm({...letterForm, occasion: e.target.value as LetterOccasion})}
                            options={Object.values(LetterOccasion).map(v => ({ label: v, value: v }))}
                          />
                        </div>
                        <Select 
                          label="Tone of Voice"
                          value={letterForm.tone}
                          onChange={(e) => setLetterForm({...letterForm, tone: e.target.value as LetterTone})}
                          options={Object.values(LetterTone).map(v => ({ label: v, value: v }))}
                        />
                        <TextArea 
                          label="Key Memories or Details"
                          placeholder="What specific things should the letter mention?"
                          value={letterForm.details}
                          onChange={(e) => setLetterForm({...letterForm, details: e.target.value})}
                        />
                        <Button type="submit" className="w-full" isLoading={loading} variant="secondary">
                          Generate Draft
                        </Button>
                      </form>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* Visual Flower Generator */}
        {activeTab === AppTab.FLOWERS && (
          <div className="transition-opacity duration-300">
             {!generatedFlower ? (
               <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-4xl text-stone-800 mb-4">Digital Florist</h2>
                  <p className="text-stone-500">Cultivate a unique bloom to accompany your words.</p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 space-y-10">
                  
                  {/* Visual Flower Selector */}
                  <div>
                    <label className="text-sm font-semibold text-stone-600 mb-4 block uppercase tracking-wider ml-1">
                      Pick a Variety
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {FLOWER_OPTIONS.map((flower) => (
                        <button
                          key={flower.id}
                          type="button"
                          onClick={() => setFlowerForm({ ...flowerForm, flowerType: flower.name })}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                            flowerForm.flowerType === flower.name
                              ? 'bg-emerald-50 border-emerald-300 shadow-md shadow-emerald-100'
                              : 'bg-white/50 border-stone-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                          }`}
                        >
                          <span className="text-3xl mb-2">{flower.icon}</span>
                          <span className={`text-sm font-medium ${flowerForm.flowerType === flower.name ? 'text-emerald-700' : 'text-stone-600'}`}>
                            {flower.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Pills & Mixes */}
                  <div>
                    <label className="text-sm font-semibold text-stone-600 mb-4 block uppercase tracking-wider ml-1">
                      Choose a Palette
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setFlowerForm({ ...flowerForm, colorPalette: color.name })}
                          className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                            flowerForm.colorPalette === color.name
                              ? 'border-stone-800 bg-stone-900 text-white shadow-lg'
                              : 'border-stone-200 bg-white/50 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                          <span className="text-sm font-medium">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Artistic Style & Submission */}
                  <div className="pt-6 border-t border-stone-100 space-y-6">
                    <Select 
                      label="Artistic Style"
                      value={flowerForm.style}
                      onChange={(e) => setFlowerForm({...flowerForm, style: e.target.value as FlowerStyle})}
                      options={Object.values(FlowerStyle).map(v => ({ label: v, value: v }))}
                    />
                    <Button 
                      onClick={handleFlowerSubmit} 
                      className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" 
                      isLoading={loading}
                    >
                      Bloom My Flower
                    </Button>
                  </div>
                </div>
               </div>
             ) : (
               <FlowerView 
                 imageUrl={generatedFlower} 
                 onReset={() => setGeneratedFlower(null)} 
               />
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

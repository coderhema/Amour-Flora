
import React, { useState, useEffect } from 'react';
import { AppTab, LetterOccasion, LetterTone, FlowerStyle, LetterRequest, FlowerRequest, LetterCategory, FlowerOption, ColorOption, FullDesign } from './types';
import { generateLetter, generateFlower } from './services/geminiService';
import { LETTER_TEMPLATES } from './data/templates';
import { DESIGNS } from './data/designs';
import { auth, db, googleProvider, signInWithPopup, onAuthStateChanged, collection, addDoc, doc, getDoc, serverTimestamp, handleFirestoreError, OperationType } from './firebase';
import { Button } from './components/Button';
import { TextInput, TextArea, Select } from './components/Input';
import { LetterView } from './components/LetterView';
import { FlowerView } from './components/FlowerView';
import { DesignSelector } from './components/DesignSelector';
import { DesignCustomizer } from './components/DesignCustomizer';
import { ShareModal } from './components/ShareModal';
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
  const [viewState, setViewState] = useState<'draft' | 'design' | 'customise' | 'final'>('draft');
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // States
  const [draftContent, setDraftContent] = useState<string>('');
  const [generatedFlower, setGeneratedFlower] = useState<string | null>(null);
  const [letterDesign, setLetterDesign] = useState<FullDesign>(DESIGNS[0]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // AI Form States
  const [showAIForm, setShowAIForm] = useState(false);
  const [letterForm, setLetterForm] = useState<LetterRequest>({
    recipient: '',
    relationship: '',
    occasion: LetterOccasion.LOVE,
    tone: LetterTone.ROMANTIC,
    details: '',
    memories: ''
  });

  const [flowerForm, setFlowerForm] = useState<FlowerRequest>({
    flowerType: 'Roses',
    colorPalette: 'Ruby Red',
    style: FlowerStyle.OIL_PAINTING
  });

  // Check URL for shared note
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });

    const params = new URLSearchParams(window.location.search);
    const letterId = params.get('id');
    const note = params.get('note');
    const designId = params.get('design');
    const flower = params.get('flower');
    const recipient = params.get('to');

    const loadLetter = async () => {
      if (letterId) {
        setLoading(true);
        try {
          const letterDoc = await getDoc(doc(db, 'letters', letterId));
          if (letterDoc.exists()) {
            const data = letterDoc.data();
            setDraftContent(data.content);
            setLetterDesign(data.design);
            setGeneratedFlower(data.flower);
            setLetterForm(prev => ({ ...prev, recipient: data.recipient || '' }));
            setViewState('final');
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `letters/${letterId}`);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (note) {
        try {
          const decodedNote = note.startsWith('b64:') 
            ? atob(note.substring(4)) 
            : decodeURIComponent(note);
          setDraftContent(decodedNote);
          
          if (designId) {
            if (designId.startsWith('custom:')) {
              try {
                const customDesign = JSON.parse(atob(designId.substring(7)));
                setLetterDesign(customDesign);
              } catch (e) { console.error("Failed to parse custom design", e); }
            } else {
              const design = DESIGNS.find(d => d.id === designId);
              if (design) setLetterDesign(design);
            }
          }
          
          if (flower) {
            setGeneratedFlower(decodeURIComponent(flower));
          }
          
          if (recipient) {
            setLetterForm(prev => ({ ...prev, recipient: decodeURIComponent(recipient) }));
          }

          setViewState('final');
        } catch (e) {
          console.error("Failed to parse note from URL", e);
        }
      }
    };

    loadLetter();
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleShare = async () => {
    if (!user) {
      handleLogin();
      return;
    }

    setLoading(true);
    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'letters'), {
        content: draftContent,
        design: letterDesign,
        flower: generatedFlower,
        recipient: letterForm.recipient,
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      const baseUrl = window.location.origin + window.location.pathname;
      const url = `${baseUrl}?id=${docRef.id}`;
      setShareUrl(url);
      
      // Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        // alert("Imperial link copied to clipboard! You can now send this to your recipient.");
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'letters');
    } finally {
      setLoading(false);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<LetterCategory>(LetterCategory.PERSONAL);
  const filteredTemplates = LETTER_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (content: string) => {
    setDraftContent(content);
    setViewState('draft');
  };

  const handleReset = () => {
    setViewState('draft');
    setDraftContent('');
    setActiveTab(AppTab.LETTERS);
    setGeneratedFlower(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({}, document.title, window.location.pathname);
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterForm.recipient) return;
    
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
      
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🌹</span>
            <h1 className="font-serif text-2xl font-semibold text-stone-800 tracking-tight">
              Amour <span className="text-rose-500">&</span> Flora
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 relative z-10">
        
        {shareUrl && (
          <ShareModal 
            url={shareUrl} 
            onClose={() => setShareUrl(null)} 
          />
        )}

        {viewState === 'draft' && (
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

        {activeTab === AppTab.LETTERS && (
          <div className="transition-opacity duration-300">
            {viewState === 'final' ? (
              <LetterView 
                content={draftContent} 
                design={letterDesign}
                stampImage={generatedFlower}
                recipientName={letterForm.recipient}
                onEdit={() => setViewState('design')} 
                onReset={handleReset}
                onShare={handleShare}
              />
            ) : viewState === 'design' ? (
              <DesignSelector 
                selectedDesign={letterDesign}
                onSelect={setLetterDesign}
                onConfirm={() => setViewState('final')}
                onBack={() => setViewState('draft')}
                onCustomise={() => setViewState('customise')}
              />
            ) : viewState === 'customise' ? (
              <DesignCustomizer 
                design={letterDesign}
                onChange={setLetterDesign}
                onConfirm={() => setViewState('final')}
                onBack={() => setViewState('design')}
              />
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-4xl text-stone-800 mb-4 tracking-tight">Craft Your Sentiment</h2>
                  <p className="text-stone-500 italic">Choose a template, write from the heart, or let AI guide you.</p>
                </div>

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

                <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-stone-100">
                  <textarea 
                    className="w-full min-h-[350px] p-8 rounded-xl outline-none resize-y text-xl leading-relaxed text-stone-700 placeholder:text-stone-300 font-serif bg-transparent"
                    placeholder="Your letter will appear here. Start writing or select a template..."
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                  />
                  <div className="bg-stone-50/50 px-6 py-4 rounded-b-xl flex justify-between items-center border-t border-stone-100">
                    <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">
                      {draftContent.length} characters
                    </span>
                    <Button 
                      onClick={() => {
                        setViewState('design');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      disabled={!draftContent.trim()}
                      className="px-10"
                    >
                      Choose Design
                    </Button>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
                  <button 
                    onClick={() => setShowAIForm(!showAIForm)}
                    className="w-full flex items-center justify-between p-5 bg-stone-50/50 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-stone-700 font-medium">
                      <span className="text-2xl">✨</span>
                      <span>Need help writing? Use AI Assistant</span>
                    </div>
                    <svg className={`w-5 h-5 text-stone-400 transition-transform ${showAIForm ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showAIForm && (
                    <div className="p-8 border-t border-stone-100 bg-white/50 animate-fade-in">
                      <form onSubmit={handleAIGenerate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <TextInput 
                            label="Recipient Name" 
                            placeholder="e.g. My Beloved"
                            value={letterForm.recipient}
                            onChange={(e) => setLetterForm({...letterForm, recipient: e.target.value})}
                          />
                          <TextInput 
                            label="Relationship" 
                            placeholder="e.g. Partner, Mother, Best Friend"
                            value={letterForm.relationship}
                            onChange={(e) => setLetterForm({...letterForm, relationship: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Select 
                            label="Occasion"
                            value={letterForm.occasion}
                            onChange={(e) => setLetterForm({...letterForm, occasion: e.target.value as LetterOccasion})}
                            options={Object.values(LetterOccasion).map(v => ({ label: v, value: v }))}
                          />
                          <Select 
                            label="Tone of Voice"
                            value={letterForm.tone}
                            onChange={(e) => setLetterForm({...letterForm, tone: e.target.value as LetterTone})}
                            options={Object.values(LetterTone).map(v => ({ label: v, value: v }))}
                          />
                        </div>
                        <TextArea 
                          label="Shared Memories or Characteristics"
                          placeholder="What specific things should the letter mention? (e.g. that trip to Paris, their laugh, how they always make tea...)"
                          value={letterForm.memories}
                          onChange={(e) => setLetterForm({...letterForm, memories: e.target.value})}
                        />
                        <TextArea 
                          label="Additional Details (Optional)"
                          placeholder="Any other specific requests for the letter?"
                          value={letterForm.details}
                          onChange={(e) => setLetterForm({...letterForm, details: e.target.value})}
                        />
                        <Button type="submit" className="w-full h-14" isLoading={loading} variant="secondary">
                          Generate Imperial Draft
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === AppTab.FLOWERS && (
          <div className="transition-opacity duration-300">
             {!generatedFlower ? (
               <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-4xl text-stone-800 mb-4 tracking-tight">Digital Florist</h2>
                  <p className="text-stone-500 italic">Cultivate a unique bloom to serve as your imperial stamp.</p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-stone-100 space-y-12">
                  <div>
                    <label className="text-xs font-bold text-stone-400 mb-6 block uppercase tracking-[0.3em] ml-1">Pick a Variety</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {FLOWER_OPTIONS.map((flower) => (
                        <button
                          key={flower.id}
                          type="button"
                          onClick={() => setFlowerForm({ ...flowerForm, flowerType: flower.name })}
                          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                            flowerForm.flowerType === flower.name ? 'bg-emerald-50 border-emerald-300 scale-105 shadow-lg' : 'bg-white/50 border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30'
                          }`}
                        >
                          <span className="text-4xl mb-3">{flower.icon}</span>
                          <span className={`text-sm font-bold tracking-wide ${flowerForm.flowerType === flower.name ? 'text-emerald-700' : 'text-stone-500'}`}>{flower.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-400 mb-6 block uppercase tracking-[0.3em] ml-1">Imperial Palette</label>
                    <div className="flex flex-wrap gap-4">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setFlowerForm({ ...flowerForm, colorPalette: color.name })}
                          className={`group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                            flowerForm.colorPalette === color.name ? 'border-stone-800 bg-stone-900 text-white shadow-xl scale-105' : 'border-stone-100 bg-white/50 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                          <span className="text-sm font-bold tracking-wide">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-stone-100 space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-stone-400 block uppercase tracking-[0.3em] ml-1">Or Use a Custom Photo Link</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Paste a Google Photos or image link here..."
                          className="flex-grow px-6 py-4 rounded-xl border-2 border-stone-100 focus:border-emerald-300 outline-none transition-all text-stone-700 bg-white/50"
                          onChange={(e) => {
                            if (e.target.value.trim()) {
                              setGeneratedFlower(e.target.value.trim());
                            }
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 italic ml-1">Note: Ensure the link is a direct image URL for best results.</p>
                    </div>

                    <Select 
                      label="Artistic Rendition Style"
                      value={flowerForm.style}
                      onChange={(e) => setFlowerForm({...flowerForm, style: e.target.value as FlowerStyle})}
                      options={Object.values(FlowerStyle).map(v => ({ label: v, value: v }))}
                    />
                    <Button onClick={handleFlowerSubmit} className="w-full h-16 text-xl bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-200" isLoading={loading}>
                      Bloom Imperial Flower
                    </Button>
                  </div>
                </div>
               </div>
             ) : (
               <div className="max-w-xl mx-auto space-y-8">
                 <FlowerView 
                  imageUrl={generatedFlower} 
                  onReset={() => setGeneratedFlower(null)} 
                  onAddToLetter={() => {
                    setActiveTab(AppTab.LETTERS);
                    if (draftContent.trim()) {
                      setViewState('final');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                 <div className="text-center bg-stone-900/5 p-4 rounded-2xl italic text-stone-500 text-sm">
                   This flower will now be used as the postage stamp on your letters.
                 </div>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

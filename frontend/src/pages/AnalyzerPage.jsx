import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { analyzeText, reset as resetAnalyzer } from '../features/analyzer/analyzerSlice';
import { createWord } from '../features/vocabulary/vocabularySlice';
import dictionaryService from '../services/dictionaryService';
import { BookCheck, Glasses } from 'lucide-react';
import WordToken from '../components/WordToken';
import WordInfoPopup from '../components/WordInfoPopup';

const AnalyzerPage = () => {
  const dispatch = useDispatch();
  const popupRef = useRef(null);

  // --- GLOBAL STATE FROM REDUX ---
  const { token } = useSelector((state) => state.auth);
  const { tokens, isLoading: isAnalyzing, isError: isAnalyzerError, message: analyzerMessage } = useSelector((state) => state.analyzer);
  
  // State to check for creation errors
  const { 
    isSuccess: isVocabSuccess, 
    isError: isVocabError, 
    message: vocabMessage 
  } = useSelector((state) => state.vocabulary);

  // --- LOCAL STATE FOR THIS COMPONENT ---
  const [text, setText] = useState('');
  const [showPOS, setShowPOS] = useState(false);
  // State for the popup
  const [selectedWord, setSelectedWord] = useState(null); // The word data for the popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isDetailsLoading, setIsDetailsLoading] = useState(false); // Loading state for the dictionary lookup

  // Effect to handle closing the popup on an outside click.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedWord(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Cleanup effect to reset the analyzer state when leaving the page.
  useEffect(() => {
    return () => { dispatch(resetAnalyzer()); };
  }, [dispatch]);
  
  //This effect watches for the result of CreateWord action
  useEffect(() => {
    if (isVocabSuccess) {
      setSelectedWord(null); // Close the popup on success.
    }
  }, [isVocabSuccess]);

  // --- EVENT HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedWord(null); // Close any open popup
    dispatch(analyzeText({ text }));
  };

  // This is the main function for our interactive feature.
  const handleWordClick = async (wordObject, event) => {
    // Set the popup to a loading state and calculate its position.
    setIsDetailsLoading(true);
    
    // Store current scroll position to prevent scrolling
    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;
    
    const rect = event.target.getBoundingClientRect();
    const containerRect = event.target.closest('.relative').getBoundingClientRect();
    
    // Calculate position relative to the container, not the entire document
    setPopupPosition({ 
      top: rect.bottom - containerRect.top + 5, // 5px gap below the word
      left: rect.left - containerRect.left 
    });
    
    // Set a temporary word object to show the popup during loading
    setSelectedWord({ term: wordObject.term, definition: '', reading: '' });
    
    // Restore scroll position if it changed
    if (window.scrollY !== currentScrollY || window.scrollX !== currentScrollX) {
      window.scrollTo(currentScrollX, currentScrollY);
    }
    
    try {
      // Make the API call to our dictionary service.
      const wordDetails = await dictionaryService.lookupWord(wordObject.term, token);
      setSelectedWord(wordDetails); // Store the full details
    } catch (error) {
      console.error("Failed to lookup word", error);
      // We could show an error in the popup here.
      setSelectedWord({ term: wordObject.term, definition: 'Could not find definition.' });
    } finally {
      setIsDetailsLoading(false); // Turn off loading state
    }
  };

  // This function is passed to the popup to handle adding a word.
  const handleAddWord = () => {
    if (selectedWord) {
      dispatch(createWord({
        term: selectedWord.term,
        reading: selectedWord.reading_hiragana || selectedWord.reading,
        definition: selectedWord.definition,
      }));
    }
  };

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Text Analyzer</h1>
        <p className="text-muted-foreground mt-2">Paste any Japanese text to create an interactive reading lesson.</p>
      </section>
      <section className="mb-12">
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your Japanese text here..."
            required
            className="w-full h-48 p-4 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none resize-none"
          />
          <button 
            type="submit" 
            disabled={isAnalyzing}
            className="mt-4 w-full sm:w-auto bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <BookCheck size={18} /> 
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </form>
      </section>

      {/* --- RENDER THE RESULT AND THE POPUP --- */}
      {(tokens.length > 0 || isAnalyzing || isAnalyzerError) && (
        <section className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Analysis Result</h2>
            <div className="flex items-center gap-2">
              <Glasses size={18} className="text-muted-foreground" />
              <label htmlFor="pos-toggle" className="text-sm text-muted-foreground">Show Parts of Speech</label>
              <input type="checkbox" id="pos-toggle" checked={showPOS} onChange={() => setShowPOS(!showPOS)} />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border text-lg text-md:3xl leading-loose">
            {isAnalyzing && <p className="text-muted-foreground">Analyzing your text...</p>}
            {isAnalyzerError && <p className="text-red-400">{analyzerMessage}</p>}
            
            {tokens.map((wordData, index) => (
              <WordToken
                key={index}
                token={wordData}
                showPOS={showPOS}
                onWordClick={handleWordClick} // Pass the handler down to each token
              />
            ))}

          </div>

          {/* The popup is rendered here, but controlled by our local state. */}
          <div ref={popupRef}>
            <WordInfoPopup 
              wordData={selectedWord}
              isLoading={isDetailsLoading}
              position={popupPosition}
              onAddWord={handleAddWord}
              onClose={() => setSelectedWord(null)}
              error={isVocabError ? vocabMessage : null}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalyzerPage;
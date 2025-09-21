import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dictionaryService from '../services/dictionaryService';
import { getWords, createWord, deleteWord, reset } from '../features/vocabulary/vocabularySlice';
import { Trash2, Search } from 'lucide-react';

const DeckPage = () => {
  // Get the dispatch function to send actions to Redux.
  const dispatch = useDispatch();
  
  // Select auth and vocabulary state from the global Redux store.
  const { token } = useSelector((state) => state.auth);
  const { words, isLoading, isError, message, isSuccess } = useSelector((state) => state.vocabulary);

  // Manage local state for the input form.
  const [termToLookup, setTermToLookup] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Fetch user's words when the component loads.
  useEffect(() => {
    if (token) {
      dispatch(getWords());
    }
    // Cleanup state when the component unmounts.
    return () => {
      dispatch(reset());
    };
  }, [token, dispatch]);

  // This effect clears the form after a word is successfully created.
  useEffect(() => {
    if (isSuccess) {
      setTermToLookup('');
      setLookupResult(null);
    }
  }, [isSuccess, dispatch]);

  // Handler for the "Lookup" button.
  const handleLookup = async () => {
    if (!termToLookup) return;
    
    setIsLookingUp(true);
    setLookupResult(null);
    try {
      const data = await dictionaryService.lookupWord(termToLookup, token);
      setLookupResult({
        term: data.term,
        reading: data.reading,
        definition: data.definition,
      });
    } catch (error) {
      console.error("Lookup Failed", error);
    } finally {
      setIsLookingUp(false);
    }
  };

  // Dispatch action to create a new word on form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lookupResult) return; // Can't submit if there's no looked-up word
    dispatch(createWord(lookupResult));
  };

  // Dispatch action to delete a word.
  const handleDelete = (wordId) => {
    dispatch(deleteWord(wordId));
  };

  // Show a loading message on initial fetch.
  if (isLoading && words.length === 0) {
    return <div className="text-center mt-8 text-muted-foreground">Loading your deck...</div>;
  }

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">My Deck</h1>
        <p className="text-muted-foreground mt-2">Your personal vocabulary collection.</p>
      </section>

      <section className="mb-12 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b border-border pb-2">Add a New Word</h2>
        {/* This single form handles the final submission. */}
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-center">
              {message}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text" name="term" value={termToLookup} onChange={(e) => setTermToLookup(e.target.value)}
              placeholder="Enter a Japanese term..." required
              className="flex-1 px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {/* The "Lookup" button is a generic button that triggers our handleLookup function. */}
            <button 
              type="button"
              onClick={handleLookup}
              disabled={isLookingUp}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search size={18} /> {isLookingUp ? 'Looking up...' : 'Lookup'}
            </button>
          </div>

          {/* These fields are now auto-filled from the lookup result. */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text" name="reading" value={lookupResult?.reading || ''} disabled
              placeholder="Reading (auto-filled)"
              className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-md"
            />
          </div>
          <input
            type="text" name="definition" value={lookupResult?.definition || ''} disabled
            placeholder="Definition (auto-filled)"
            className="w-full px-4 py-2 bg-background/50 border border-border rounded-md"
          />
          {/* This is the main submit button for the form. */}
          <button 
            type="submit" 
            disabled={!lookupResult || isLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Add to Deck
          </button>
        </form>
      </section>

      {/* Section to display the user's vocabulary list. */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b border-border pb-2">Words in Deck</h2>
        {words.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Loop through words from state and render a card for each. */}
            {words.map((word) => (
              <div key={word._id} className="bg-card p-4 rounded-lg border border-border relative">
                {/* Button to trigger the delete action. */}
                <button 
                  onClick={() => handleDelete(word._id)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Delete word"
                >
                  <Trash2 size={18} />
                </button>
                <h3 className="text-xl font-bold text-accent">{word.term}</h3>
                <p className="text-muted-foreground">{word.reading}</p>
                <p className="mt-2 pr-8">{word.definition}</p>
              </div>
            ))}
          </div>
        ) : (
          // Show a message if the user has no words.
          <p className="text-muted-foreground">Your deck is empty. Add your first word!</p>
        )}
      </section>
    </div>
  );
};

export default DeckPage;
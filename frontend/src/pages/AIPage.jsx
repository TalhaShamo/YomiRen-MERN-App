import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { generateExamples, reset } from '../features/ai/aiSlice';
import { Bot } from 'lucide-react';

const AIPage = () => {
  const dispatch = useDispatch();

  // Get the state from our new 'ai' slice in the Redux store.
  const { sentences, isLoading, isError, message } = useSelector((state) => state.ai);

  // Local state to manage the user's input term.
  const [term, setTerm] = useState('');

  // Cleanup effect to reset the AI state when the user navigates away.
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Handler for the form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch our async thunk with the term the user provided.
    dispatch(generateExamples({ term }));
  };

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">AI Sentence Generator</h1>
        <p className="text-muted-foreground mt-2">Enter a Japanese word to get new example sentences from our AI assistant.</p>
      </section>

      {/* The main form for submitting a word. */}
      <section className="mb-12 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Enter a word (e.g., 勉強)"
            required
            className="flex-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Bot size={18} /> 
            {isLoading ? 'Generating...' : 'Generate Sentences'}
          </button>
        </form>
      </section>

      {/* This section displays the generated result. */}
      {(sentences.length > 0 || isLoading || isError) && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Generated Examples</h2>
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            {isLoading && <p className="text-muted-foreground">The AI is thinking...</p>}
            {isError && <p className="text-red-400">{message}</p>}
            
            {/* We map over the 'sentences' array from Redux and render each one. */}
            {sentences.map((sentence, index) => (
              <p key={index} className="text-lg border-b border-border pb-2">
                {sentence}
              </p>
            ))}
            {sentences.length > 0 && (
              <div className="text-center pt-4">
                <p className="text-muted-foreground">
                  Found a new sentence you want to break down? Copy it and {' '}
                  <Link to="/analyzer" className="text-primary hover:underline font-semibold">
                    Go to the Text Analyzer
                  </Link>
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AIPage;
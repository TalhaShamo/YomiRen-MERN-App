import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReviewWords, updateWordReview, reset } from '../features/vocabulary/vocabularySlice';

const ReviewPage = () => {
  const dispatch = useDispatch();

  // Get the global state from Redux.
  const { token } = useSelector((state) => state.auth);
  // We give a nickname to the 'words' from Redux to 'initialDeck' to avoid confusion.
  const { words: initialDeck, isLoading, isError, message } = useSelector((state) => state.vocabulary);

  // --- LOCAL STATE FOR THE REVIEW SESSION ---
  const [sessionDeck, setSessionDeck] = useState([]); // We copy the intialDeck from Redux into our local state.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // This effect fetches the review deck from Redux when the page loads.
  useEffect(() => {
    if (token) {
      dispatch(getReviewWords());
    }
    // Cleanup the global state when the user navigates away.
    return () => {
      dispatch(reset());
    };
  }, [token, dispatch]);

  // This effect copies the deck from Redux to our local state once it arrives.
  useEffect(() => {
    // Only copy the deck from Redux if it has arrived AND our local session is completely empty.
    if (initialDeck.length > 0 && sessionDeck.length === 0) {
      setSessionDeck(initialDeck);
    }
  }, [initialDeck, sessionDeck]);

  // This is the main handler for the rating buttons.
  const handleRating = (rating) => {
    const wordId = currentCard._id;
    // We always send the update to the backend to adjust future SRS intervals.
    dispatch(updateWordReview({ wordId, rating }));

    // --- CUSTOM "AGAIN" LOGIC ---
    if (rating === 'again') {
      // If the user struggled, we add the current card to the back of the session deck.
      setSessionDeck([...sessionDeck, currentCard]);
    }
    
    // Move to the next card and flip it back over for the next turn.
    setIsFlipped(false);
    setCurrentIndex(currentIndex + 1);
  };
  
  // Get the current card from our local session deck.
  const currentCard = sessionDeck[currentIndex];

  // --- RENDER LOGIC ---
  let content;
  if (isLoading) {
    content = <p className="text-muted-foreground text-center">Loading your review session...</p>;
  } else if (isError) {
    content = <p className="text-red-400 text-center">{message}</p>;
  } else if (initialDeck.length === 0 && !isLoading) {
    content = <p className="text-muted-foreground text-center">No words are due for review. Great job!</p>;
  } else if (!currentCard) {
    content = <p className="text-primary text-center text-xl">Session complete! You've reviewed all your cards for now.</p>;
  } else {
    // This is the main flashcard view.
    content = (
      <div className="bg-card p-8 rounded-lg border border-border shadow-lg flex flex-col items-center min-h-[300px]">
        <div className="text-5xl font-bold mb-4">{currentCard.term}</div>

        {isFlipped && (
          <div className="text-center">
            <p className="text-2xl text-muted-foreground mb-2">{currentCard.reading}</p>
            <p className="text-lg">{currentCard.definition}</p>
          </div>
        )}
        
        <div className="mt-auto pt-8 w-full">
          {!isFlipped ? (
            <button onClick={() => setIsFlipped(true)} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90">
              Show Answer
            </button>
          ) : (
            <div className="flex justify-center gap-4">
              <button onClick={() => handleRating('again')} className="bg-red-500/20 text-red-400 font-semibold py-2 px-4 sm:px-6 rounded-lg">Again</button>
              <button onClick={() => handleRating('good')} className="bg-blue-500/20 text-blue-400 font-semibold py-2 px-4 sm:px-6 rounded-lg">Good</button>
              <button onClick={() => handleRating('easy')} className="bg-green-500/20 text-green-400 font-semibold py-2 px-4 sm:px-6 rounded-lg">Easy</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold">SRS Review</h1>
        <p className="text-muted-foreground mt-2">Review the words that are due today.</p>
        {sessionDeck.length > 0 && currentCard && (
          <p className="text-primary mt-4 font-semibold">Card {currentIndex + 1} of {sessionDeck.length}</p>
        )}
      </section>
      
      <section className="max-w-xl mx-auto">
        {content}
      </section>
    </div>
  );
};

export default ReviewPage;
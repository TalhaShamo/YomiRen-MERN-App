import { BookPlus, X } from 'lucide-react'; // Import icons for our buttons

// This component receives all the data and functions it needs from its parent.
const WordInfoPopup = ({ wordData, onAddWord, isLoading, position, onClose, error }) => {
  // If there's no word selected, this component renders nothing.
  if (!wordData) return null;

  return (
    // This div is the main container for our popup.
    // It's positioned absolutely on the page based on the 'position' prop.
    <div 
      className="absolute z-10 w-64 bg-card p-4 rounded-lg border border-border shadow-lg"
      style={position}
    >
      {/* A close button for a good user experience. */}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
        aria-label="Close popup"
      >
        <X size={18} />
      </button>

      {isLoading ? (
        // Show a simple loading message while we fetch the definition from the API.
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        // When data is ready, display the word's details.
        <>
          <div className="border-b border-border pb-2 mb-2">
            <h3 className="text-2xl font-bold">{wordData.term}</h3>
            <p className="text-muted-foreground">{wordData.reading}</p>
          </div>
          <p className="text-sm mb-4">
            {wordData.definition}
          </p>
          <div className="text-xs text-muted-foreground mb-4">
            JLPT Level: {wordData.jlpt || 'N/A'}
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-2 rounded-md my-2 text-sm text-center">
              {error}
            </div>
          )}

          {/* The button to add the word to the user's personal deck. */}
          <button
            onClick={onAddWord}
            className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <BookPlus size={16} /> Add to Deck
          </button>
        </>
      )}
    </div>
  );
};

export default WordInfoPopup;
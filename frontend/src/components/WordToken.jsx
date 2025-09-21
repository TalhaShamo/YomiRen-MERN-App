import React from 'react';

// The properties our WordToken component will receive.
const WordToken = ({ token, showPOS, onWordClick }) => {
  
  // This function handles the click event on the word.
  const handleClick = (event) => {
    // We call the 'onWordClick' function that was passed down from the parent page.
    // We pass back the word's data and the click event itself (to get its position).
    onWordClick(token, event);
  };

  return (
    <div className="inline-flex flex-col items-center mx-1 align-middle">
      {/* The main word token now has an onClick handler. */}
      <span
        onClick={handleClick}
        className="cursor-pointer hover:bg-primary/20 p-1 rounded transition-colors"
      >
        {token.term}
      </span>
      
      {/* Conditionally render the Part of Speech tag if the toggle is on. */}
      {showPOS && (
        <span className="text-xs text-muted-foreground bg-card px-1 rounded-sm -mt-1">
          {token.pos}
        </span>
      )}
    </div>
  );
};

export default WordToken;
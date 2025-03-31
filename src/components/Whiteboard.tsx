import React, { useState } from 'react';
import '../styles/whiteboard.css';

const Whiteboard: React.FC = () => {
  const [noteContent, setNoteContent] = useState<string>('');
  
  // Handle erasing the whiteboard
  const handleErase = () => {
    setNoteContent('');
  };
  
  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <h3 className="whiteboard-title">Whiteboard</h3>
        <button 
          className="erase-button"
          onClick={handleErase}
          title="Erase whiteboard"
        >
          Erase
        </button>
      </div>
      
      <textarea
        className="whiteboard-textarea"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Jot down your quick ideas here..."
        rows={4}
      />
    </div>
  );
};

export default Whiteboard; 
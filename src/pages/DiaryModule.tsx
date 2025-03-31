import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { DiaryEntry } from '../types';
import '../styles/diary.css'; // Import our new kawaii diary styles
import { v4 as uuidv4 } from 'uuid';

// Import mood icons
import moodAngry from '../assets/images/yuwon_angry.png';
import moodSad from '../assets/images/yuwon_sad.png';
import moodVerySad from '../assets/images/yuwon_verysad.png';
import moodNeutral from '../assets/images/yuwon_neutral.png';
import moodHappy from '../assets/images/yuwon_happy.png';
import moodVeryHappy from '../assets/images/yuwon_veryhappy.png';
import moodExcited from '../assets/images/yuwon_excited.png';
import emptyEntryIcon from '../assets/images/icons/emptyentry.png';

// Create an icons object to use in the component
const icons = {
  moods: {
    happy: require('../assets/images/yuwon_happy.png'),
    neutral: require('../assets/images/yuwon_neutral.png'),
    sad: require('../assets/images/yuwon_sad.png'),
    excited: require('../assets/images/yuwon_excited.png'),
    anxious: require('../assets/images/yuwon_angry.png'),
    tired: require('../assets/images/yuwon_verysad.png'),
    angry: require('../assets/images/yuwon_superangry.png'),
  },
  sections: {
    gratitude: require('../assets/images/gratitude.png'),
    achievement: require('../assets/images/achievement.png'),
    selfcare: require('../assets/images/selfcare.png'),
    tomorrow: require('../assets/images/tomorrow.png'),
  }
};

// Helper function to safely get mood icon
const getMoodIcon = (mood: string | undefined): string => {
  if (!mood) return icons.moods.neutral;
  // Cast mood to keyof typeof icons.moods to ensure type safety
  const safeMood = mood as keyof typeof icons.moods;
  return icons.moods[safeMood] || icons.moods.neutral;
};

// Extend the DiaryEntry type to include our new sections
interface EnhancedDiaryEntry extends DiaryEntry {
  gratitude?: string;
  achievement?: string;
  selfCare?: string;
  tomorrow?: string;
  paperStyle?: 'lined' | 'grid' | 'dot' | 'blank';
}

const DiaryModule: React.FC = () => {
  const { points, diaryEntries, addDiaryEntry, deleteDiaryEntry } = useAppContext();
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<'happy' | 'neutral' | 'sad' | 'excited' | 'anxious' | 'tired' | 'angry'>('happy');
  const [viewingEntry, setViewingEntry] = useState<string | null>(null);
  
  // New state for additional entry sections
  const [gratitude, setGratitude] = useState('');
  const [achievement, setAchievement] = useState('');
  const [selfCare, setSelfCare] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  
  // State for paper style
  const [paperStyle, setPaperStyle] = useState<'lined' | 'grid' | 'dot' | 'blank'>('lined');

  // New state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedGratitude, setEditedGratitude] = useState('');
  const [editedAchievement, setEditedAchievement] = useState('');
  const [editedSelfCare, setEditedSelfCare] = useState('');
  const [editedTomorrow, setEditedTomorrow] = useState('');
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Refs for content editable divs
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const gratitudeEditableRef = useRef<HTMLDivElement>(null);
  const achievementEditableRef = useRef<HTMLDivElement>(null);
  const selfCareEditableRef = useRef<HTMLDivElement>(null);
  const tomorrowEditableRef = useRef<HTMLDivElement>(null);

  // Set up edit state when an entry is selected for viewing
  useEffect(() => {
    if (viewingEntry) {
      const entryToEdit = diaryEntries.find(entry => entry.id === viewingEntry) as EnhancedDiaryEntry;
      if (entryToEdit) {
        setEditedContent(entryToEdit.content);
        setEditedGratitude(entryToEdit.gratitude || '');
        setEditedAchievement(entryToEdit.achievement || '');
        setEditedSelfCare(entryToEdit.selfCare || '');
        setEditedTomorrow(entryToEdit.tomorrow || '');
      }
      // Reset edit mode when changing entries
      setIsEditing(false);
    }
  }, [viewingEntry, diaryEntries]);

  // Handle save edits
  const handleSaveEdit = () => {
    if (!viewingEntry) return;

    // Get the current content from the contentEditable divs
    const updatedContent = contentEditableRef.current?.innerText || editedContent;
    const updatedGratitude = gratitudeEditableRef.current?.innerText || editedGratitude;
    const updatedAchievement = achievementEditableRef.current?.innerText || editedAchievement;
    const updatedSelfCare = selfCareEditableRef.current?.innerText || editedSelfCare;
    const updatedTomorrow = tomorrowEditableRef.current?.innerText || editedTomorrow;
    
    const currentEntry = diaryEntries.find(entry => entry.id === viewingEntry) as EnhancedDiaryEntry;
    if (currentEntry) {
      const updatedEntry: EnhancedDiaryEntry = {
        ...currentEntry,
        content: updatedContent,
        gratitude: updatedGratitude,
        achievement: updatedAchievement,
        selfCare: updatedSelfCare,
        tomorrow: updatedTomorrow
      };
      
      updateDiaryEntry(updatedEntry as DiaryEntry);
      setIsEditing(false);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntryContent.trim()) {
      const newEntry: EnhancedDiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: newEntryContent.trim(),
        mood: selectedMood,
        // Add our new sections
        gratitude: gratitude.trim(),
        achievement: achievement.trim(),
        selfCare: selfCare.trim(),
        tomorrow: tomorrow.trim(),
        paperStyle: paperStyle
      };
      addDiaryEntry(newEntry as DiaryEntry);
      
      // Reset form
      setNewEntryContent('');
      setGratitude('');
      setAchievement('');
      setSelfCare('');
      setTomorrow('');
      setSelectedMood('happy');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort entries by date, newest first
  const sortedEntries = [...diaryEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentEntry = viewingEntry 
    ? diaryEntries.find(entry => entry.id === viewingEntry) as EnhancedDiaryEntry | undefined
    : null;

  // Check if entry has extra sections
  const hasAdditionalSections = (entry: EnhancedDiaryEntry) => {
    return entry.gratitude || entry.achievement || entry.selfCare || entry.tomorrow;
  };

  // Get which sections an entry has
  const getEntrySections = (entry: EnhancedDiaryEntry) => {
    const sections = [];
    if (entry.gratitude) sections.push('gratitude');
    if (entry.achievement) sections.push('achievement');
    if (entry.selfCare) sections.push('selfCare');
    if (entry.tomorrow) sections.push('tomorrow');
    return sections;
  };

  // Implement a local update function since this isn't exposed by context
  const updateDiaryEntry = (updatedEntry: DiaryEntry) => {
    // Re-add the entry with the same ID, which will update it in state
    addDiaryEntry(updatedEntry);
  };

  // Delete confirmation handler
  const handleDeleteEntry = () => {
    if (viewingEntry) {
      deleteDiaryEntry(viewingEntry);
      setViewingEntry(null);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="diary-container">
      <div className="diary-header module-header">
        <h2>My Diary</h2>
      </div>

      {currentEntry ? (
        <div className={`diary-entry-view ${currentEntry.paperStyle ? currentEntry.paperStyle + '-paper' : 'lined-paper'}`}>
          <div className="entry-view-header">
            <div className="entry-view-date-mood">
              <div className="entry-view-date">{formatDate(currentEntry.date)} at {formatTime(currentEntry.date)}</div>
              <img 
                src={getMoodIcon(currentEntry.mood)} 
                alt={currentEntry.mood} 
                className="entry-view-mood"
              />
            </div>
            <div className="entry-view-buttons">
              {isEditing ? (
                <button className="save-edit-button" onClick={handleSaveEdit}>Save Changes</button>
              ) : (
                <>
                  <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="delete-button" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
                </>
              )}
              <button className="back-button" onClick={() => setViewingEntry(null)}>Back to Entries</button>
            </div>
          </div>
          
          {/* Delete confirmation dialog */}
          {showDeleteConfirm && (
            <div className="delete-confirm-overlay">
              <div className="delete-confirm-dialog">
                <h4>Delete Entry</h4>
                <p>Are you sure you want to delete this diary entry? This action cannot be undone.</p>
                <div className="delete-confirm-buttons">
                  <button 
                    className="delete-confirm-button"
                    onClick={handleDeleteEntry}
                  >
                    Delete Entry
                  </button>
                  <button 
                    className="delete-cancel-button"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div 
            className={`entry-view-content ${currentEntry.paperStyle ? currentEntry.paperStyle + '-paper' : 'lined-paper'} ${isEditing ? 'editable' : ''}`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={contentEditableRef}
          >
            {currentEntry.content}
          </div>
          
          {hasAdditionalSections(currentEntry) && (
            <div className="entry-view-sections">
              {currentEntry.gratitude && (
                <div className="entry-view-section">
                  <div className="entry-section-header">
                    <img src={icons.sections.gratitude} alt="Gratitude" className="entry-section-icon" />
                    <h4 className="entry-section-title">Gratitude</h4>
                  </div>
                  <div 
                    className={`entry-section-content ${isEditing ? 'editable' : ''}`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    ref={gratitudeEditableRef}
                  >
                    {currentEntry.gratitude}
                  </div>
                </div>
              )}
              
              {currentEntry.achievement && (
                <div className="entry-view-section">
                  <div className="entry-section-header">
                    <img src={icons.sections.achievement} alt="Achievement" className="entry-section-icon" />
                    <h4 className="entry-section-title">Today's Achievement</h4>
                  </div>
                  <div 
                    className={`entry-section-content ${isEditing ? 'editable' : ''}`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    ref={achievementEditableRef}
                  >
                    {currentEntry.achievement}
                  </div>
                </div>
              )}
              
              {currentEntry.selfCare && (
                <div className="entry-view-section">
                  <div className="entry-section-header">
                    <img src={icons.sections.selfcare} alt="Self Care" className="entry-section-icon" />
                    <h4 className="entry-section-title">Self Care</h4>
                  </div>
                  <div 
                    className={`entry-section-content ${isEditing ? 'editable' : ''}`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    ref={selfCareEditableRef}
                  >
                    {currentEntry.selfCare}
                  </div>
                </div>
              )}
              
              {currentEntry.tomorrow && (
                <div className="entry-view-section">
                  <div className="entry-section-header">
                    <img src={icons.sections.tomorrow} alt="Tomorrow" className="entry-section-icon" />
                    <h4 className="entry-section-title">Tomorrow's Goals</h4>
                  </div>
                  <div 
                    className={`entry-section-content ${isEditing ? 'editable' : ''}`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    ref={tomorrowEditableRef}
                  >
                    {currentEntry.tomorrow}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <form onSubmit={handleAddEntry} className="diary-entry-form card">
            <h3 className="diary-form-title">Write a New Entry</h3>
            
            <h4 className="diary-form-subtitle">How are you feeling today?</h4>
            <div className="mood-selection">
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="happy" 
                  checked={selectedMood === 'happy'} 
                  onChange={() => setSelectedMood('happy')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.happy} alt="Happy" />
                  <span className="mood-label">Happy</span>
                </div>
              </label>
              
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="excited" 
                  checked={selectedMood === 'excited'} 
                  onChange={() => setSelectedMood('excited')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.excited} alt="Excited" />
                  <span className="mood-label">Excited</span>
                </div>
              </label>
              
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="neutral" 
                  checked={selectedMood === 'neutral'} 
                  onChange={() => setSelectedMood('neutral')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.neutral} alt="Neutral" />
                  <span className="mood-label">Neutral</span>
                </div>
              </label>
              
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="tired" 
                  checked={selectedMood === 'tired'} 
                  onChange={() => setSelectedMood('tired')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.tired} alt="Tired" />
                  <span className="mood-label">Tired</span>
                </div>
              </label>
              
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="anxious" 
                  checked={selectedMood === 'anxious'} 
                  onChange={() => setSelectedMood('anxious')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.anxious} alt="Anxious" />
                  <span className="mood-label">Anxious</span>
                </div>
              </label>
              
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="sad" 
                  checked={selectedMood === 'sad'} 
                  onChange={() => setSelectedMood('sad')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.sad} alt="Sad" />
                  <span className="mood-label">Sad</span>
                </div>
              </label>
              
              <label className="mood-option">
                <input 
                  type="radio" 
                  name="mood" 
                  value="angry" 
                  checked={selectedMood === 'angry'} 
                  onChange={() => setSelectedMood('angry')} 
                />
                <div className="mood-icon">
                  <img src={icons.moods.angry} alt="Angry" />
                  <span className="mood-label">Angry</span>
                </div>
              </label>
            </div>
            
            <h4 className="diary-form-subtitle">Dear Diary...</h4>
            <div className="diary-textarea-container">
              <div className="paper-style-selector">
                <div 
                  className={`paper-style-button paper-lines ${paperStyle === 'lined' ? 'active' : ''}`}
                  onClick={() => setPaperStyle('lined')}
                  title="Lined Paper"
                ></div>
                <div 
                  className={`paper-style-button paper-grid ${paperStyle === 'grid' ? 'active' : ''}`}
                  onClick={() => setPaperStyle('grid')}
                  title="Grid Paper"
                ></div>
                <div 
                  className={`paper-style-button paper-dots ${paperStyle === 'dot' ? 'active' : ''}`}
                  onClick={() => setPaperStyle('dot')}
                  title="Dot Paper"
                ></div>
                <div 
                  className={`paper-style-button paper-blank ${paperStyle === 'blank' ? 'active' : ''}`}
                  onClick={() => setPaperStyle('blank')}
                  title="Blank Paper"
                ></div>
              </div>
              <textarea
                className={`diary-textarea ${paperStyle}-paper`}
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                placeholder="What's on your mind today?"
                rows={5}
              />
            </div>
            
            <div className="diary-sections">
              <div className="diary-section">
                <div className="section-header">
                  <img src={icons.sections.gratitude} alt="Gratitude" className="section-icon" />
                  <h4 className="section-title">Today I'm grateful for...</h4>
                </div>
                <textarea 
                  className="section-input"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="List 3 things you're grateful for today..."
                  rows={2}
                ></textarea>
              </div>
              
              <div className="diary-section">
                <div className="section-header">
                  <img src={icons.sections.achievement} alt="Achievement" className="section-icon" />
                  <h4 className="section-title">My achievement today</h4>
                </div>
                <textarea 
                  className="section-input"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  placeholder="What are you proud of accomplishing today?"
                  rows={2}
                ></textarea>
              </div>
              
              <div className="diary-section">
                <div className="section-header">
                  <img src={icons.sections.selfcare} alt="Self Care" className="section-icon" />
                  <h4 className="section-title">Self-care activities</h4>
                </div>
                <textarea 
                  className="section-input"
                  value={selfCare}
                  onChange={(e) => setSelfCare(e.target.value)}
                  placeholder="How did you take care of yourself today?"
                  rows={2}
                ></textarea>
              </div>
              
              <div className="diary-section">
                <div className="section-header">
                  <img src={icons.sections.tomorrow} alt="Tomorrow" className="section-icon" />
                  <h4 className="section-title">Tomorrow I will...</h4>
                </div>
                <textarea 
                  className="section-input"
                  value={tomorrow}
                  onChange={(e) => setTomorrow(e.target.value)}
                  placeholder="What are your goals for tomorrow?"
                  rows={2}
                ></textarea>
              </div>
            </div>
            
            <button type="submit" className="save-entry-button">Save Entry</button>
          </form>

          <h3 className="diary-entries-title">Previous Entries</h3>
          {sortedEntries.length === 0 ? (
            <div className="empty-entries-message">
              <img src={emptyEntryIcon} alt="No entries" />
              <p>No entries yet. Write your first entry above!</p>
            </div>
          ) : (
            <div className="entries-list">
              {sortedEntries.map(entry => {
                const enhancedEntry = entry as EnhancedDiaryEntry;
                return (
                  <div 
                    key={entry.id} 
                    className="entry-card"
                    onClick={() => setViewingEntry(entry.id)}
                  >
                    <div className="entry-card-header">
                      <div className="entry-date">{formatDate(entry.date)}</div>
                      <img 
                        src={getMoodIcon(entry.mood)} 
                        alt={entry.mood} 
                        className="entry-mood-icon"
                      />
                    </div>
                    <div className="entry-card-content">
                      <div className="entry-snippet">
                        {entry.content.length > 100 
                          ? entry.content.substring(0, 100) + '...' 
                          : entry.content}
                      </div>
                      
                      {/* Only show section tags if they exist */}
                      {hasAdditionalSections(enhancedEntry) && (
                        <div className="entry-section-tags">
                          {enhancedEntry.gratitude && (
                            <div className="entry-section-tag">
                              <img src={icons.sections.gratitude} alt="Gratitude" />
                              Gratitude
                            </div>
                          )}
                          {enhancedEntry.achievement && (
                            <div className="entry-section-tag">
                              <img src={icons.sections.achievement} alt="Achievement" />
                              Achievement
                            </div>
                          )}
                          {enhancedEntry.selfCare && (
                            <div className="entry-section-tag">
                              <img src={icons.sections.selfcare} alt="Self Care" />
                              Self Care
                            </div>
                          )}
                          {enhancedEntry.tomorrow && (
                            <div className="entry-section-tag">
                              <img src={icons.sections.tomorrow} alt="Tomorrow" />
                              Tomorrow
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiaryModule;
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SkinCareEntry } from '../types';
// Import is now handled via index.css
// The skincare.css file is already imported via the index.css file

// Enhanced SkinCareEntry with more detailed steps
interface EnhancedSkinCareEntry extends SkinCareEntry {
  steps?: {
    morning?: string[];
    evening?: string[];
  };
  template?: 'basic' | 'advanced' | 'acne' | 'antiaging' | 'custom';
}

// Template definitions
interface RoutineTemplate {
  name: string;
  icon: string;
  description: string;
  morningSteps: string[];
  eveningSteps: string[];
  additionalSteps?: string[];
}

const SkincareModule: React.FC = () => {
  const { points, skincareEntries, addSkincareEntry } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningRoutine, setMorningRoutine] = useState(false);
  const [eveningRoutine, setEveningRoutine] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Custom steps management
  const [newCustomStep, setNewCustomStep] = useState('');
  const [customMorningSteps, setCustomMorningSteps] = useState<string[]>([]);
  const [customEveningSteps, setCustomEveningSteps] = useState<string[]>([]);
  
  // Steps tracking - Morning
  const [morningSteps, setMorningSteps] = useState<{ [key: string]: boolean }>({});
  
  // Steps tracking - Evening
  const [eveningSteps, setEveningSteps] = useState<{ [key: string]: boolean }>({});
  
  // Additional steps
  const [additionalSteps, setAdditionalSteps] = useState<{ [key: string]: boolean }>({});
  
  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState<'basic' | 'advanced' | 'acne' | 'antiaging' | 'custom'>('basic');

  // Template definitions
  const templates: Record<string, RoutineTemplate> = {
    basic: {
      name: 'Basic',
      icon: '🧼',
      description: 'Simple cleanse and moisturize',
      morningSteps: ['Cleanse', 'Moisturize', 'Sunscreen'],
      eveningSteps: ['Cleanse', 'Moisturize']
    },
    advanced: {
      name: 'Advanced',
      icon: '✨',
      description: 'Full skincare routine',
      morningSteps: ['Cleanse', 'Toner', 'Serum', 'Moisturize', 'Sunscreen'],
      eveningSteps: ['Cleanse', 'Toner', 'Serum', 'Moisturize', 'Face Oil']
    },
    acne: {
      name: 'Acne Care',
      icon: '🌱',
      description: 'Focus on clearing skin',
      morningSteps: ['Gentle Cleanse', 'Acne Treatment', 'Oil-Free Moisturizer', 'Sunscreen'],
      eveningSteps: ['Double Cleanse', 'Toner', 'Acne Treatment', 'Spot Treatment', 'Moisturizer']
    },
    antiaging: {
      name: 'Anti-Aging',
      icon: '🌟',
      description: 'Focus on rejuvenation',
      morningSteps: ['Cleanse', 'Vitamin C Serum', 'Moisturize', 'Eye Cream', 'Sunscreen'],
      eveningSteps: ['Cleanse', 'Toner', 'Retinol', 'Night Cream', 'Eye Cream']
    },
    custom: {
      name: 'Custom',
      icon: '🎨',
      description: 'Your personal routine',
      morningSteps: ['Cleanse'],
      eveningSteps: ['Cleanse'],
      additionalSteps: ['Exfoliate', 'Face Mask', 'Eye Cream', 'Lip Treatment', 'Facial Massage']
    }
  };

  // Initialize steps based on template
  useEffect(() => {
    const resetAllSteps = () => {
      const template = templates[selectedTemplate];
      
      // Initialize morning steps - always set to false (unchecked)
      let newMorningSteps: { [key: string]: boolean } = {};
      
      if (selectedTemplate === 'custom' && customMorningSteps.length > 0) {
        // For custom template, use the custom steps
        customMorningSteps.forEach(step => {
          newMorningSteps[step] = false; // Always initialize to false
        });
      } else {
        // For predefined templates
        template.morningSteps.forEach(step => {
          newMorningSteps[step] = false; // Always initialize to false
        });
        
        // Update custom steps if template changes to custom
        if (selectedTemplate === 'custom') {
          setCustomMorningSteps(template.morningSteps);
        }
      }
      setMorningSteps(newMorningSteps);
      
      // Initialize evening steps - always set to false (unchecked)
      let newEveningSteps: { [key: string]: boolean } = {};
      
      if (selectedTemplate === 'custom' && customEveningSteps.length > 0) {
        // For custom template, use the custom steps
        customEveningSteps.forEach(step => {
          newEveningSteps[step] = false; // Always initialize to false
        });
      } else {
        // For predefined templates
        template.eveningSteps.forEach(step => {
          newEveningSteps[step] = false; // Always initialize to false
        });
        
        // Update custom steps if template changes to custom
        if (selectedTemplate === 'custom') {
          setCustomEveningSteps(template.eveningSteps);
        }
      }
      setEveningSteps(newEveningSteps);
      
      // Initialize additional steps if any - always set to false (unchecked)
      const newAdditionalSteps: { [key: string]: boolean } = {};
      if (template.additionalSteps) {
        template.additionalSteps.forEach(step => {
          newAdditionalSteps[step] = false; // Always initialize to false
        });
      }
      setAdditionalSteps(newAdditionalSteps);
      
      // Also make sure the routine toggles are reset when template changes
      setMorningRoutine(false);
      setEveningRoutine(false);
    };
    
    // Call the reset function
    resetAllSteps();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]); // Only run when template changes

  // Reset steps when component mounts
  useEffect(() => {
    // Reset all checkboxes when component first mounts
    setMorningRoutine(false);
    setEveningRoutine(false);
    
    // Reset all steps tracking
    const template = templates[selectedTemplate];
    
    // Reset morning steps
    let newMorningSteps: { [key: string]: boolean } = {};
    template.morningSteps.forEach(step => {
      newMorningSteps[step] = false;
    });
    setMorningSteps(newMorningSteps);
    
    // Reset evening steps
    let newEveningSteps: { [key: string]: boolean } = {};
    template.eveningSteps.forEach(step => {
      newEveningSteps[step] = false;
    });
    setEveningSteps(newEveningSteps);
    
    // Reset additional steps
    const newAdditionalSteps: { [key: string]: boolean } = {};
    if (template.additionalSteps) {
      template.additionalSteps.forEach(step => {
        newAdditionalSteps[step] = false;
      });
    }
    setAdditionalSteps(newAdditionalSteps);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array means this runs once on component mount

  // Add custom step
  const addCustomStep = (type: 'morning' | 'evening') => {
    if (!newCustomStep.trim()) return;
    
    if (type === 'morning') {
      // Add to custom morning steps
      const updatedSteps = [...customMorningSteps, newCustomStep];
      setCustomMorningSteps(updatedSteps);
      
      // Update morning steps tracking
      setMorningSteps(prev => ({
        ...prev,
        [newCustomStep]: false
      }));
    } else {
      // Add to custom evening steps
      const updatedSteps = [...customEveningSteps, newCustomStep];
      setCustomEveningSteps(updatedSteps);
      
      // Update evening steps tracking
      setEveningSteps(prev => ({
        ...prev,
        [newCustomStep]: false
      }));
    }
    
    setNewCustomStep('');
  };

  // Remove custom step
  const removeCustomStep = (step: string, type: 'morning' | 'evening') => {
    if (type === 'morning') {
      // Remove from custom morning steps
      const updatedSteps = customMorningSteps.filter(s => s !== step);
      setCustomMorningSteps(updatedSteps);
      
      // Update morning steps tracking
      const updatedTracking = { ...morningSteps };
      delete updatedTracking[step];
      setMorningSteps(updatedTracking);
    } else {
      // Remove from custom evening steps
      const updatedSteps = customEveningSteps.filter(s => s !== step);
      setCustomEveningSteps(updatedSteps);
      
      // Update evening steps tracking
      const updatedTracking = { ...eveningSteps };
      delete updatedTracking[step];
      setEveningSteps(updatedTracking);
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setMorningRoutine(false);
    setEveningRoutine(false);
    setNotes('');
    
    // Reset all steps
    const template = templates[selectedTemplate];
    
    // Create completely new objects rather than modifying existing ones
    const newMorningSteps: { [key: string]: boolean } = {};
    if (selectedTemplate === 'custom' && customMorningSteps.length > 0) {
      customMorningSteps.forEach(step => {
        newMorningSteps[step] = false;
      });
    } else {
      template.morningSteps.forEach(step => {
        newMorningSteps[step] = false;
      });
    }
    setMorningSteps(newMorningSteps);
    
    const newEveningSteps: { [key: string]: boolean } = {};
    if (selectedTemplate === 'custom' && customEveningSteps.length > 0) {
      customEveningSteps.forEach(step => {
        newEveningSteps[step] = false;
      });
    } else {
      template.eveningSteps.forEach(step => {
        newEveningSteps[step] = false;
      });
    }
    setEveningSteps(newEveningSteps);
    
    const newAdditionalSteps: { [key: string]: boolean } = {};
    if (template.additionalSteps) {
      template.additionalSteps.forEach(step => {
        newAdditionalSteps[step] = false;
      });
    }
    setAdditionalSteps(newAdditionalSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && (morningRoutine || eveningRoutine)) {
      // Collect completed steps
      const completedMorningSteps = Object.keys(morningSteps).filter(step => morningSteps[step]);
      const completedEveningSteps = Object.keys(eveningSteps).filter(step => eveningSteps[step]);
      const completedAdditionalSteps = Object.keys(additionalSteps).filter(step => additionalSteps[step]);
      
      const newEntry: EnhancedSkinCareEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        am: morningRoutine,
        pm: eveningRoutine,
        morning: morningRoutine,
        evening: eveningRoutine,
        notes: notes || '',
        description: `Skincare routine for ${selectedDate}`,
        template: selectedTemplate,
        steps: {
          morning: completedMorningSteps,
          evening: completedEveningSteps
        },
        
        // For backward compatibility with original fields
        cleansed: completedMorningSteps.includes('Cleanse') || completedEveningSteps.includes('Cleanse'),
        toner: completedMorningSteps.includes('Toner') || completedEveningSteps.includes('Toner'),
        serum: completedMorningSteps.includes('Serum') || completedEveningSteps.includes('Serum'),
        moisturizer: completedMorningSteps.includes('Moisturize') || completedEveningSteps.includes('Moisturize'),
        sunscreen: completedMorningSteps.includes('Sunscreen'),
        mask: completedAdditionalSteps.includes('Face Mask')
      };
      
      addSkincareEntry(newEntry as SkinCareEntry);
      resetForm();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group entries by month
  const groupedEntries: Record<string, typeof skincareEntries> = {};
  skincareEntries.forEach(entry => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groupedEntries[monthYear]) {
      groupedEntries[monthYear] = [];
    }
    
    groupedEntries[monthYear].push(entry);
  });

  // Sort groups by date (newest first)
  const sortedMonths = Object.keys(groupedEntries).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  // Check if entry exists for selected date
  const entryExists = skincareEntries.some(entry => entry.date === selectedDate);

  // Handle template change
  const handleTemplateChange = (template: 'basic' | 'advanced' | 'acne' | 'antiaging' | 'custom') => {
    setSelectedTemplate(template);
  };

  // Toggle all steps in a routine
  const toggleAllMorningSteps = (checked: boolean) => {
    const updatedSteps = { ...morningSteps };
    Object.keys(updatedSteps).forEach(step => {
      updatedSteps[step] = checked;
    });
    setMorningSteps(updatedSteps);
  };
  
  const toggleAllEveningSteps = (checked: boolean) => {
    const updatedSteps = { ...eveningSteps };
    Object.keys(updatedSteps).forEach(step => {
      updatedSteps[step] = checked;
    });
    setEveningSteps(updatedSteps);
  };

  return (
    <div className="skincare-module skincare-container">
      <header className="skincare-header module-header">
        <h2>Skincare</h2>
        <div className="header-info">
          {/* Add any additional header content here */}
        </div>
      </header>

      <div className="skincare-tracker">
        <h3>Track Today's Routine</h3>
        
        <div className="date-picker">
          <div className="date-picker-header">
            <label htmlFor="date-select">Date</label>
          </div>
          <div className="date-picker-content">
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="template-selector">
          <div className="template-selector-header">
            <h4>Choose Your Routine Template</h4>
          </div>
          
          <div className="template-content">
            <div className="template-options">
              {Object.entries(templates).map(([key, template]) => (
                <label key={key} className="template-option">
                  <input
                    type="radio"
                    name="template"
                    checked={selectedTemplate === key}
                    onChange={() => handleTemplateChange(key as any)}
                  />
                  <div className="template-card">
                    <span className="template-icon">{template.icon}</span>
                    <span className="template-name">{template.name}</span>
                    <span className="template-desc">{template.description}</span>
                  </div>
                </label>
              ))}
            </div>
            
            {/* Custom Step Management - only show for custom template */}
            {selectedTemplate === 'custom' && (
              <>
                {/* Custom Step Input */}
                <div className="custom-step-input">
                  <input
                    type="text"
                    placeholder="Add a custom step..."
                    value={newCustomStep}
                    onChange={(e) => setNewCustomStep(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="add-step-button"
                    onClick={() => addCustomStep('morning')}
                  >
                    Add to Morning
                  </button>
                  <button 
                    type="button" 
                    className="add-step-button"
                    onClick={() => addCustomStep('evening')}
                  >
                    Add to Evening
                  </button>
                </div>
                
                {/* Display custom steps with remove option */}
                {customMorningSteps.length > 0 && (
                  <div className="custom-steps-list">
                    <h5>Custom Morning Steps:</h5>
                    {customMorningSteps.map(step => (
                      <div key={step} className="custom-step-item">
                        <span>{step}</span>
                        <button 
                          type="button" 
                          className="remove-step"
                          onClick={() => removeCustomStep(step, 'morning')}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {customEveningSteps.length > 0 && (
                  <div className="custom-steps-list">
                    <h5>Custom Evening Steps:</h5>
                    {customEveningSteps.map(step => (
                      <div key={step} className="custom-step-item">
                        <span>{step}</span>
                        <button 
                          type="button" 
                          className="remove-step"
                          onClick={() => removeCustomStep(step, 'evening')}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* NEW ROUTINE SECTIONS START HERE */} 
        <div className="new-routine-sections">
          {/* Morning Routine */}
          <div className="new-routine-section">
            <div className="new-section-header morning">
              <h4>🌞 Morning Routine</h4>
              <label className="new-toggle-all">
                <input
                  type="checkbox"
                  checked={morningRoutine}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setMorningRoutine(isChecked);
                    
                    // Update all morning steps based on the main toggle
                    const newStepsState: { [key: string]: boolean } = {};
                    Object.keys(morningSteps).forEach(step => {
                      newStepsState[step] = isChecked;
                    });
                    setMorningSteps(newStepsState);
                  }}
                />
                <span className="toggle-switch"></span>
              </label>
            </div>
            <div className="new-steps-container">
              <div className="new-steps-list">
                {Object.entries(morningSteps).map(([step, isChecked]) => (
                  <label key={`morning-${step}`} className="new-step-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setMorningSteps(prev => ({
                          ...prev,
                          [step]: e.target.checked
                        }));
                        // If unchecking an item, uncheck the main toggle
                        if (!e.target.checked) setMorningRoutine(false);
                      }}
                    />
                    <span className="new-step-text">{step}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Evening Routine */}
          <div className="new-routine-section">
            <div className="new-section-header evening">
              <h4>🌙 Evening Routine</h4>
              <label className="new-toggle-all">
                <input
                  type="checkbox"
                  checked={eveningRoutine}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setEveningRoutine(isChecked);
                    
                    // Update all evening steps based on the main toggle
                    const newStepsState: { [key: string]: boolean } = {};
                    Object.keys(eveningSteps).forEach(step => {
                      newStepsState[step] = isChecked;
                    });
                    setEveningSteps(newStepsState);
                  }}
                />
                <span className="toggle-switch"></span>
              </label>
            </div>
            <div className="new-steps-container">
              <div className="new-steps-list">
                {Object.entries(eveningSteps).map(([step, isChecked]) => (
                  <label key={`evening-${step}`} className="new-step-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setEveningSteps(prev => ({
                          ...prev,
                          [step]: e.target.checked
                        }));
                        // If unchecking an item, uncheck the main toggle
                        if (!e.target.checked) setEveningRoutine(false);
                      }}
                    />
                    <span className="new-step-text">{step}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Additional Steps (Optional) */}
          {templates[selectedTemplate].additionalSteps && 
           templates[selectedTemplate].additionalSteps!.length > 0 && (
            <div className="new-routine-section">
              <div className="new-section-header additional">
                <h4>✨ Additional Steps</h4>
                {/* No toggle all for additional steps */}
              </div>
              <div className="new-steps-container">
                <div className="new-steps-list">
                  {Object.entries(additionalSteps).map(([step, isChecked]) => (
                    <label key={`additional-${step}`} className="new-step-item">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setAdditionalSteps(prev => ({
                            ...prev,
                            [step]: e.target.checked
                          }));
                        }}
                      />
                      <span className="new-step-text">{step}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* END OF NEW ROUTINE SECTIONS */} 
        
        <div className="notes-input">
          <label htmlFor="notes">Notes (optional):</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Products used, skin condition, etc."
            rows={3}
          />
        </div>
        
        {entryExists && (
          <div className="entry-exists-message">
            You already have an entry for this date. Adding a new one will replace it.
          </div>
        )}
        
        <button 
          type="button"
          className="save-routine-button"
          disabled={!selectedDate || (!morningRoutine && !eveningRoutine)}
          onClick={handleSubmit}
        >
          Save Routine
        </button>
      </div>

      <h3 className="history-header">History</h3>
      
      {sortedMonths.length === 0 ? (
        <div className="empty-entries-message">
          <img src="assets/images/icons/emptyentry.png" alt="No entries" />
          <p>No skincare entries yet. Start tracking today!</p>
        </div>
      ) : (
        sortedMonths.map(month => (
          <div key={month} className="month-section">
            <h4 className="month-header">{month}</h4>
            <div className="month-entries">
              {groupedEntries[month]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(entry => {
                  const enhancedEntry = entry as EnhancedSkinCareEntry;
                  return (
                    <div key={entry.id} className="skincare-entry-card">
                      <div className="entry-card-date">
                        <span>{formatDate(entry.date)}</span>
                      </div>
                      
                      <div className="entry-routines">
                        <div className={`routine-status morning-status ${entry.am ? 'completed' : ''}`}>
                          <span className="routine-label">Morning</span>
                          <span>{entry.am ? '✅' : '❌'}</span>
                        </div>
                        
                        <div className={`routine-status evening-status ${entry.pm ? 'completed' : ''}`}>
                          <span className="routine-label">Evening</span>
                          <span>{entry.pm ? '✅' : '❌'}</span>
                        </div>
                      </div>
                      
                      {entry.notes && (
                        <div className="entry-notes">
                          <p>{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SkincareModule;
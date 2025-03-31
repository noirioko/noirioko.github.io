// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Room, Task } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faPlus, 
  faTrash, 
  faTimes, 
  faBroom,
  faBed,
  faCouch,
  faBath,
  faUtensils,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faBox
} from '@fortawesome/free-solid-svg-icons';
import '../styles/CleaningModule.css';
import cleaningIcon from '../assets/images/yuwon_clean_icon.png';

// Add type declaration for require
declare function require(path: string): any;

// Fix the roomImages type declaration
const roomImages: Record<string, string> = {
  bedroom: require('../assets/images/room-bg/bedroom.jpg'),
  bathroom: require('../assets/images/room-bg/bathroom.jpg'),
  livingroom: require('../assets/images/room-bg/livingroom.jpg'),
  kitchen: require('../assets/images/room-bg/kitchen.jpg'),
};

// Helper for generating IDs
const generateId = () => `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Default room templates with predefined IDs
const DEFAULT_ROOMS = [
  {
    id: 'bedroom-default',
    name: 'Bedroom',
    icon: faBed, 
    imageUrl: roomImages.bedroom,
    tasks: [
      { 
        id: 'bedroom-task-1',
        name: 'Make the bed', 
        completed: false,
        difficulty: 'easy' as const,
        category: 'cleaning',
        roomId: 'bedroom-default',
        points: 5,
        description: 'Make your bed neatly',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'bedroom-task-2',
        name: 'Put away clothes', 
        completed: false,
        difficulty: 'medium' as const,
        category: 'cleaning',
        roomId: 'bedroom-default',
        points: 15,
        description: 'Fold and put away all clothes',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'bedroom-task-3',
        name: 'Vacuum floor', 
        completed: false,
        difficulty: 'medium' as const,
        category: 'cleaning',
        roomId: 'bedroom-default',
        points: 15,
        description: 'Vacuum the bedroom floor',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'living-room-default',
    name: 'Living Room',
    icon: faCouch,
    imageUrl: roomImages.livingroom,
    tasks: [
      { 
        id: 'living-room-task-1',
        name: 'Vacuum floor', 
        completed: false,
        difficulty: 'medium' as const,
        category: 'cleaning',
        roomId: 'living-room-default',
        points: 15,
        description: 'Vacuum the living room floor',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'living-room-task-2',
        name: 'Dust surfaces', 
        completed: false,
        difficulty: 'easy' as const,
        category: 'cleaning',
        roomId: 'living-room-default',
        points: 5,
        description: 'Dust all surfaces',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'living-room-task-3',
        name: 'Organize items', 
        completed: false,
        difficulty: 'medium' as const,
        category: 'cleaning',
        roomId: 'living-room-default',
        points: 15,
        description: 'Put away loose items and organize',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'bathroom-default',
    name: 'Bathroom',
    icon: faBath,
    imageUrl: roomImages.bathroom,
    tasks: [
      { 
        id: 'bathroom-task-1',
        name: 'Clean sink', 
        completed: false,
        difficulty: 'easy' as const,
        category: 'cleaning',
        roomId: 'bathroom-default',
        points: 5,
        description: 'Clean the sink and counter',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'bathroom-task-2',
        name: 'Clean toilet', 
        completed: false,
        difficulty: 'hard' as const,
        category: 'cleaning',
        roomId: 'bathroom-default',
        points: 25,
        description: 'Clean toilet thoroughly',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'bathroom-task-3',
        name: 'Clean shower', 
        completed: false,
        difficulty: 'hard' as const,
        category: 'cleaning',
        roomId: 'bathroom-default',
        points: 25,
        description: 'Clean shower and tub',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'kitchen-default',
    name: 'Kitchen',
    icon: faUtensils,
    imageUrl: roomImages.kitchen,
    tasks: [
      { 
        id: 'kitchen-task-1',
        name: 'Wash dishes', 
        completed: false,
        difficulty: 'medium' as const,
        category: 'cleaning',
        roomId: 'kitchen-default',
        points: 15,
        description: 'Wash all dirty dishes',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'kitchen-task-2',
        name: 'Clean counters', 
        completed: false,
        difficulty: 'easy' as const,
        category: 'cleaning',
        roomId: 'kitchen-default',
        points: 5,
        description: 'Wipe down countertops',
        createdAt: new Date().toISOString()
      },
      { 
        id: 'kitchen-task-3',
        name: 'Take out trash', 
        completed: false,
        difficulty: 'easy' as const,
        category: 'cleaning',
        roomId: 'kitchen-default',
        points: 5,
        description: 'Empty and take out trash',
        createdAt: new Date().toISOString()
      }
    ]
  }
];

// New room template for the add room modal
const NEW_ROOM_TEMPLATES = [
  {
    name: 'Bedroom',
    icon: faBed,
    imageUrl: roomImages.bedroom,
    defaultTasks: [
      { name: 'Make the bed', difficulty: 'easy' },
      { name: 'Put away clothes', difficulty: 'medium' },
      { name: 'Vacuum floor', difficulty: 'medium' }
    ]
  },
  {
    name: 'Living Room',
    icon: faCouch,
    imageUrl: roomImages.livingroom,
    defaultTasks: [
      { name: 'Vacuum floor', difficulty: 'medium' },
      { name: 'Dust surfaces', difficulty: 'easy' },
      { name: 'Organize items', difficulty: 'medium' }
    ]
  },
  {
    name: 'Bathroom',
    icon: faBath,
    imageUrl: roomImages.bathroom,
    defaultTasks: [
      { name: 'Clean sink', difficulty: 'easy' },
      { name: 'Clean toilet', difficulty: 'hard' },
      { name: 'Clean shower/tub', difficulty: 'hard' }
    ]
  },
  {
    name: 'Kitchen',
    icon: faUtensils,
    imageUrl: roomImages.kitchen,
    defaultTasks: [
      { name: 'Wash dishes', difficulty: 'medium' },
      { name: 'Clean countertops', difficulty: 'easy' },
      { name: 'Take out trash', difficulty: 'easy' }
    ]
  }
];

// Get difficulty points
const getDifficultyPoints = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 5;
    case 'medium': return 15;
    case 'hard': return 25;
    default: return 5;
  }
};

// Get room icon
const getRoomIcon = (roomName: string) => {
  switch (roomName.toLowerCase()) {
    case 'bedroom': return faBed;
    case 'living room': return faCouch;
    case 'bathroom': return faBath;
    case 'kitchen': return faUtensils;
    default: return faHome;
  }
};

const CleaningModule: React.FC = () => {
  const { rooms, addRoom, deleteRoom, addTask, completeTask, resetTask, deleteTask } = useAppContext();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [customRoomImage, setCustomRoomImage] = useState<string | null>(null);
  const [taskHistory, setTaskHistory] = useState<{
    id: string;
    taskName: string;
    roomName: string;
    difficulty: string;
    points: number;
    completedAt: string;
  }[]>(() => {
    // Try to load history from localStorage on component mount
    const savedHistory = localStorage.getItem('cleaning-task-history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  // Reference to track if default rooms were already added
  const defaultRoomsAddedRef = useRef(false);

  // New state for task history pagination
  const [historyPage, setHistoryPage] = useState(1);
  const tasksPerPage = 5;
  
  // Get paginated history items
  const getPaginatedHistory = () => {
    const startIndex = (historyPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return taskHistory.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalHistoryPages = Math.ceil(Math.max(1, taskHistory.length) / tasksPerPage);

  // Navigation functions
  const goToPrevPage = () => {
    if (historyPage > 1) {
      setHistoryPage(historyPage - 1);
    }
  };

  const goToNextPage = () => {
    if (historyPage < totalHistoryPages) {
      setHistoryPage(historyPage + 1);
    }
  };

  // Initialize with default rooms if no rooms exist
  useEffect(() => {
    // Only add default rooms once and only if no rooms exist
    if (rooms.length === 0 && !defaultRoomsAddedRef.current) {
      defaultRoomsAddedRef.current = true;
      DEFAULT_ROOMS.forEach(room => {
        addRoom(room);
      });
    }
    
    // Set initial active room
    if (!activeRoomId && rooms.length > 0) {
      setActiveRoomId(rooms[0].id);
    } else if (activeRoomId && rooms.length > 0) {
      // Make sure activeRoomId is a valid room
      const roomExists = rooms.some(room => room.id === activeRoomId);
      if (!roomExists) {
        setActiveRoomId(rooms[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms.length, activeRoomId]);

  // Get active room
  const activeRoom = activeRoomId ? rooms.find(room => room.id === activeRoomId) : null;

  // Calculate completion percentage
  const getCompletionPercentage = (room: Room) => {
    if (room.tasks.length === 0) return 0;
    const completedTasks = room.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / room.tasks.length) * 100);
  };

  // Handle image file selection via input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomRoomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drop zone handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomRoomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Update handleAddRoom to use custom image
  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    
    const roomId = generateId();
    // Use selected template or default to first template
    const template = selectedTemplate !== null ? NEW_ROOM_TEMPLATES[selectedTemplate] : NEW_ROOM_TEMPLATES[0];
    
    const newRoom: Room = {
      id: roomId,
      name: newRoomName.trim(),
      imageUrl: customRoomImage || template.imageUrl,
      tasks: template.defaultTasks.map(task => ({
        id: generateId(),
        name: task.name,
        completed: false,
        difficulty: task.difficulty as 'easy' | 'medium' | 'hard',
        category: 'cleaning',
        roomId,
        points: getDifficultyPoints(task.difficulty),
        description: `Task: ${task.name}`,
        createdAt: new Date().toISOString()
      }))
    };
    
    addRoom(newRoom);
    setActiveRoomId(roomId);
    setNewRoomName('');
    setSelectedTemplate(null);
    setCustomRoomImage(null);
    setShowAddRoomModal(false);
  };

  // Handle add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoomId || !newTaskName.trim()) return;
    
    const task: Task = {
      id: generateId(),
      name: newTaskName.trim(),
      completed: false,
      difficulty: newTaskDifficulty,
      category: 'cleaning',
      roomId: activeRoomId,
      points: getDifficultyPoints(newTaskDifficulty),
      description: `Task: ${newTaskName.trim()}`,
      createdAt: new Date().toISOString()
    };
    
    addTask(activeRoomId, task);
    setNewTaskName('');
    setNewTaskDifficulty('medium');
  };

  // Handle toggle task
  const handleToggleTask = (roomId: string, taskId: string, isCompleted: boolean) => {
    if (isCompleted) {
      resetTask(roomId, taskId);
    } else {
      // Find the task and room details before completing it
      const room = rooms.find(r => r.id === roomId);
      const task = room?.tasks.find(t => t.id === taskId);
      
      if (room && task) {
        // Log the task in history
        const historyEntry = {
          id: generateId(),
          taskName: task.name,
          roomName: room.name,
          difficulty: task.difficulty,
          points: task.points,
          completedAt: new Date().toISOString()
        };
        
        // Add to history and persist to localStorage
        setTaskHistory(prev => {
          const newHistory = [historyEntry, ...prev];
          // This will trigger the useEffect to save to localStorage
          return newHistory;
        });
        
        // Mark as complete to earn points
        completeTask(roomId, taskId);
      }
    }
  };

  // First, let's define a function to reset all tasks for a new day
  const handleNewDay = () => {
    if (window.confirm('Reset all tasks for a new day?')) {
      // Loop through all rooms and reset their tasks
      rooms.forEach(room => {
        room.tasks.forEach(task => {
          if (task.completed) {
            resetTask(room.id, task.id);
          }
        });
      });
    }
  };

  // Add an effect to save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cleaning-task-history', JSON.stringify(taskHistory));
  }, [taskHistory]);

  // Add a function to clear history
  const clearTaskHistory = () => {
    if (window.confirm('Are you sure you want to clear your task history?')) {
      setTaskHistory([]);
      // This will trigger the useEffect to save to localStorage
    }
  };

  return (
    <div className="cleaning-module">
      <div className="cleaning-header">
        <h2>
          <img src={cleaningIcon} alt="Cleaning" className="module-icon" />
          <span className="header-title-text">Cleaning Tracker</span>
        </h2>
      </div>

      {/* Room Card Navigation - ALWAYS visible and not duplicated */}
      <div className="room-cards-container">
        {rooms.map(room => {
          const completedCount = room.tasks.filter(t => t.completed).length;
          const completionPercentage = getCompletionPercentage(room);
          const isActive = activeRoomId === room.id;
          
          return (
            <div 
              key={room.id}
              className={`room-card ${isActive ? 'active' : ''}`}
              onClick={() => setActiveRoomId(room.id)}
            >
              <div className="room-card-image" style={{ backgroundImage: `url(${room.imageUrl})` }}>
                <div className="room-card-overlay"></div>
                <div className="room-card-icon">
                  <FontAwesomeIcon icon={getRoomIcon(room.name)} />
                </div>
              </div>
              <div className="room-card-content">
                <h3 className="room-card-name">{room.name}</h3>
                <div className="room-card-progress">
                  <div className="room-card-progress-bar">
                    <div 
                      className="room-card-progress-fill"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="room-card-progress-text">
                    {completedCount}/{room.tasks.length}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div 
          className="room-card add-room-card"
          onClick={() => setShowAddRoomModal(true)}
        >
          <div className="add-room-icon">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="add-room-text">Add Room</div>
        </div>
      </div>

      {/* Selected Room Content */}
      {activeRoom ? (
        <div className="room-detail-container">
          <div className="room-detail-header">
            <h3>{activeRoom.name}</h3>
            <div className="room-detail-actions">
              <div className="room-detail-progress">
                <span>{getCompletionPercentage(activeRoom)}% complete</span>
                <div className="room-detail-progress-bar">
                  <div 
                    className="room-detail-progress-fill"
                    style={{ width: `${getCompletionPercentage(activeRoom)}%` }}
                  ></div>
                </div>
              </div>
              <button 
                className="delete-room-button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this room?')) {
                    deleteRoom(activeRoom.id);
                    setActiveRoomId(rooms.length > 1 ? rooms.filter(r => r.id !== activeRoom.id)[0].id : null);
                  }
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="tasks-container">
            <h4 className="tasks-header">Tasks</h4>
            
            {activeRoom.tasks.length > 0 ? (
              <div className="tasks-list">
                {activeRoom.tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`task-item ${task.difficulty} ${task.completed ? 'completed' : ''}`}
                  >
                    <div 
                      className={`task-checkbox ${task.difficulty} ${task.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleTask(activeRoom.id, task.id, task.completed)}
                    ></div>
                    <div className={`task-name ${task.completed ? 'completed' : ''}`}>{task.name}</div>
                    <div className="task-difficulty">
                      {task.difficulty === 'easy' ? '5 pts' : 
                       task.difficulty === 'medium' ? '15 pts' : '25 pts'}
                    </div>
                    <button 
                      className="task-delete-button"
                      onClick={() => deleteTask(activeRoom.id, task.id)}
                      aria-label="Delete task"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-tasks-message">No tasks yet for this room. Add some below!</div>
            )}
            
            {/* Add Task Form */}
            <form className="add-task-form" onSubmit={handleAddTask}>
              <h4 className="add-task-header">Add a new task</h4>
              <div className="add-task-row">
                <input 
                  type="text"
                  className="task-name-input"
                  placeholder="Enter task name..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                />
                <select
                  className="difficulty-select"
                  value={newTaskDifficulty}
                  onChange={(e) => setNewTaskDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                >
                  <option value="easy">Easy (5 pts)</option>
                  <option value="medium">Medium (15 pts)</option>
                  <option value="hard">Hard (25 pts)</option>
                </select>
                <button 
                  type="submit"
                  className="add-task-button"
                  disabled={!newTaskName.trim()}
                >
                  Add Task
                </button>
              </div>
            </form>

            {/* Add New Day button at the bottom of tasks container */}
            <div className="new-day-button-container">
              <button 
                className="new-day-button"
                onClick={handleNewDay}
              >
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />
                Start New Day
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-room-selected">
          <p>Select a room to view and manage tasks.</p>
        </div>
      )}

      {/* Task History Section - ALWAYS displayed regardless of whether there are tasks */}
      <div className="task-history-container">
        <div className="task-history-header-row">
          <h3 className="task-history-title">History</h3>
          {taskHistory.length > 0 && (
            <button 
              className="clear-history-button"
              onClick={clearTaskHistory}
            >
              Clear History
            </button>
          )}
        </div>
        
        {taskHistory.length > 0 ? (
          <>
            <div className="task-history-list">
              {getPaginatedHistory().map(entry => (
                <div key={entry.id} className={`task-history-item ${entry.difficulty}`}>
                  <div className={`task-history-icon ${entry.difficulty}`}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <div className="task-history-content">
                    <div className="task-history-header">
                      <span className="task-history-name">{entry.taskName}</span>
                      <span className={`task-history-tag ${entry.difficulty}`}>
                        {entry.points} pts
                      </span>
                    </div>
                    <div className="task-history-details">
                      <span className="task-history-room">{entry.roomName}</span>
                      <span className="task-history-date">
                        {new Date(entry.completedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-history-container">
            <div className="empty-history-box-icon">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <p className="empty-history-message">No history yet.</p>
          </div>
        )}
        
        {/* Always show pagination controls even if empty */}
        <div className="history-pagination">
          <button 
            className="pagination-button circular-button"
            onClick={goToPrevPage}
            disabled={historyPage === 1}
            style={{ width: '36px', height: '36px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="pagination-info">
            {historyPage} / {totalHistoryPages}
          </span>
          <button 
            className="pagination-button circular-button"
            onClick={goToNextPage}
            disabled={historyPage === totalHistoryPages}
            style={{ width: '36px', height: '36px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="add-room-modal">
          <div className="modal-content">
            <button 
              className="modal-close-button" 
              onClick={() => {
                setShowAddRoomModal(false);
                setNewRoomName('');
                setSelectedTemplate(null);
                setCustomRoomImage(null);
              }}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <h3>Add a New Room</h3>
            
            <div className="modal-form-group">
              <label htmlFor="room-name" className="modal-form-label">Room Name</label>
              <input
                id="room-name"
                type="text"
                className="task-name-input"
                placeholder="Enter room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            
            <div className="upload-section">
              <div className="template-section-title">Upload Room Image</div>
              <div 
                className={`image-drop-zone ${customRoomImage ? 'has-image' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {customRoomImage ? (
                  <div className="preview-container">
                    <img src={customRoomImage} alt="Room preview" className="image-preview" />
                    <button 
                      className="clear-image-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomRoomImage(null);
                        setSelectedTemplate(null);
                      }}
                      aria-label="Clear image"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} className="upload-icon" />
                    <p>Drag and drop an image here</p>
                    <p>or</p>
                    <label htmlFor="image-upload" className="upload-button">
                      Browse Files
                      <input 
                        type="file" 
                        id="image-upload" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowAddRoomModal(false);
                  setNewRoomName('');
                  setSelectedTemplate(null);
                  setCustomRoomImage(null);
                }}
              >
                Cancel
              </button>
              <button
                className="add-room-button-modal"
                onClick={handleAddRoom}
                disabled={!newRoomName.trim()}
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleaningModule;
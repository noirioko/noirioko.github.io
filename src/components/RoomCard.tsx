import React, { useState } from 'react';
import { Room, Task } from '../types';
import TaskItem from './TaskItem';
import { useAppContext } from '../contexts/AppContext';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const { addTask } = useAppContext();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        completed: false,
        difficulty: newTaskDifficulty,
        category: 'custom',
        createdAt: new Date().toISOString(),
        points: getDifficultyPoints(newTaskDifficulty),
        roomId: room.id,
        description: `Task: ${newTaskName.trim()}`
      };
      
      addTask(room.id, newTask);
      setNewTaskName('');
      setNewTaskDifficulty('easy');
    }
  };

  // Helper function to get points based on difficulty
  const getDifficultyPoints = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    switch (difficulty) {
      case 'easy': return 5;
      case 'medium': return 15;
      case 'hard': return 25;
      default: return 5;
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const completedTasksCount = room.tasks.filter(task => task.completed).length;
  const totalTasksCount = room.tasks.length;

  return (
    <div className="card room-card cleaning-task-container">
      <div className="room-header" onClick={toggleExpand}>
        <h3>{room.name}</h3>
        <div className="task-progress">
          <span>{completedTasksCount} / {totalTasksCount}</span>
          <span className={isExpanded ? 'chevron-down' : 'chevron-right'}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="room-content">
          <div className="task-list">
            {room.tasks.map(task => (
              <TaskItem key={task.id} task={task} roomId={room.id} />
            ))}
          </div>
          
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add a new task..."
              className="task-input"
            />
            
            <select
              value={newTaskDifficulty}
              onChange={(e) => setNewTaskDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="difficulty-select"
            >
              <option value="easy">Easy (5 pts)</option>
              <option value="medium">Medium (15 pts)</option>
              <option value="hard">Hard (25 pts)</option>
            </select>
            
            <button type="submit" className="add-button">Add</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomCard; 
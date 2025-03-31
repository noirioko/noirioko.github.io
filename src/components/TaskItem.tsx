import React from 'react';
import { Task } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface TaskItemProps {
  task: Task;
  roomId: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, roomId }) => {
  const { completeTask, resetTask } = useAppContext();

  const handleToggle = () => {
    if (task.completed) {
      resetTask(roomId, task.id);
    } else {
      completeTask(roomId, task.id);
    }
  };

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return '(5 pts)';
      case 'medium':
        return '(15 pts)';
      case 'hard':
        return '(25 pts)';
      default:
        return '';
    }
  };

  return (
    <div className={`cleaning-task-item ${task.difficulty} ${task.completed ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
        />
        <span className="task-name">{task.name}</span>
        <span className="task-difficulty">{getDifficultyLabel(task.difficulty)}</span>
      </label>
    </div>
  );
};

export default TaskItem; 
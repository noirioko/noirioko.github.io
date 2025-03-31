import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Room } from '../types';

const AddRoom: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const { addRoom } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: roomName.trim(),
        tasks: []
      };
      addRoom(newRoom);
      setRoomName('');
      setIsFormVisible(false);
    }
  };

  return (
    <div className="add-room-container">
      {!isFormVisible ? (
        <button 
          className="add-room-button"
          onClick={() => setIsFormVisible(true)}
        >
          + Add New Room
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-room-form card">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name..."
            className="room-input"
            autoFocus
          />
          <div className="form-buttons">
            <button type="button" onClick={() => setIsFormVisible(false)}>Cancel</button>
            <button type="submit">Add Room</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddRoom; 
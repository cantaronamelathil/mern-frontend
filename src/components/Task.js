import React, { useState } from 'react';
import axios from 'axios';

const Task = ({ fetchTasks }) => {
  const [taskText, setTaskText] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      alert('Task description is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please login.');
        return;
      }

      await axios.post(
        'http://localhost:8000/api/user/createTodo',
        { text: taskText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Task added successfully');
      setTaskText(''); // Clear input
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error adding task:', error.response?.data?.message || error.message);
      alert('Failed to add task');
    }
  };

  return (
    <div className="flex justify-center my-4">
      <form onSubmit={handleAddTask} className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-80" // Longer input
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default Task;

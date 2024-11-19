import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from '../components/Task';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('User');
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please login.');
        return;
      }
     
      const response = await axios.get('http://localhost:8000/api/user/listTodo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(response.data.username || 'User');
      setTasks(response.data.tasks || []); 
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data?.message || error.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/user/createTodo',
        { text: newTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/user/deleteTodo/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/user/editTodo/${taskId}`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingTask(null);
      setEditText('');
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleCheckboxChange = async (taskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/api/user/updateTodo/${taskId}`, 
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  // Add this function inside the Home component
const handleCreateSummary = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:8000/api/user/summaryCreate',
      { projectTitle: `${username}'s Todo List` },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Open the gist in a new tab
    if (response.data?.gistUrl) {
      window.open(response.data.gistUrl, '_blank');
    }
  } catch (error) {
    console.error('Error creating summary:', error);
  }
};

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);


  return (
    <div className="container mx-auto mt-8 p-4">
      
      <h1 className="text-3xl font-bold text-center mb-8">Welcome, {username}</h1>

        <div className="text-center mb-6">
          <span className="bg-gray-100 rounded-lg px-4 py-2">
            Summary: {completedTasks.length} / {tasks.length} tasks
          </span>
          <button 
            onClick={handleCreateSummary}
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create GitHub Summary
          </button>
        </div>
      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Task
          </button>
        </div>
      </form>

      <div className="mt-8">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks added</p>
        ) : (
          <div>
            <h2 className="text-xl font-semibold">Pending Tasks</h2>
            <ul className="list-none">
              {pendingTasks.map((task) => (
                <li key={task._id} className="flex items-center justify-between border-b py-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(task._id, task.completed)}
                      className="h-4 w-4"
                    />
                    {editingTask === task._id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      <span>{task.text}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                      <span className="ml-4">Updated: {new Date(task.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {editingTask === task._id ? (
                      <button
                        onClick={() => handleEditTask(task._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTask(task._id);
                          setEditText(task.text);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            <h2 className="text-xl font-semibold mt-6">Completed Tasks</h2>
            <ul className="list-none">
              {completedTasks.map((task) => (
                <li key={task._id} className="flex items-center justify-between border-b py-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(task._id, task.completed)}
                      className="h-4 w-4"
                    />
                    <span className="text-green-600">{task.text}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                     <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                      <span className="ml-4">Updated: {new Date(task.updatedAt).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

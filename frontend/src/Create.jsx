import React, { useState } from 'react';
import axios from 'axios';

function Create({ refresh }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !description.trim()) return alert("Title and Description can't be empty!");
    
    const newTask = {
      title,
      description,
      completed: false,
    };

    axios.post('http://localhost:8080/api/tasks', newTask)
      .then(() => {
        setTitle('');
        setDescription('');
        refresh(); // Làm mới danh sách
      })
      .catch(error => console.error('Error adding task:', error));
  };

  return (
    <div className="create_form">
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
}

export default Create;

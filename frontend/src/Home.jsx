import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Create from './Create';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil, BsCheck, BsX } from 'react-icons/bs';

function Home() {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Lấy danh sách công việc
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  };

  // ✅ Cập nhật trạng thái completed (hoàn thành)
  const handleToggle = (id) => {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    axios.put(`http://localhost:8080/api/tasks/${id}`, {
      title: todo.title,
      description: todo.description,
      completed: !todo.completed,
    })
      .then(fetchTodos)
      .catch(error => console.error('Error updating task:', error));
  };

  // ✅ Xóa công việc
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(fetchTodos)
      .catch(error => console.error('Error deleting task:', error));
  };

  // ✅ Kích hoạt chế độ chỉnh sửa
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  // ✅ Hủy chỉnh sửa
  const handleCancel = () => {
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // ✅ Lưu cập nhật công việc
  const handleSave = (id) => {
    axios.put(`http://localhost:8080/api/tasks/${id}`, {
      title: editTitle,
      description: editDescription,
      completed: todos.find(todo => todo.id === id).completed,
    })
      .then(() => {
        fetchTodos();
        setEditId(null);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  return (
    <div className="home">
        <h1>QUẢN LÝ CÔNG VIỆC</h1>
      <Create refresh={fetchTodos} />
      {todos.length === 0 ? (
        <p>No tasks found. Add a new one!</p>
      ) : (
        todos.map(todo => (
          <div key={todo.id} className="task">
            {/* Checkbox để cập nhật trạng thái hoàn thành */}
            <div className="checkbox" onClick={() => handleToggle(todo.id)}>
              {todo.completed ? (
                <BsFillCheckCircleFill className="icon completed" />
              ) : (
                <BsCircleFill className="icon" />
              )}
            </div>

            {/* Hiển thị Input khi ở chế độ chỉnh sửa */}
            <div className="task-content">
              {editId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <p className={todo.completed ? 'line_through' : ''}>{todo.title}</p>
                  <small>{todo.description}</small>
                </>
              )}
            </div>

            {/* Nút hành động */}
            <div className="actions">
              {editId === todo.id ? (
                <>
                  <BsCheck className="icon save" onClick={() => handleSave(todo.id)} />
                  <BsX className="icon cancel" onClick={handleCancel} />
                </>
              ) : (
                <>
                  <BsPencil className="icon edit" onClick={() => handleEdit(todo)} />
                  <BsFillTrashFill className="icon delete" onClick={() => handleDelete(todo.id)} />
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;

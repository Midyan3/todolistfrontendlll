import React, { useState } from 'react';

function TodoList({ todos, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleUpdate = (id) => {
    onUpdate(id, { title: editTitle, description: editDescription });
    setEditId(null);
  };

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <div key={todo._id} className="border p-4 rounded">
          {editId === todo._id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(todo._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold">{todo.title}</h3>
              <p className="text-gray-600">{todo.description}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(todo._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodoList;
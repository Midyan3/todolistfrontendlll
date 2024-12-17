import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, Calendar, CheckCircle, MoreHorizontal, X, ExternalLink } from 'lucide-react';
function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [backendURL, setBackendURL] = useState('https://todolistweb5-41e1595ff61a.herokuapp.com/');
  const [showRoutes, setShowRoutes] = useState(false);
  const apiRoutes = [
    { method: 'GET', path: 'api/todos', desc: 'Get all todos' },
    { method: 'GET', path: 'api/todos/:id', desc: 'Get single todo' },
    { method: 'POST', path: 'api/todos', desc: 'Create new todo' },
    { method: 'PATCH', path: 'api/todos/:id', desc: 'Update todo' },
    { method: 'DELETE', path: 'api/todos/:id', desc: 'Delete todo' },
    { method: 'PATCH', path: 'api/todos/:id/toggle', desc: 'Toggle todo status' }
  ];

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${backendURL}api/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.patch(`${backendURL}api/todos/${editId}`, {
          title,
          description,
        });
        setEditId(null);
      } else {
        await axios.post(`${backendURL}api/todos`, {
          title,
          description,
        });
      }
      setTitle('');
      setDescription('');
      setIsFormVisible(false);
      fetchTodos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setTitle(todo.title);
    setDescription(todo.description);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendURL}api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await axios.patch(`${backendURL}api/todos/${todo._id}/toggle`);
      setTodos(todos.map(t => t._id === todo._id ? response.data : t));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRouteClick = (path) => {
    const url = `${backendURL}${path}`;
    window.open(url, '_blank');
  };

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === 'all') return true;
    return todo.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b2b2b] via-[#1e1e1e] to-[#2d1d24]">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#ffffff05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium text-white/90">
                Task Manager
              </h1>
              <button
                onClick={() => setShowRoutes(true)}
                className="text-sm px-3 py-1 rounded-lg bg-[#ffffff10] text-white/70 hover:text-white/90 hover:bg-[#ffffff15] transition-all duration-300"
              >
                API Routes
              </button>
            </div>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#ffffff15] text-white/90 hover:bg-[#ffffff20] transition-all duration-300"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </header>
      {showRoutes && (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn"
        onClick={() => setShowRoutes(false)}
      >
        <div 
          className="bg-[#1a1a1a] rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-[#ffffff15]
                    animate-slideUp transform-gpu"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-white/90">API Routes</h2>
            <button
              onClick={() => setShowRoutes(false)}
              className="p-2 hover:bg-[#ffffff10] rounded-lg transition-all duration-300 hover:rotate-90"
            >
              <X size={20} className="text-white/70" />
            </button>
          </div>
          <div className="space-y-3">
            {apiRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => handleRouteClick(route.path.replace(':id', '123'))}
                className="w-full bg-[#ffffff08] rounded-lg p-4 flex items-start justify-between group 
                        hover:bg-[#ffffff10] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded transform transition-all duration-300 group-hover:scale-110 ${
                    route.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                    route.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                    route.method === 'PATCH' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {route.method}
                  </span>
                  <span className="text-white/90 font-mono text-sm">{route.path}</span>
                  <ExternalLink size={14} className="text-white/30 group-hover:text-white/90 transform transition-all duration-300 group-hover:translate-x-1" />
                </div>
                <span className="text-white/50 text-sm group-hover:text-white/70 transition-all duration-300">
                  {route.desc}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm">
              Base URL: 
              <button 
                onClick={() => window.open(backendURL, '_blank')}
                className="text-white/90 font-mono break-all ml-2 hover:text-white transition-all duration-300 hover:underline"
              >
                {backendURL}
              </button>
            </p>
          </div>
        </div>
      </div>
    )}

      <div className={`fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-in-out z-50 ${isFormVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="backdrop-blur-2xl bg-[#ffffff08] rounded-t-2xl shadow-2xl max-w-5xl mx-auto border border-[#ffffff15]">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input
              type="text"
              placeholder="Task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-[15px] rounded-xl bg-[#ffffff08] border border-[#ffffff15] text-white/90 placeholder-white/50 focus:bg-[#ffffff10] focus:border-[#ffffff25] transition-all duration-300"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 text-[15px] rounded-xl bg-[#ffffff08] border border-[#ffffff15] text-white/90 placeholder-white/50 focus:bg-[#ffffff10] focus:border-[#ffffff25] transition-all duration-300 resize-none h-28"
            />
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#4361ee] to-[#3a0ca3] text-white py-3 rounded-xl text-[15px] font-medium hover:opacity-90 transition-all duration-300"
              >
                {editId ? 'Update' : 'Add Task'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormVisible(false);
                  setEditId(null);
                  setTitle('');
                  setDescription('');
                }}
                className="flex-1 bg-[#ffffff10] text-white/90 py-3 rounded-xl text-[15px] font-medium hover:bg-[#ffffff15] transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium capitalize whitespace-nowrap transition-all duration-300 ${
                filterStatus === status
                  ? 'bg-[#ffffff15] text-white shadow-lg'
                  : 'bg-[#ffffff08] text-white/70 hover:bg-[#ffffff10]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white/90"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-white/50">No tasks yet</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className="backdrop-blur-xl bg-[#ffffff08] rounded-xl border border-[#ffffff15] overflow-hidden group hover:bg-[#ffffff10] transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded-lg border transition-all duration-300 flex items-center justify-center ${
                        todo.status === 'completed'
                          ? 'border-[#4361ee] bg-[#4361ee]'
                          : 'border-[#ffffff30] hover:border-[#ffffff50]'
                      }`}
                    >
                      {todo.status === 'completed' && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-[15px] font-medium mb-1 ${
                        todo.status === 'completed' ? 'text-white/50 line-through' : 'text-white/90'
                      }`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-[13px] mb-2 ${
                          todo.status === 'completed' ? 'text-white/40 line-through' : 'text-white/70'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center text-[12px] text-white/50">
                        <Calendar size={12} className="mr-1" />
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="p-2 text-white/50 hover:text-white/90 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff15] transition-all duration-300"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="p-2 text-white/50 hover:text-white/90 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff15] transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-white/50 hover:text-white/90 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff15] transition-all duration-300">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
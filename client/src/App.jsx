import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://mern-cloud-app-1.onrender.com/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!text) return;
    await axios.post(API_URL, { text });
    setText("");
    fetchTodos();
  };
  const deleteTodo = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  fetchTodos();
};

const editTodo = async (id) => {
  const newText = prompt("Edit todo:", todos.find(t => t._id === id).text);
if (!newText) return;
await axios.put(`${API_URL}/${id}`, { text: newText });
  fetchTodos();
};

  return (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Cloud Todo App ☁️</h1>

      {/* Input + Add Button */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 rounded text-black"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New todo"
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Todos List */}
      <ul className="space-y-2">
  {todos.map(todo => (
    <li
      key={todo._id}
      className="bg-gray-700 px-3 py-2 rounded flex justify-between items-center"
    >
      {editingId === todo._id ? (
        // Show input field when editing
        <input
          className="flex-1 px-2 py-1 rounded text-black"
          value={editingText}
          onChange={e => setEditingText(e.target.value)}
        />
      ) : (
        // Otherwise, just show text
        <span>{todo.text || todo.title}</span>
      )}

      <div className="flex gap-2">
        {editingId === todo._id ? (
          <button
            className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 text-black text-sm"
            onClick={async () => {
              await axios.put(`${API_URL}/${todo._id}`, { title: editingText });
              setEditingId(null);
              fetchTodos();
            }}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 text-black text-sm"
            onClick={() => {
              setEditingId(todo._id);
              setEditingText(todo.text || todo.title);
            }}
          >
            Edit
          </button>
        )}

        <button
          className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-sm"
          onClick={() => deleteTodo(todo._id)}
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  </div>
);

}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://mern-cloud-app-1.onrender.com/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null); // <-- track which todo is being edited
  const [editingText, setEditingText] = useState(""); // <-- store the text being edited

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (!text) return;
    try {
      await axios.post(API_URL, { text });
      setText("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const saveEdit = async (id) => {
    if (!editingText) return;
    try {
      await axios.put(`${API_URL}/${id}`, { text: editingText });
      setEditingId(null);
      setEditingText("");
      fetchTodos();
    } catch (err) {
      console.error("Error editing todo:", err);
    }
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
            onChange={(e) => setText(e.target.value)}
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
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-gray-700 px-3 py-2 rounded flex justify-between items-center"
            >
              {editingId === todo._id ? (
                <input
                  className="flex-1 px-2 py-1 rounded text-black"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
              ) : (
                <span>{todo.text}</span>
              )}

              <div className="flex gap-2">
                {editingId === todo._id ? (
                  <button
                    className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 text-black text-sm"
                    onClick={() => saveEdit(todo._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 text-black text-sm"
                    onClick={() => {
                      setEditingId(todo._id);
                      setEditingText(todo.text);
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

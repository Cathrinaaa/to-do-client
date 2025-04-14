import { useState } from "react";

export default function AddModal({ hide, refreshTasks }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [message, setMessage] = useState("");

  const apiUrl = import.meta.env.VITE_ENDPOINT_URL;

  const addTask = () => setTasks([...tasks, ""]);
  const removeTask = (index) => setTasks(tasks.filter((_, i) => i !== index));

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async () => {
    const loggedInUser = localStorage.getItem("username");
  
    if (!loggedInUser) {
      setMessage("User not logged in!");
      return;
    }
  
    if (!title.trim()) {
      setMessage("Title cannot be empty");
      return;
    }
  
    const filteredTasks = tasks.filter(task => task.trim() !== "");
  
    if (filteredTasks.length === 0) {
      setMessage("You must add at least one task!");
      return;
    }
  
    const payload = {
      username: loggedInUser,
      title,
      lists: filteredTasks,
    };
  
    try {
      const response = await fetch(`${apiUrl}/add-to-do`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      setMessage(data.message);
  
      if (data.success) {
        setTimeout(() => {
          refreshTasks(); // Fetch fresh data from the database
          hide();
        }, 1000);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setMessage("Failed to add task, please try again.");
    }
  };
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-900">Add Task</h3>
          <button onClick={hide} className="text-purple-500 hover:text-pink-700">
            <svg className="h-4 w-4 inline-block ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {message && (
          <div className="p-2 mb-3 text-sm text-center text-white bg-purple-500 rounded-md">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700">Task Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className="w-full mt-1 p-2 border border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-purple-900 placeholder-purple-400"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-purple-700">Task List</label>
            <div className="space-y-2 max-h-30 overflow-y-auto">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2 w-full">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className="p-2 border border-purple-300 rounded-md w-full text-purple-900"
                    placeholder={`Task ${index + 1}`}
                  />
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(index)}
                      className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={addTask} className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Add Task
          </button>

          <button onClick={handleSubmit} className="w-full mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

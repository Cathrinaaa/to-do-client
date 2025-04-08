import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddModal from "../components/AddModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

function Todo() {
  const [titles, setTitles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks from the database
  const getTitles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-titles`);
      if (response.data.titles) {
        setTitles(
          response.data.titles.map((task) => ({
            ...task,
            done: Boolean(task.status), // Ensure correct boolean conversion
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  useEffect(() => {
    getTitles();
  }, []);

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const { data } = await axios.post(`${apiUrl}/delete-to-do`, {
        title_id: taskId,
      });

      if (data.success) {
        setTitles((prevTitles) =>
          prevTitles.filter((task) => task.id !== taskId)
        );
      } else {
        console.error("Failed to delete task:", data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle task completion
  const handleTaskCompletion = async (taskId, isCompleted) => {
    try {
      await axios.post(`${apiUrl}/update-status`, {
        title_id: taskId,
        status: isCompleted ? 1 : 0, // Convert boolean to 1 or 0 for the database
      });

      // Update the frontend state
      setTitles((prevTitles) =>
        prevTitles.map((task) =>
          task.id === taskId ? { ...task, done: isCompleted } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-gradient-to-br from-purple-400 to-pink-400 p-5 overflow-hidden">

      {/* Header with Logout Button */}
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 flex items-center">
          📝 To Do List
        </h1>
        <button
          className="bg-pink-300 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>

      {/* Ongoing and Done Sections */}
      <div className="w-full flex justify-center space-x-6">
        {/* Ongoing Section */}
        <div className="w-1/3 bg-white shadow-2xl rounded-lg p-6 border-3 border-purple-700">
          <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            📌 Ongoing
          </h2>
          <div className="max-h-[300px] overflow-y-auto">
            {titles.filter((task) => !task.done).length > 0 ? (
              titles
                .filter((task) => !task.done)
                .map((task) => (
                  <div key={task.id} className="flex items-center w-full mb-3">
                    <div
                      className="flex-1 bg-purple-500 text-white text-center py-3 rounded-lg hover:bg-purple-600 transition-all cursor-pointer transform hover:scale-95"
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.title}
                    </div>
                    <button
                      className="ml-3 bg-pink-300 hover:bg-pink-600 text-white px-3 py-2 rounded-lg text-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No To Do List available</p>
            )}
          </div>

          <button
            className="w-full bg-pink-500 text-white py-3 rounded-lg mt-4 hover:bg-pink-600 transition-all flex items-center justify-center"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Task
          </button>
        </div>

        {/* Done Section */}
        <div className="w-1/3 bg-white shadow-2xl rounded-lg p-6 border-3 border-purple-700">
          <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            ✅ Completed
          </h2>
          <div className="max-h-[400px] overflow-y-auto">
            {titles.filter((task) => task.done).length > 0 ? (
              titles
                .filter((task) => task.done)
                .map((task) => (
                  <div key={task.id} className="flex items-center w-full mb-3">
                    <div
                      className="flex-1 bg-purple-300 text-purple-800 text-center py-3 rounded-lg cursor-pointer"
                    >
                      ✔️ {task.title}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks completed</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <AddModal hide={() => setShowModal(false)} refreshTasks={getTitles} />
      )}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          hide={() => setSelectedTask(null)}
          onTaskCompletion={handleTaskCompletion}
        />
      )}
    </div>
  );
}

export default Todo;
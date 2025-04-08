import React, { useEffect, useState } from "react";
import axios from "axios";


function TaskDetailsModal({ task, hide, onTaskCompletion }) {
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemText, setEditedItemText] = useState("");

  useEffect(() => {
    if (task?.id) {
      axios
        .get(`${apiUrl}/get-task-list/${task.id}`)
        .then((response) => {
          if (Array.isArray(response.data.list)) {
            setList(response.data.list);
          } else {
            setList([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching task list:", error);
          setList([]);
        });
    }
  }, [task]);

  const toggleStatus = async (index, item) => {
    const newStatus = !item.status;

    if (!item.id) {
      console.error("List item ID is missing");
      return;
    }

    const payload = {
      title_id: task.id,
      id: item.id,
      status: newStatus
    };

    try {
      const response = await axios.post(`${apiUrl}/update-status`, payload);

      if (response.data.success) {
        const updatedList = list.map((listItem, i) =>
          i === index ? { ...listItem, status: newStatus } : listItem
        );
        setList(updatedList);

        const allCompleted = updatedList.every((item) => item.status);
        onTaskCompletion(task.id, allCompleted);
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const addNewItem = async () => {
    if (!newItem.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/add-list-item`, {
        title_id: task.id,
        list_desc: newItem,
      });

      if (response.data.success) {
        const newListItem = { id: response.data.id, list_desc: newItem, status: false };
        setList([...list, newListItem]);
        setNewItem("");
        onTaskCompletion(task.id, false);
      } else {
        console.error("Failed to add new item:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  const deleteTask = async (index, item) => {
    if (!item || !item.id) {
      console.error("List item is missing or ID is undefined");
      return;
    }

    try {
      const response = await axios.delete(`${apiUrl}/delete-list-item/${item.id}`);

      if (response.data.success) {
        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList);

        const allCompleted = updatedList.length > 0 && updatedList.every((task) => task.status);
        onTaskCompletion(task.id, allCompleted);
      } else {
        console.error("Failed to delete list item:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting list item:", error);
    }
  };

  const startEditingTitle = () => {
    setEditedTitle(task.title);
    setIsEditingTitle(true);
  };

  const saveEditedTitle = async () => {
    try {
      const response = await axios.post(`${apiUrl}/update-task-title`, {
        id: task.id,
        title: editedTitle
      });

      if (response.data.success) {
        task.title = editedTitle;
        setIsEditingTitle(false);
      } else {
        console.error("Failed to update title:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditedItemText(item.list_desc);
  };

  const saveEditedItem = async () => {
    try {
      const response = await axios.post(`${apiUrl}/update-list-item`, {
        id: editingItemId,
        list_desc: editedItemText
      });

      if (response.data.success) {
        const updatedList = list.map(item => 
          item.id === editingItemId ? { ...item, list_desc: editedItemText } : item
        );
        setList(updatedList);
        setEditingItemId(null);
        setEditedItemText("");
      } else {
        console.error("Failed to update list item:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating list item:", error);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 text-xl font-bold text-purple-700 border-b-2 border-purple-500 px-0 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded"
                autoFocus
              />
              <div className="flex gap-1">
                <button
                  onClick={saveEditedTitle}
                  className="bg-pink-300 hover:bg-pink-400 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="bg-purple-400 hover:bg-pink-500 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-purple-700">{task.title}</h2>
              <button
                onClick={startEditingTitle}
                className="text-gray-500 hover:text-purple-700 transition-colors p-1 rounded-full hover:bg-purple-100"
                title="Edit title"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          )}
          {/* <button
            className="text-gray-500 hover:text-gray-700 text-xl p-1 rounded-full hover:bg-gray-200 transition-colors"
            onClick={hide}
          >
            &times;
          </button> */}
        </div>

        {/* List Items */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Task List:</h3>
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {list.length > 0 ? (
            <ul className="space-y-2">
              {list.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleStatus(index, item)}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${item.status
                        ? "border-green-500 bg-green-500"
                        : "border-gray-400 bg-transparent"
                        } transition-colors flex-shrink-0`}
                    >
                      {item.status && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </button>
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input
                          type="text"
                          value={editedItemText}
                          onChange={(e) => setEditedItemText(e.target.value)}
                          className="flex-1 border-b-2 border-purple-500 bg-transparent px-1 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded min-w-0"
                          autoFocus
                        />
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={saveEditedItem}
                            className="bg-pink-300 hover:bg-pink-400 text-white px-2 py-1 rounded text-sm transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="bg-purple-400 hover:bg-purple-500 text-white px-2 py-1 rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`text-gray-700 flex-1 truncate ${item.status ? "line-through opacity-75" : ""
                          }`}
                        title={item.list_desc}
                      >
                        {item.list_desc}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 ml-2 flex-shrink-0">
                    {editingItemId !== item.id && (
                      <button
                        onClick={() => startEditingItem(item)}
                        className="text-gray-500 hover:text-purple-700 transition-colors p-1 rounded-full hover:bg-purple-100"
                        title="Edit item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}
                    <button
                      className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                      onClick={() => deleteTask(index, item)}
                      title="Delete item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4 italic">No list items available.</p>
          )}
        </div>

        {/* Input for Adding New List Items */}
        <div className="mt-auto flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Add new list item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNewItem()}
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={addNewItem}
          >
            Add
          </button>
        </div>

        {/* Close Modal Button */}
        <button
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          onClick={hide}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
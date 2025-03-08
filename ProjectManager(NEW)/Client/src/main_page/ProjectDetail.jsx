import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTasks, FaFolderOpen, FaPlus, FaTrash, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import head_logo from "/logo.png";

const Navbar = () => (
  <header className="flex justify-center items-center p-4 bg-white shadow-md w-full">
    <input
      type="text"
      placeholder="Search..."
      className="p-2 border rounded-lg w-full max-w-md"
    />
  </header>
);

const Sidebar = ({ sidebarOpen }) => (
  <div
    className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-4 transform transition-transform duration-300 ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 md:relative`}
  >
    <img src={head_logo} alt="Logo" className="h-[100px] mx-auto mb-4" />

    <nav className="space-y-2">
      {[
        { to: "/dashboard", icon: <FaTasks />, label: "Dashboard" },
      ].map((item, index) => (
        <NavItem key={index} {...item} />
      ))}
    </nav>
  </div>
);

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg !no-underline ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
      }`
    }
  >
    {icon} <span className="ml-3">{label}</span>
  </NavLink>
);

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const foundProject = savedProjects.find((proj) => proj.id === parseInt(projectId));
    setProject(foundProject);
  }, [projectId]);

  const saveProjectToLocalStorage = (updatedProject) => {
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const updatedProjects = savedProjects.map((proj) =>
      proj.id === updatedProject.id ? updatedProject : proj
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const openModal = (column, task = null) => {
    setSelectedColumn(column);
    setEditTask(task);
    setIsModalOpen(true);
  };

  const deleteTask = (taskId) => {
    setProject((prevProject) => {
      const updatedProject = {
        ...prevProject,
        tasks: prevProject.tasks.filter((task) => task.id !== taskId),
      };
      saveProjectToLocalStorage(updatedProject);
      return updatedProject;
    });
  };

  const addTask = (task) => {
    setProject((prevProject) => {
      const updatedProject = {
        ...prevProject,
        tasks: [...prevProject.tasks, task],
      };
      saveProjectToLocalStorage(updatedProject);
      return updatedProject;
    });
  };

  const updateTask = (updatedTask) => {
    setProject((prevProject) => {
      const updatedProject = {
        ...prevProject,
        tasks: prevProject.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
      };
      saveProjectToLocalStorage(updatedProject);
      return updatedProject;
    });
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar sidebarOpen={true} />
      <div className="flex flex-col flex-grow p-6 bg-gray-100 items-center w-full h-screen">
        <Navbar />
        <div className="w-full max-w-6xl">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-2xl cursor-pointer mb-6 text-blue-600 hover:text-blue-800 pt-5"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h2 className="text-4xl font-semibold mb-6">{project.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {["To Do", "In Progress", "Completed"].map((title, index) => (
              <TaskColumn
                key={index}
                title={title}
                tasks={project.tasks}
                openModal={openModal}
                deleteTask={deleteTask}
                setEditTask={setEditTask}
              />
            ))}
          </div>
          {isModalOpen && (
            <TaskModal
              closeModal={() => {
                setIsModalOpen(false);
                setEditTask(null);
              }}
              column={selectedColumn}
              addTask={addTask}
              editTask={editTask}
              updateTask={updateTask}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, openModal, deleteTask, setEditTask }) => (
  <div className="bg-white p-6 shadow-md rounded-lg w-full min-h-[300px] border-2">
    <h4 className="text-lg font-semibold mb-6 flex justify-between items-center">
      {title}
      <button
        className="p-2 bg-blue-600 cursor-pointer text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
        onClick={() => openModal(title)}
      >
        <FaPlus className="w-5 h-5" />
      </button>
    </h4>
    <div className="space-y-4">
      {tasks
        .filter((task) => task.status === title)
        .map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            openModal={openModal}
          />
        ))}
    </div>
  </div>
);

const TaskCard = ({ task, deleteTask, openModal }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md flex justify-between items-center relative">
      <div>
        <p className="font-semibold">{task.title}</p>
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      </div>
      <div className="relative">
        <FaEllipsisV
          className="cursor-pointer text-gray-600"
          onClick={() => setShowOptions(!showOptions)}
        />
        {showOptions && (
          <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                openModal(task.status, task);
                setShowOptions(false);
              }}
            >
              Edit
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskModal = ({ closeModal, column, addTask, editTask, updateTask }) => {
  const [taskTitle, setTaskTitle] = useState(editTask ? editTask.title : "");
  const [description, setDescription] = useState(editTask ? editTask.description : "");

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;

    if (editTask) {
      updateTask({
        ...editTask,
        title: taskTitle,
        description,
      });
    } else {
      addTask({
        id: Date.now(),
        title: taskTitle,
        description,
        status: column,
      });
    }

    setTaskTitle("");
    setDescription("");
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">
          {editTask ? "Edit Task" : "Add Task to " + column}
        </h3>

        <label className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          rows="3"
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-400 cursor-pointer text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg"
          >
            {editTask ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
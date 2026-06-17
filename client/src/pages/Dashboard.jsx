import { useEffect, useState } from "react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import BoardCard from "../components/BoardCard";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [boardId, setBoardId] = useState("");
  const [newBoard, setNewBoard] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
    fetchBoards();
    fetchTasks();
    fetchProfile();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await API.get("/boards");

      setBoards(res.data);

      if (res.data.length > 0 && !boardId) {
        setBoardId(res.data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      setRole(res.data.role);
    } catch (error) {
      console.log(error);
    }
  };

  const createBoard = async () => {
    try {
      if (!newBoard.trim()) return;

      const res = await API.post("/boards", {
        title: newBoard,
      });

      setNewBoard("");

      await fetchBoards();

      if (res.data?._id) {
        setBoardId(res.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await API.post("/tasks", {
        title,
        description,
        board: boardId,
      });

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}/status`, {
        status,
      });
    } catch (error) {
      console.log(error);

      fetchTasks();
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const newStatus = result.destination.droppableId;

    const taskId = result.draggableId;

    if (result.source.droppableId === newStatus) {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );

    try {
      await changeStatus(taskId, newStatus);
    } catch {
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(
    (task) => task.board && String(task.board._id) === String(boardId),
  );

  const todoTasks = filteredTasks.filter((task) => task.status === "todo");

  const progressTasks = filteredTasks.filter(
    (task) => task.status === "inprogress",
  );

  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed",
  );

  return (
    <div className="dashboard">
      <Navbar role={role} />

      <div className="welcome-card">
        <h2> Project Management Dashboard</h2>

        <p>Track projects, manage tasks and monitor progress in one place.</p>

        <p>📌 Drag tasks between columns to update their status.</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>📋 Total Tasks</h3>

          <h1>{filteredTasks.length}</h1>
        </div>

        <div className="stat-card">
          <h3>📝 To Do</h3>

          <h1>{todoTasks.length}</h1>
        </div>

        <div className="stat-card">
          <h3>⚡ In Progress</h3>

          <h1>{progressTasks.length}</h1>
        </div>

        <div className="stat-card">
          <h3>✅ Completed</h3>

          <h1>{completedTasks.length}</h1>
        </div>
      </div>

      {role === "admin" && (
        <div className="create-board">
          <input
            type="text"
            placeholder="Create New Board"
            value={newBoard}
            onChange={(e) => setNewBoard(e.target.value)}
          />

          <button onClick={createBoard}>Create Board</button>
        </div>
      )}

      <div className="board-selector">
        <label>Select Board</label>

        <select value={boardId} onChange={(e) => setBoardId(e.target.value)}>
          {boards.map((board) => (
            <option key={board._id} value={board._id}>
              {board.title}
            </option>
          ))}
        </select>
      </div>
      
      {role === "admin" && (
      <form className="task-form" onSubmit={addTask}>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>
      )};

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          <Droppable droppableId="todo">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <BoardCard
                  title="📝 To Do"
                  color="#f59e0b"
                  count={todoTasks.length}
                >
                  {todoTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onDelete={deleteTask}
                            onStatusChange={changeStatus}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </BoardCard>
              </div>
            )}
          </Droppable>

          <Droppable droppableId="inprogress">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <BoardCard
                  title="⚡ In Progress"
                  color="#3b82f6"
                  count={progressTasks.length}
                >
                  {progressTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onDelete={deleteTask}
                            onStatusChange={changeStatus}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </BoardCard>
              </div>
            )}
          </Droppable>

          <Droppable droppableId="completed">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <BoardCard
                  title="✅ Completed"
                  color="#10b981"
                  count={completedTasks.length}
                >
                  {completedTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onDelete={deleteTask}
                            onStatusChange={changeStatus}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </BoardCard>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;

function TaskCard({
  task,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="task-card">

      <h3>{task.title}</h3>

      <p>
        {task.description ||
          "No description provided"}
      </p>

      <div className="task-actions">

        {/* {task.status === "todo" && (
          <button
            onClick={() =>
              onStatusChange(
                task._id,
                "inprogress"
              )
            }
          >
            ▶ Start
          </button>
        )}

        {task.status === "inprogress" && (
          <button
            onClick={() =>
              onStatusChange(
                task._id,
                "completed"
              )
            }
          >
            ✓ Complete
          </button>
        )} */}

        {task.status === "completed" && (
          <button
            onClick={() =>
              onStatusChange(
                task._id,
                "todo"
              )
            }
          >
            ↺ Reopen
          </button>
        )}

        <button
          onClick={() =>
            onDelete(task._id)
          }
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}

export default TaskCard;
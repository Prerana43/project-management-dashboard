function BoardCard({
  title,
  color,
  count,
  children,
}) {
  return (
    <div
      className="board"
      style={{
        borderTop: `5px solid ${color}`,
      }}
    >
      <div className="board-header">
        <h2>{title}</h2>

        <span className="task-count">
          {count}
        </span>
      </div>

      <div className="board-content">
        {children}
      </div>
    </div>
  );
}

export default BoardCard;
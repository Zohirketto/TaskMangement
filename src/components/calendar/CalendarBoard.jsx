import PropTypes from "prop-types";
import { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const fmtDate = (d) => d.toISOString().slice(0, 10);
const isSameDay = (a, b) => fmtDate(a) === fmtDate(b);
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfWeek = (d) => {
  const day = d.getDay();
  return addDays(d, -day);
};

const CalendarBoard = ({ view, current, tasks, onReschedule, onTaskClick }) => {
  const monthGrid = useMemo(() => {
    const start = startOfMonth(current);
    const gridStart = startOfWeek(start);
    const days = [];
    for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
    return days;
  }, [current]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const key = t.dueDate || "";
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const id = parseInt(draggableId.replace("task-", ""), 10);
    const dateKey = destination.droppableId === "unscheduled" ? "" : destination.droppableId;
    onReschedule(id, dateKey);
  };

  if (view !== "Month") {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
        {monthGrid.map((date) => {
          const inMonth = date.getMonth() === current.getMonth();
          const weekend = date.getDay() === 0 || date.getDay() === 6;
          const today = isSameDay(date, new Date());
          const key = fmtDate(date);
          const list = tasksByDate[key] || [];
          return (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`calendar-day ${inMonth ? "" : "muted"} ${weekend ? "weekend" : ""} ${today ? "today" : ""}`}
                >
                  <div className="calendar-date">{date.getDate()}</div>
                  <div className="calendar-day-content">
                    {list.map((t, idx) => (
                      <Draggable key={t.id} draggableId={`task-${t.id}`} index={idx}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className="task-chip"
                            onClick={() => onTaskClick(t)}
                            title={t.title}
                          >
                            <span className={`chip-priority ${String(t.priority||"").toLowerCase().replace(/\s+/g,"")}`}/>
                            <span className="chip-title">{t.title}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

CalendarBoard.propTypes = {
  view: PropTypes.string.isRequired,
  current: PropTypes.instanceOf(Date).isRequired,
  tasks: PropTypes.array.isRequired,
  onReschedule: PropTypes.func.isRequired,
  onTaskClick: PropTypes.func.isRequired,
};

export default CalendarBoard;

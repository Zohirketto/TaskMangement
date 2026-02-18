import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../features/TaskSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CalendarDays, Paperclip } from "lucide-react";
import { db, firebaseAvailable, auth } from "../lib/firebase";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import TaskModal from "./TaskModal";

const TaskList = ({ columns }) => {
  const tasks = useSelector((state) => state.TaskReducer.tasks);
  const query = useSelector((state) => state.SearchReducer.query);
  const dispatch = useDispatch();
  const [activeTask, setActiveTask] = useState(null);

  const uid = auth?.currentUser?.uid || null;

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (!firebaseAvailable || !db) return;
    const task = tasks.find(t => String(t.id) === draggableId.replace("task-", ""));
    if (uid && task && task.userId && task.userId !== uid) return;
    const id = draggableId.replace("task-", "");
    const ref = doc(db, "tasks", id);
    updateDoc(ref, { status: destination.droppableId, updatedAt: serverTimestamp() });
  };

  const statusClass = (s) => (s || "").toLowerCase().replace(/\s+/g, "-");
  const priorityKey = (p) => (p || "").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="board">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`column ${
                  snapshot.isDraggingOver ? "column-active" : ""
                }`}
              >
                <div className="column-header">
                  <h2 className="column-title">{col.title}</h2>
                  <span className="column-count">
                    {tasks.filter((t) => {
                      if ((!uid || t.userId === uid) && t.status === col.id) {
                        if (!query) return true;
                        const q = query.toLowerCase();
                        return (
                          (t.title || "").toLowerCase().includes(q) ||
                          (t.description || "").toLowerCase().includes(q)
                        );
                      }
                      return false;
                    }).length}
                  </span>
                </div>
                <div className="column-content">
                  {tasks
                    .filter((t) => {
                      if ((!uid || t.userId === uid) && t.status === col.id) {
                        if (!query) return true;
                        const q = query.toLowerCase();
                        return (
                          (t.title || "").toLowerCase().includes(q) ||
                          (t.description || "").toLowerCase().includes(q)
                        );
                      }
                      return false;
                    })
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={`task-${task.id}`}
                        index={index}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`task-card status-${statusClass(task.status)} ${
                              dragSnapshot.isDragging ? "task-card-active" : ""
                            }`}
                            onClick={() => setActiveTask(task)}
                          >
                            <div className="task-card-header">
                              <div className="task-card-top">
                                <h3 className="task-title">{task.title}</h3>
                                <div className="task-pills">
                                  <span className={`badge badge-status badge-${statusClass(task.status)}`}>
                                    {task.status.replace("-", " ")}
                                  </span>
                                  <span className={`badge badge-priority badge-priority-${priorityKey(task.priority)}`}>
                                    {task.priority || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="task-close"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (firebaseAvailable && db) {
                                    const ref = doc(db, "tasks", String(task.id));
                                    deleteDoc(ref);
                                  }
                                  dispatch(deleteTask({ id: task.id })); // optional optimistic
                                }}
                              >
                                ×
                              </button>
                            </div>
                            {task.attachment && task.attachment.dataUrl && (
                              <div style={{marginBottom: 8}}>
                                <img src={task.attachment.dataUrl} alt="" style={{width:"100%", borderRadius:8}} referrerPolicy="no-referrer"/>
                              </div>
                            )}
                            <p className="task-desc">{task.description}</p>
                            <div className="task-meta-row">
                              <div className="task-meta">
                                <span className="task-meta-item">
                                  <CalendarDays size={16} />
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString()
                                    : new Date(task.createAt).toLocaleDateString()}
                                </span>
                             
                                <span className="task-meta-item">
                                  <Paperclip size={16} />
                                  Files
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      {activeTask && (
        <TaskModal task={activeTask} onClose={()=>setActiveTask(null)}/>
      )}
    </div>
  );
};

export default TaskList;
TaskList.propTypes = {
  columns: PropTypes.array.isRequired,
};

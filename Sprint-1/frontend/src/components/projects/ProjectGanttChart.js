import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const ProjectGanttChart = ({ tasks }) => {
  console.log('Received tasks:', tasks);

  if (!Array.isArray(tasks)) {
    console.warn('Tasks prop is not an array');
    return <div>No valid tasks to display</div>;
  }

  // Filter and map tasks with strict validation
  const ganttTasks = tasks.reduce((acc, task) => {
    if (!task) {
      console.warn('Skipping falsy task:', task);
      return acc;
    }

    let startDate = new Date();
    if (task.due_date) {
      const parsedDate = new Date(task.due_date);
      if (!isNaN(parsedDate)) {
        startDate = parsedDate;
      } else {
        console.warn('Invalid due_date for task:', task);
        return acc; // skip task with invalid date
      }
    } else {
      console.warn('Missing due_date for task:', task);
      return acc; // skip task without due_date
    }

    const ganttTask = {
      start: startDate,
      end: startDate,
      name: task.title || 'Untitled Task',
      id: task.id ? task.id.toString() : Math.random().toString(36).substr(2, 9),
      type: 'task',
      progress: task.status === 'completed' ? 100 : 0,
      isDisabled: true,
    };

    acc.push(ganttTask);
    return acc;
  }, []);

  console.log('Mapped ganttTasks:', ganttTasks);

  if (ganttTasks.length === 0) {
    return <div>No valid tasks to display</div>;
  }

  return (
    <div>
      <h5>Gantt Chart</h5>
      <Gantt
        tasks={ganttTasks}
        viewMode={ViewMode.Day}
        locale="en"
        listCellWidth="155px"
      />
    </div>
  );
};

export default ProjectGanttChart;

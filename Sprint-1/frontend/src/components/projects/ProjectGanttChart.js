import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const ProjectGanttChart = ({ tasks }) => {

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

    if (!task.start_time || !task.due_time) {
      console.warn('Missing start_time or due_time for task:', task);
      return acc;
    }
    
    const startDate = new Date(task.start_time);
    const endDate = new Date(task.due_time);
    
    if (isNaN(startDate) || isNaN(endDate)) {
      console.warn('Invalid start_time or due_time:', task);
      return acc;
    }
    
    const ganttTask = {
      start: startDate,
      end: endDate,
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

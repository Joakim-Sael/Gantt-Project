import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer, CartesianGrid } from 'recharts';
import './GanttChart.css'; // We'll create this CSS file

export default function GanttChart() {
  const [taskData, setTaskData] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState(['Large Exhibition', 'Small Exhibition 1']);
  const [displayedTeams, setDisplayedTeams] = useState(['Curators', 'Finance', 'Project Management', 'Logistics', 'Marketing', 'Operations']);
  const [visibleTasks, setVisibleTasks] = useState([]);

  useEffect(() => {
    // Original task data from your JSON
    const rawData = [
      {
        "task_id": "L1",
        "team": "Curators",
        "dependencies": [],
        "task_group": "Large Exhibition",
        "task_description": "Initial Concept & Theme Development",
        "start_date": "2025-03-01",
        "end_date": "2025-04-30"
      },
      {
        "task_id": "L2",
        "team": "Finance",
        "dependencies": ["L1"],
        "task_group": "Large Exhibition",
        "task_description": "Budget Approval & Sponsorships",
        "start_date": "2025-05-01",
        "end_date": "2025-06-30"
      },
      {
        "task_id": "L3",
        "team": "Project Management",
        "dependencies": ["L2"],
        "task_group": "Large Exhibition",
        "task_description": "Stakeholder Engagement & Planning",
        "start_date": "2025-06-01",
        "end_date": "2025-08-31"
      },
      {
        "task_id": "L4",
        "team": "Curators",
        "dependencies": ["L3"],
        "task_group": "Large Exhibition",
        "task_description": "Artist & Exhibit Selection",
        "start_date": "2025-09-01",
        "end_date": "2025-11-30"
      },
      {
        "task_id": "L5",
        "team": "Logistics",
        "dependencies": ["L4"],
        "task_group": "Large Exhibition",
        "task_description": "Venue & Logistics Planning",
        "start_date": "2025-11-01",
        "end_date": "2026-01-31"
      },
      {
        "task_id": "L6",
        "team": "Marketing",
        "dependencies": ["L5"],
        "task_group": "Large Exhibition",
        "task_description": "Marketing & Promotion",
        "start_date": "2025-12-01",
        "end_date": "2026-02-28"
      },
      {
        "task_id": "L7",
        "team": "Operations",
        "dependencies": ["L6"],
        "task_group": "Large Exhibition",
        "task_description": "Final Setup & Staff Training",
        "start_date": "2026-02-01",
        "end_date": "2026-03-01"
      },
      {
        "task_id": "L8",
        "team": "Operations",
        "dependencies": ["L7"],
        "task_group": "Large Exhibition",
        "task_description": "Exhibition Running",
        "start_date": "2026-03-01",
        "end_date": "2026-06-30"
      },
      {
        "task_id": "S1-1",
        "team": "Curators",
        "dependencies": [],
        "task_group": "Small Exhibition 1",
        "task_description": "Concept Development",
        "start_date": "2025-09-01",
        "end_date": "2025-10-31"
      },
      {
        "task_id": "S1-2",
        "team": "Finance",
        "dependencies": ["S1-1"],
        "task_group": "Small Exhibition 1",
        "task_description": "Budget & Sponsorship Confirmation",
        "start_date": "2025-10-01",
        "end_date": "2025-11-30"
      },
      {
        "task_id": "S1-3",
        "team": "Curators",
        "dependencies": ["S1-2"],
        "task_group": "Small Exhibition 1",
        "task_description": "Artist & Content Selection",
        "start_date": "2025-11-01",
        "end_date": "2025-12-31"
      },
      {
        "task_id": "S1-4",
        "team": "Marketing",
        "dependencies": ["S1-3"],
        "task_group": "Small Exhibition 1",
        "task_description": "Marketing Campaign & Outreach",
        "start_date": "2025-12-01",
        "end_date": "2026-01-31"
      },
      {
        "task_id": "S1-5",
        "team": "Logistics",
        "dependencies": ["S1-4"],
        "task_group": "Small Exhibition 1",
        "task_description": "Venue Preparation & Setup",
        "start_date": "2026-01-01",
        "end_date": "2026-02-28"
      },
      {
        "task_id": "S1-6",
        "team": "Operations",
        "dependencies": ["S1-5"],
        "task_group": "Small Exhibition 1",
        "task_description": "Exhibition Running",
        "start_date": "2026-02-01",
        "end_date": "2026-05-31"
      }
    ];

    // Process the data for the chart
    const processedData = rawData.map(task => {
      const startDate = new Date(task.start_date);
      const endDate = new Date(task.end_date);
      const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        startTimestamp: startDate.getTime(),
        endTimestamp: endDate.getTime(),
        durationDays,
        start: startDate,
        end: endDate
      };
    });

    setTaskData(processedData);
  }, []);

  useEffect(() => {
    // Filter tasks based on selected groups and teams
    const filtered = taskData.filter(task => 
      displayedGroups.includes(task.task_group) && 
      displayedTeams.includes(task.team)
    );
    
    // Sort by task group and task ID
    const sorted = [...filtered].sort((a, b) => {
      if (a.task_group !== b.task_group) {
        return a.task_group.localeCompare(b.task_group);
      }
      return a.task_id.localeCompare(b.task_id);
    });
    
    setVisibleTasks(sorted);
  }, [taskData, displayedGroups, displayedTeams]);

  // Get unique task groups and teams for filters
  const taskGroups = [...new Set(taskData.map(task => task.task_group))];
  const teams = [...new Set(taskData.map(task => task.team))];

  // Color scheme for teams
  const teamColors = {
    'Curators': '#3498db',
    'Finance': '#e74c3c',
    'Project Management': '#2ecc71',
    'Logistics': '#f39c12',
    'Marketing': '#9b59b6',
    'Operations': '#1abc9c'
  };

  // Calculate the min and max dates for the x-axis
  const minDate = taskData.length > 0 
    ? Math.min(...taskData.map(task => task.startTimestamp))
    : new Date('2025-03-01').getTime();
  
  const maxDate = taskData.length > 0 
    ? Math.max(...taskData.map(task => task.endTimestamp))
    : new Date('2026-06-30').getTime();

  // Format date for display
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const task = payload[0].payload;
      return (
        <div className="tooltip">
          <p className="tooltip-title">{task.task_description}</p>
          <p className="tooltip-text">ID: {task.task_id} ({task.task_group})</p>
          <p className="tooltip-text">Team: {task.team}</p>
          <p className="tooltip-text">
            Start: {new Date(task.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="tooltip-text">
            End: {new Date(task.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="tooltip-text">Duration: {task.durationDays} days</p>
          {task.dependencies.length > 0 && (
            <p className="tooltip-text">Dependencies: {task.dependencies.join(', ')}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Toggle task group visibility
  const toggleTaskGroup = (group) => {
    setDisplayedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  // Toggle team visibility
  const toggleTeam = (team) => {
    setDisplayedTeams(prev => 
      prev.includes(team) 
        ? prev.filter(t => t !== team)
        : [...prev, team]
    );
  };

  // Transform tasks for the chart
  const chartData = visibleTasks.map(task => {
    const startTime = new Date(task.start_date).getTime();
    const endTime = new Date(task.end_date).getTime();
    
    return {
      ...task,
      name: task.task_description,
      value: [startTime, endTime],
      fill: teamColors[task.team]
    };
  });

  // Generate tick values for the x-axis (monthly)
  const generateTickValues = () => {
    if (taskData.length === 0) return [];
    
    const ticks = [];
    const startDate = new Date(minDate);
    const endDate = new Date(maxDate);
    
    // Set to first of the month
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    // Generate monthly ticks
    while (currentDate <= endDate) {
      ticks.push(new Date(currentDate).getTime());
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return ticks;
  };

  const xAxisTicks = generateTickValues();

  return (
    <div className="container">
      <h1 className="main-title">Exhibition Project Timeline</h1>
      
      <div className="filter-container">
        <div className="filter-group">
          <h3 className="filter-title">Filter by Task Group:</h3>
          <div className="button-group">
            {taskGroups.map(group => (
              <button
                key={group}
                className={`filter-button ${displayedGroups.includes(group) ? 'active' : ''}`}
                onClick={() => toggleTaskGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <h3 className="filter-title">Filter by Team:</h3>
          <div className="button-group">
            {teams.map(team => (
              <button
                key={team}
                className={`filter-button ${displayedTeams.includes(team) ? 'active' : ''}`}
                onClick={() => toggleTeam(team)}
              >
                <span className="color-dot" style={{ backgroundColor: teamColors[team] }}></span>
                {team}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <h2 className="section-title">Gantt Chart</h2>
        <div className="chart-wrapper">
          <div className="chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 180, bottom: 60 }}
                barGap={0}
                barCategoryGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis 
                  type="number"
                  dataKey="value"
                  domain={[minDate, maxDate]}
                  tickFormatter={formatXAxis}
                  ticks={xAxisTicks}
                  scale="time"
                  tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
                  stroke="#666"
                  height={50}
                  interval={0}
                />
                <YAxis 
                  dataKey="task_description" 
                  type="category"
                  width={160}
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name=" " 
                  barSize={24}
                  shape={props => {
                    const { x, y, width, height, fill } = props;
                    return (
                      <rect 
                        x={x} 
                        y={y} 
                        width={width} 
                        height={height} 
                        fill={fill} 
                        rx={3} 
                        ry={3}
                      />
                    );
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <h2 className="section-title">Task Dependencies</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Team</th>
                <th>Group</th>
                <th>Dependencies</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {visibleTasks.map((task) => (
                <tr key={task.task_id}>
                  <td>{task.task_id}</td>
                  <td>{task.task_description}</td>
                  <td>
                    <span className="color-dot" style={{ backgroundColor: teamColors[task.team] }}></span>
                    {task.team}
                  </td>
                  <td>{task.task_group}</td>
                  <td>
                    {task.dependencies.length > 0 ? task.dependencies.join(', ') : '-'}
                  </td>
                  <td>
                    {new Date(task.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    {new Date(task.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
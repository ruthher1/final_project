import React, { useState } from "react";
import { useSelector } from "react-redux";
import {BarChart,Bar,PieChart,Pie,Cell,LineChart,Line,XAxis,YAxis,Tooltip,Legend,CartesianGrid,ResponsiveContainer} from "recharts";
import axios from "axios";
import { useEffect } from "react";
const TaskStatisticsDashboard = () => {
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const id = useSelector(x => x.Id.id)
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [missedTasks, setMissedTasks] = useState([])
    
    const getWeekRange = (date) => {
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay()-1);
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + (6 - date.getDay()));
        return { startDate, endDate };
    };
    const { startDate, endDate }= getWeekRange(new Date())

    const getAllManagerTasks = async () => {

        try {
            const res = await axios.get(`http://localhost:2000/api/tasks/getAllManagerTasks/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                makeAnalitics(res.data);
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const makeAnalitics = (Mytasks) => {
         setCompletedTasks ( Mytasks.filter(task => task.completed === true && new Date(task.date) > startDate && new Date(task.date) < endDate));
         setMissedTasks (Mytasks.filter(task => task.completed === false && new Date(task.date) > startDate && new Date(task.date) < endDate));
         setTasks (Mytasks.filter(task => new Date(task.date) > startDate && new Date(task.date) < endDate));
    }
        

    useEffect(() => {
        getAllManagerTasks();
    }, [])


const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const barData = days.map((day, index) => ({
  name: day,
  completed: completedTasks.filter(task => new Date(task.date).getDay() === index).length,
  missed: missedTasks.filter(task => new Date(task.date).getDay() === index).length
}));



  const pieData = [
    { name: "Hard", value: tasks?.filter(task => task.difficulty === "hard").length },
    { name: "Medium", value: tasks?.filter(task => task.difficulty === "medium").length },
    { name: "Easy", value: tasks?.filter(task => task.difficulty === "easy").length },
    { name: "Non", value: tasks?.filter(task => task.difficulty === "").length }
  ];


  // const lineData = [
  //   { day: "Sun", percent: 70 },
  //   { day: "Mon", percent: 90 },
  //   { day: "Tue", percent: 66 },
  //   { day: "Wed", percent: 44 },
  //   { day: "Thu", percent: 100 },
  //   { day: "Fri", percent: 43 }
  // ];

  const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#facc15"];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">
        Task Statistics Overview For {startDate?startDate.toLocaleDateString('he-IL'):""}-{endDate?endDate.toLocaleDateString('he-IL'):""}
      </h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Tasks Completed vs Missed</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#4ade80" name="Completed Tasks" />
            <Bar dataKey="missed" fill="#f87171" name="Missed Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Task Type Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Daily Completion Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="percent" stroke="#60a5fa" name="% Completed" />
          </LineChart>
        </ResponsiveContainer>
      </section> */}
    </div>
  );
};

export default TaskStatisticsDashboard;
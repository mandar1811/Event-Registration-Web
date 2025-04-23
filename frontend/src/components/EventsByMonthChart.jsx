// src/components/EventsByMonthChart.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
  '#8dd1e1', '#d0ed57', '#a4de6c', '#d88884',
  '#84d8c6', '#c684d8', '#d8b384', '#84c6d8',
];

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const EventsByMonthChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events');
        const events = response.data;

        const monthCounts = Array(12).fill(0);
        events.forEach(event => {
          const date = new Date(event.date); // make sure this is the correct key
          if (!isNaN(date)) {
            const month = date.getMonth();
            monthCounts[month]++;
          }
        });

        const filteredData = monthCounts
          .map((count, index) => ({
            name: MONTH_NAMES[index],
            value: count,
          }))
          .filter(data => data.value > 0); // ✨ Only include months with events

        setMonthlyData(filteredData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Monthly Event Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={monthlyData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name }) => name}
          >
            {monthlyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventsByMonthChart;

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Define color palette for 12 months
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
  '#8dd1e1', '#d0ed57', '#a4de6c', '#d88884',
  '#84d8c6', '#c684d8', '#d8b384', '#84c6d8',
];

const EventsByMonthChart = ({ events }) => {
  // Create count of events by month
  const data = [
    { name: 'Jan', value: 5 },
    { name: 'Feb', value: 8 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 6 },
    { name: 'May', value: 10 },
    { name: 'Jun', value: 4 },
    { name: 'Jul', value: 7 },
    { name: 'Aug', value: 9 },
    { name: 'Sep', value: 2 },
    { name: 'Oct', value: 5 },
    { name: 'Nov', value: 3 },
    { name: 'Dec', value: 6 },
  ];
  

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Monthly Event Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name }) => name} // Show only month labels
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {/* <Legend layout="horizontal" verticalAlign="bottom" align="center" /> */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventsByMonthChart;

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
interface CustomLineChartProps {
  data: any[];
  legendKey: string;
  xKey: string;
  yKey: string;
}
const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  xKey,
  yKey,
}) => {
  return (
    <div className='section'>
      <div className='sectionHeader'>
        <h1>People currently utilizing categories</h1>
      </div>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar type="monotone" dataKey={yKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default CustomLineChart;

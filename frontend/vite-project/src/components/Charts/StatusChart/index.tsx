import {PieChart, Pie, Tooltip, Legend, ResponsiveContainer} from "recharts";

const StatusChart = ({values}) => {

  const data = [
  { name: "Approved", value: values?.approved || 0, fill: "#22c55e" },
  { name: "Rejected", value: values?.rejected || 0, fill: "#ef4444" },
  { name: "Pending", value: values?.submitted || 0, fill: "#f59e0b" },
  { name: "Draft", value: values?.draft || 0, fill: "#3b82f6" },
  { name: "Archived", value: values?.archived || 0, fill: "#7C3AED" }
];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      
      <h2 className="text-md font-bold text-slate-700 mb-3">
        Status Distribution
      </h2>

      <ResponsiveContainer height={250} width="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default StatusChart;
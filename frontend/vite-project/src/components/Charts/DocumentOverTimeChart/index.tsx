import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend} from "recharts";

const DocumentsOverTime = ({data}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      
      <h2 className="text-md font-bold text-slate-700 mb-3">
        Documents Over Time
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          
          {/* Grid */}
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

          {/* Axes */}
          <XAxis 
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis 
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
            }}
          />
          <Legend />

          {/* Created */}
          <Line
            type="monotone"
            dataKey="created"
            stroke="#3b82f6"  
            strokeWidth={3}
            dot={{ r: 3 }}
          />

          {/* Approved */}
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#22c55e"  
            strokeWidth={3}
            dot={{ r: 3 }}
          />

          {/* Rejected */}
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#ef4444"  
            strokeWidth={3}
            dot={{ r: 3 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default DocumentsOverTime;
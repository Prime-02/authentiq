// app/admin/orders/statistics/components/OrderDistribution.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const OrderDistribution = ({ hourlyData, dailyData }) => {
  if (!hourlyData && !dailyData) return null;

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "₦0";
    return `₦${Number(value).toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("Revenue") || entry.name.includes("Avg")
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hourly Distribution */}
      {hourlyData && hourlyData.length > 0 && (
        <div className="card rounded-2xl p-6">
          <h2 className="text-lg font-bold font-Montserrat mb-4">
            Orders by Hour
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="order_count"
                fill="#3B82F6"
                name="Orders"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Distribution */}
      {dailyData && dailyData.length > 0 && (
        <div className="card rounded-2xl p-6">
          <h2 className="text-lg font-bold font-Montserrat mb-4">
            Orders by Day
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day_name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} yAxisId="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="order_count"
                stroke="#10B981"
                name="Orders"
                strokeWidth={2}
                dot={{ fill: "#10B981" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="total_revenue"
                stroke="#8B5CF6"
                name="Revenue"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OrderDistribution;

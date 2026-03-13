import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ResourceBarChart = ({ data }) => (
  <div className="glass rounded-xl p-4">
    <h3 className="mb-4 font-['Outfit'] text-lg font-semibold">Resource Usage</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid var(--border-muted)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
            }}
          />
          <Bar dataKey="quantity" fill="var(--primary)" radius={[10, 10, 0, 0]} animationDuration={950} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ResourceBarChart;


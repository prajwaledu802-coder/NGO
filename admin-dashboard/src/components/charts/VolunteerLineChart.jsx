import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const VolunteerLineChart = ({ data }) => (
  <div className="glass rounded-xl p-4">
    <h3 className="mb-4 font-['Outfit'] text-lg font-semibold">Volunteer Activity</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="volunteerGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="volunteers"
            stroke="var(--primary)"
            fill="url(#volunteerGlow)"
            strokeWidth={3}
            animationDuration={950}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default VolunteerLineChart;


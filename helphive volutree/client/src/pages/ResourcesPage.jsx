import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const statusClass = {
  Available: 'bg-emerald-500/20 text-emerald-200',
  Low: 'bg-amber-500/20 text-amber-200',
  Critical: 'bg-rose-500/20 text-rose-200',
};

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    api.get('/resources').then((res) => setResources(res.data));
  }, []);

  return (
    <section>
      <PageHeader title="Resource Inventory" subtitle="Monitor stock and critical supply levels" />
      <div className="glass overflow-x-auto rounded-2xl p-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-slate-300">
            <tr>
              <th className="pb-2">Resource</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r._id} className="border-t border-slate-700/40">
                <td className="py-3">{r.name}</td>
                <td className="py-3">
                  <div className="w-52">
                    <div className="mb-1 text-xs text-slate-300">{r.quantity}</div>
                    <div className="h-2 rounded-full bg-slate-700">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(r.quantity, 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="py-3">{r.location}</td>
                <td className="py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ResourcesPage;

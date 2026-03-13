import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Lightbulb, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import AnimatedButton from '../components/ui/AnimatedButton';
import { api } from '../services/api';

const AIInsightsPage = () => {
  const [engagementPredictions, setEngagementPredictions] = useState([]);
  const [resourceForecast, setResourceForecast] = useState([]);
  const [recommendationRows, setRecommendationRows] = useState([]);
  const [insightsError, setInsightsError] = useState('');
  const [predictionInput, setPredictionInput] = useState({
    eventType: 'Flood Relief',
    expectedPeople: 500,
  });
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState('');
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/dashboard/overview'), api.get('/resources'), api.get('/volunteers?status=approved')])
      .then(([overviewRes, resourcesRes, volunteersRes]) => {
        const activitySeries = overviewRes.data?.activitySeries || [];
        setEngagementPredictions(
          activitySeries.map((item, index) => ({
            week: `W${index + 1}`,
            score: item.volunteers || 0,
          }))
        );

        setResourceForecast(
          (resourcesRes.data || []).map((item) => ({
            name: item.resourceName || item.name,
            demand: item.quantity || 0,
          }))
        );

        setRecommendationRows(
          (volunteersRes.data || [])
            .sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))
            .slice(0, 6)
            .map((volunteer) => ({
              volunteer: volunteer.name,
              reason: (volunteer.skills || []).slice(0, 2).join(', ') || 'High reliability score',
              event: predictionInput.eventType,
            }))
        );
        setInsightsError('');
      })
      .catch((err) => setInsightsError(err.response?.data?.message || 'Unable to load AI insights.'));
  }, [predictionInput.eventType]);

  const runPrediction = async () => {
    setPredicting(true);
    setPredictionError('');

    try {
      const { data } = await api.post('/ml/predict-resources', {
        eventType: predictionInput.eventType,
        expectedPeople: Number(predictionInput.expectedPeople),
      });

      setPrediction(data);
    } catch (error) {
      const message = error?.response?.data?.message || 'Prediction service is currently unavailable';
      setPredictionError(message);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <section className="space-y-5">
    <PageHeader
      title="AI Insights"
      subtitle="Volunteer engagement predictions, event recommendations, and demand forecasting"
      action={
        <div className="rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
          AI Reasoning Active
        </div>
      }
    />
    {insightsError ? <p className="text-sm text-rose-300">{insightsError}</p> : null}

    <div className="grid gap-4 xl:grid-cols-3">
      <motion.article whileHover={{ y: -4 }} className="tilt-card glass rounded-xl p-4">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-300" />
          <h3 className="font-semibold">Volunteer Engagement</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">Expected increase in event participation over the next 5 weeks.</p>
      </motion.article>

      <motion.article whileHover={{ y: -4 }} className="tilt-card glass rounded-xl p-4">
        <div className="mb-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-300" />
          <h3 className="font-semibold">Suggested Volunteers</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">Match volunteers by skill, reliability, and proximity to event locations.</p>
      </motion.article>

      <motion.article whileHover={{ y: -4 }} className="tilt-card glass rounded-xl p-4">
        <div className="mb-2 flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-amber-300" />
          <h3 className="font-semibold">Resource Forecast</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">Projected demand for key supplies based on recent event patterns.</p>
      </motion.article>
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      <article className="glass rounded-xl p-4">
        <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Volunteer Engagement Predictions</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementPredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
              <XAxis dataKey="week" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border-muted)',
                  backgroundColor: 'var(--bg-elevated)',
                }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} animationDuration={900} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {!engagementPredictions.length ? <p className="text-sm text-[var(--text-secondary)]">No engagement history available.</p> : null}
      </article>

      <article className="glass rounded-xl p-4">
        <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Resource Demand Forecasting</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border-muted)',
                  backgroundColor: 'var(--bg-elevated)',
                }}
              />
              <Bar dataKey="demand" fill="var(--primary)" radius={[8, 8, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!resourceForecast.length ? <p className="text-sm text-[var(--text-secondary)]">No resource forecast data available.</p> : null}
      </article>
    </div>

    <article className="glass rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-['Outfit'] text-lg font-semibold">AI Prediction Panel</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-200">
          ML Enabled
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={predictionInput.eventType}
          onChange={(e) => setPredictionInput((prev) => ({ ...prev, eventType: e.target.value }))}
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none md:col-span-2"
          placeholder="Event type"
        />
        <input
          type="number"
          min="1"
          value={predictionInput.expectedPeople}
          onChange={(e) =>
            setPredictionInput((prev) => ({ ...prev, expectedPeople: Number(e.target.value) || 0 }))
          }
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
          placeholder="Expected people"
        />
        <AnimatedButton onClick={runPrediction} disabled={predicting}>
          {predicting ? 'Predicting...' : 'Run Prediction'}
        </AnimatedButton>
      </div>

      {predictionError ? (
        <p className="mt-3 text-sm text-rose-300">{predictionError}</p>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Volunteers Required</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{prediction?.volunteersNeeded ?? '--'}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Food Kits Needed</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{prediction?.foodKitsNeeded ?? '--'}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Medical Kits Needed</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{prediction?.medicalKitsNeeded ?? '--'}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Success Probability</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {prediction?.eventSuccessProbability !== undefined
              ? `${prediction.eventSuccessProbability}%`
              : '--'}
          </p>
        </div>
      </div>

      {prediction ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Model: {prediction.modelType} | Samples used: {prediction.trainingSamples}
        </p>
      ) : null}
    </article>

    <article className="glass rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-cyan-300" />
        <h3 className="font-['Outfit'] text-lg font-semibold">AI Volunteer Recommendation</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-[var(--text-muted)]">
              <th className="pb-2">Recommended Volunteer</th>
              <th className="pb-2">Reason</th>
              <th className="pb-2">Event</th>
            </tr>
          </thead>
          <tbody>
            {recommendationRows.map((row) => (
              <tr key={row.volunteer} className="border-t border-[var(--border-muted)]">
                <td className="py-3">{row.volunteer}</td>
                <td className="py-3">{row.reason}</td>
                <td className="py-3">{row.event}</td>
              </tr>
            ))}
            {!recommendationRows.length ? (
              <tr>
                <td className="py-3 text-[var(--text-secondary)]" colSpan={3}>No recommendation data available.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </article>
  </section>
  );
};

export default AIInsightsPage;

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, '../../ml/predict.py');

const getPythonCommand = () => {
  const configured = process.env.PYTHON_EXECUTABLE;
  if (configured && configured.trim()) return configured.trim();

  // Use python by default; Windows users can override with PYTHON_EXECUTABLE=py
  return 'python';
};

const runPythonPrediction = (payload) =>
  new Promise((resolve, reject) => {
    const pythonCommand = getPythonCommand();
    const child = spawn(pythonCommand, [scriptPath], {
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python ML service exited with code ${code}. ${stderr}`.trim()));
      }

      try {
        const parsed = JSON.parse(stdout || '{}');
        if (!parsed.ok) {
          return reject(new Error(parsed.error || 'ML prediction failed'));
        }

        resolve(parsed.prediction);
      } catch {
        reject(new Error('Unable to parse ML service response'));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });

const fallbackPrediction = ({ eventType, expectedPeople }) => {
  const map = {
    'flood relief': { v: 25, f: 200, m: 40, s: 78 },
    'cleanup drive': { v: 10, f: 40, m: 5, s: 82 },
    'medical camp': { v: 15, f: 30, m: 60, s: 84 },
  };

  const key = String(eventType || '').trim().toLowerCase();
  const base = map[key] || { v: 14, f: 60, m: 18, s: 76 };
  const people = Number(expectedPeople) || 100;
  const factor = Math.max(people / 500, 0.35);

  return {
    volunteersNeeded: Math.max(1, Math.round(base.v * factor)),
    foodKitsNeeded: Math.max(0, Math.round(base.f * factor)),
    medicalKitsNeeded: Math.max(0, Math.round(base.m * factor)),
    eventSuccessProbability: Math.max(1, Math.min(99, Math.round(base.s + (factor > 1 ? 4 : -2)))),
    modelType: 'node-fallback',
  };
};

export const predictEventNeeds = async ({ eventType, expectedPeople, historicalEvents }) => {
  try {
    const prediction = await runPythonPrediction({
      eventType,
      expectedPeople,
      historicalEvents,
    });

    return prediction;
  } catch {
    return fallbackPrediction({ eventType, expectedPeople });
  }
};

import { useEffect, useMemo, useRef, useState } from 'react';

export type TelemetrySample = {
  t: number; // timestamp ms
  radiation: number; // mSv
  temperature: number; // C
  storage: number; // percent 0..100
  velocity: number; // km/s
};

type HistoryPoint = { t: number; v: number };

type Status = {
  connected: boolean;
  timestamp: number;
  capsuleId: string;
  stable: boolean;
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function simulateNext(prev: TelemetrySample): TelemetrySample {
  const now = Date.now();
  const radiation = clamp(prev.radiation + randomInRange(-5, 5), 5, 480);
  const temperature = clamp(prev.temperature + randomInRange(-1.5, 1.5), -40, 110);
  const storage = clamp(prev.storage + randomInRange(-1, 3), 0, 100);
  const velocity = clamp(prev.velocity + randomInRange(-0.05, 0.05), 7.2, 7.9);

  return { t: now, radiation, temperature, storage, velocity };
}

export function useTelemetry() {
  const [latest, setLatest] = useState<TelemetrySample>({
    t: Date.now(),
    radiation: 120,
    temperature: 24,
    storage: 42,
    velocity: 7.6,
  });

  const [status, setStatus] = useState<Status>({
    connected: true,
    timestamp: Date.now(),
    capsuleId: 'LEO-042',
    stable: true,
  });

  const historyRef = useRef({
    radiation: [] as HistoryPoint[],
    temperature: [] as HistoryPoint[],
    velocity: [] as HistoryPoint[],
  });

  // Initialize 24h history with smooth points
  useEffect(() => {
    const start = Date.now() - 24 * 60 * 60 * 1000;
    const points = 24 * 30; // ~every 2 minutes
    const step = (24 * 60 * 60 * 1000) / points;
    let prev = { radiation: 110, temperature: 23, velocity: 7.6 };
    const rad: HistoryPoint[] = [];
    const temp: HistoryPoint[] = [];
    const vel: HistoryPoint[] = [];
    for (let i = 0; i < points; i++) {
      prev = {
        radiation: clamp(prev.radiation + randomInRange(-2, 2), 5, 480),
        temperature: clamp(prev.temperature + randomInRange(-0.4, 0.4), -40, 110),
        velocity: clamp(prev.velocity + randomInRange(-0.01, 0.01), 7.2, 7.9),
      };
      const t = start + i * step;
      rad.push({ t, v: prev.radiation });
      temp.push({ t, v: prev.temperature });
      vel.push({ t, v: prev.velocity });
    }
    historyRef.current = { radiation: rad, temperature: temp, velocity: vel };
  }, []);

  // Simulated transport (replaceable with WebSocket/MQTT)
  useEffect(() => {
    const interval = setInterval(() => {
      setLatest(prev => {
        const next = simulateNext(prev);
        setStatus(s => ({
          ...s,
          connected: true,
          timestamp: next.t,
          stable: Math.abs(next.temperature - prev.temperature) < 5 && Math.abs(next.radiation - prev.radiation) < 30,
        }));
        // Log JSON payload
        // eslint-disable-next-line no-console
        console.log(JSON.stringify({ type: 'telemetry', payload: next }));
        // push to history minutely resolution
        const h = historyRef.current;
        const maybePush = (arr: HistoryPoint[], v: number) => {
          if (arr.length === 0 || next.t - arr[arr.length - 1].t > 60_000) arr.push({ t: next.t, v });
          // trim to 24h
          const dayAgo = next.t - 24 * 60 * 60 * 1000;
          while (arr.length && arr[0].t < dayAgo) arr.shift();
        };
        maybePush(h.radiation, next.radiation);
        maybePush(h.temperature, next.temperature);
        maybePush(h.velocity, next.velocity);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const history24h = useMemo(() => historyRef.current, [latest.t]);

  return { latest, history24h, status } as const;
}



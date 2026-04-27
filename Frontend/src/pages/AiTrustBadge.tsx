import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AMENITY_LABELS: Record<string, string> = {
  has_ac:        'AC', has_tv: 'TV', has_wifi: 'WiFi',
  has_laundry:   'Laundry', has_parking: 'Parking',
  has_security:  'Security', has_gym: 'Gym',
  has_hot_water: 'Hot Water', has_meals: 'Meals',
};

export default function AiTrustBadge({ pgId }: { pgId: number }) {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/analysis/pg/${pgId}`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [pgId]);

  if (loading) return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing images...
    </div>
  );

  if (!data || data.status === 'pending' || data.status === 'processing') return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      AI verification in progress...
    </div>
  );

  if (data.status === 'failed') return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
      <AlertTriangle className="h-4 w-4 text-destructive" /> Image analysis unavailable
    </div>
  );

  const trustScore  = data.trust_score  || 0;
  const trustColor  = trustScore >= 75 ? '#4caf50' : trustScore >= 50 ? '#ff9800' : '#f44336';
  const TrustIcon   = trustScore >= 75 ? ShieldCheck : ShieldAlert;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrustIcon className="h-5 w-5" style={{ color: trustColor }} />
          <span className="font-semibold text-foreground">AI Image Verification</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-bold" style={{ color: trustColor }}>{trustScore}</span>
          <span className="text-sm text-muted-foreground">/100 trust</span>
        </div>
      </div>

      {/* Score bars */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Hygiene (Visual)', value: data.hygiene_score || 0, color: '#4caf50' },
          { label: 'Amenity Match',    value: data.amenity_score || 0, color: '#2196f3' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div style={{ width: `${value}%`, background: color, height: '100%', borderRadius: 999, transition: 'width 0.8s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Cleanliness note */}
      {data.cleanliness_note && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-3">
          "{data.cleanliness_note}"
        </p>
      )}

      {/* Amenity verification grid */}
      {data.claimed_amenities && (
        <div>
          <p className="text-xs font-medium text-foreground mb-2">Amenity Verification</p>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(data.claimed_amenities)
              .filter(([, claimed]) => claimed)
              .map(([key]) => {
                const detected = data.amenity_matches?.[key];
                const isDetectable = detected !== undefined;
                return (
                  <div key={key} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs"
                    style={{
                      background: !isDetectable ? 'var(--color-secondary)' :
                        detected ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                    }}>
                    <span style={{ color: !isDetectable ? 'var(--color-muted-foreground)' : detected ? '#4caf50' : '#f44336' }}>
                      {!isDetectable ? '–' : detected ? '✓' : '✗'}
                    </span>
                    <span style={{ color: !isDetectable ? 'var(--color-muted-foreground)' : detected ? '#4caf50' : '#f44336' }}>
                      {AMENITY_LABELS[key] || key}
                    </span>
                  </div>
                );
              })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            ✓ Visually confirmed · ✗ Not detected in images · – Not checkable from images
          </p>
        </div>
      )}

      {/* Flags */}
      {data.flags?.length > 0 && (
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3 space-y-1">
          <p className="text-xs font-medium text-destructive flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Concerns flagged
          </p>
          {data.flags.map((flag: string, i: number) => (
            <p key={i} className="text-xs text-muted-foreground">• {flag}</p>
          ))}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">
        AI analysis based on uploaded images only. Actual conditions may vary.
        Resident reviews provide real-time verification.
      </p>
    </div>
  );
}
export type IncidentType = 'RATE_LIMIT' | 'CSRF_FAIL' | 'VALIDATION_FAIL' | 'XSS_ATTEMPT' | 'INJECTION_ATTEMPT' | 'UNKNOWN';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityIncident {
  id: string;
  timestamp: number;
  type: IncidentType;
  severity: Severity;
  ip: string;
  details: string;
  resolved: boolean;
  userAgent?: string;
  endpoint?: string;
}

// In-memory incident store (would be replaced with DB in production)
const incidents: SecurityIncident[] = [];
const MAX_INCIDENTS = 1000;

export function generateIncidentId(): string {
  return `elvis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function logIncident(incident: Omit<SecurityIncident, 'id' | 'timestamp' | 'resolved'>): SecurityIncident {
  const newIncident: SecurityIncident = {
    ...incident,
    id: generateIncidentId(),
    timestamp: Date.now(),
    resolved: false,
  };

  incidents.push(newIncident);

  // Keep only last MAX_INCIDENTS
  if (incidents.length > MAX_INCIDENTS) {
    incidents.shift();
  }

  // Send webhook notification
  sendWebhookAsync(newIncident).catch(console.error);

  return newIncident;
}

export function getIncidents(limit = 50): SecurityIncident[] {
  return [...incidents].slice(-limit).reverse();
}

export function getIncidentById(id: string): SecurityIncident | null {
  return incidents.find(i => i.id === id) || null;
}

export function resolveIncident(id: string): boolean {
  const incident = incidents.find(i => i.id === id);
  if (incident) {
    incident.resolved = true;
    return true;
  }
  return false;
}

export function getIncidentStats() {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const oneDayAgo = now - 86400000;

  const lastHour = incidents.filter(i => i.timestamp > oneHourAgo);
  const lastDay = incidents.filter(i => i.timestamp > oneDayAgo);

  const typeCount = incidents.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {} as Record<IncidentType, number>);

  const severityCount = incidents.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1;
    return acc;
  }, {} as Record<Severity, number>);

  return {
    total: incidents.length,
    lastHour: lastHour.length,
    lastDay: lastDay.length,
    unresolved: incidents.filter(i => !i.resolved).length,
    byType: typeCount,
    bySeverity: severityCount,
  };
}

async function sendWebhookAsync(incident: SecurityIncident) {
  try {
    // Send to webhook endpoint
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhooks/elvis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident),
    });
  } catch (error) {
    console.error('[ELVIS] Webhook send failed:', error);
  }
}

export async function sendEmailNotification(incident: SecurityIncident, emails: string[]) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  const severityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#FF5722',
    critical: '#F44336',
  };

  const severityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
    critical: '🚨',
  };

  try {
    await resend.emails.send({
      from: 'ELVIS Security <security@yas-arch.com>',
      to: emails,
      subject: `${severityEmoji[incident.severity]} [ELVIS] ${incident.type} - ${incident.severity.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: ${severityColors[incident.severity]};">🛡️ ELVIS Security Alert</h2>

          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Type:</strong> ${incident.type}</p>
            <p><strong>Severity:</strong> <span style="color: ${severityColors[incident.severity]}; font-weight: bold;">${incident.severity.toUpperCase()}</span></p>
            <p><strong>IP Address:</strong> ${incident.ip}</p>
            <p><strong>Time:</strong> ${new Date(incident.timestamp).toISOString()}</p>
            ${incident.endpoint ? `<p><strong>Endpoint:</strong> ${incident.endpoint}</p>` : ''}
            <p><strong>Details:</strong> ${incident.details}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            View full details: <a href="http://localhost:3000/admin/elvis">ELVIS Dashboard</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('[ELVIS] Email send failed:', error);
  }
}

import { supabase } from '../config/supabase';

const BATCH_SIZE = 50;
let queue: Array<{ event_type: string; page_path?: string; course_id?: string; metadata?: Record<string, unknown> }> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flush();
  }, 3000);
}

async function flush() {
  flushTimer = null;
  if (queue.length === 0) return;
  const batch = queue.splice(0, BATCH_SIZE);
  try {
    await supabase.from('analytics_events').insert(
      batch.map(e => ({
        event_type: e.event_type,
        page_path: e.page_path ?? null,
        course_id: e.course_id ?? null,
        metadata: e.metadata ?? {},
      }))
    );
  } catch (err) {
    console.error('[analytics] Failed to flush events:', err);
  }
}

export function trackEvent(
  eventType: string,
  options?: { pagePath?: string; courseId?: string; metadata?: Record<string, unknown> }
) {
  queue.push({
    event_type: eventType,
    page_path: options?.pagePath ?? typeof window !== 'undefined' ? window.location.pathname : undefined,
    course_id: options?.courseId,
    metadata: options?.metadata,
  });
  scheduleFlush();
}

export function trackPageView(path?: string) {
  trackEvent('page_view', { pagePath: path });
}

export function flushAnalytics() {
  flush();
}

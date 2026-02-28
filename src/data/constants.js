export const CATEGORIES = ['dashboard', 'core', 'onboarding', 'migration', 'commercial'];

export const CATEGORY_COLORS = {
  dashboard: 'bg-blue-100 text-blue-800',
  core: 'bg-purple-100 text-purple-800',
  onboarding: 'bg-green-100 text-green-800',
  migration: 'bg-orange-100 text-orange-800',
  commercial: 'bg-pink-100 text-pink-800',
};

export const JIRA_BASE_URL = 'https://yunopayments.atlassian.net/browse/';

export const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  blocked: 'bg-red-100 text-red-800',
  done: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
};

export const priorityDot = { critical: '🔴', high: '🟠', medium: '🟡', low: '⚪' };

// Splits text into [{type:'text', content}] and [{type:'jira', id}] tokens
export function autoLinkJiraTickets(text) {
  const JIRA_REGEX = /\b([A-Z]+-\d+)\b/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = JIRA_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'jira', id: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
}

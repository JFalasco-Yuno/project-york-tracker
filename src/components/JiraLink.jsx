import { JIRA_BASE_URL } from '../data/constants';

export default function JiraLink({ id }) {
  return (
    <a
      href={`${JIRA_BASE_URL}${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border border-blue-200 transition-colors"
      onClick={e => e.stopPropagation()}
    >
      {id}
    </a>
  );
}

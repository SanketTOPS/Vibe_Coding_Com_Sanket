import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-white">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-3 text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}


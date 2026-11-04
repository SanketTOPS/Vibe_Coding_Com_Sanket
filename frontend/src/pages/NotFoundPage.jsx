import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center card max-w-md p-8">
        <div className="text-6xl font-extrabold text-primary-200">404</div>
        <h1 className="mt-3 text-lg font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-1 text-xs text-gray-500">
          The requested route does not exist or has been relocated.
        </p>
        <Link to="/" className="mt-6 btn-primary inline-flex items-center gap-1.5 text-xs">
          <Wrench className="h-4 w-4" /> Back to HomeServe
        </Link>
      </div>
    </div>
  );
}


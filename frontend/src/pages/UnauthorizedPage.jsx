import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center card max-w-md p-8">
        <ShieldAlert className="h-14 w-14 text-rose-500 mx-auto" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">Access Restricted</h1>
        <p className="mt-2 text-xs text-gray-500">
          Your current account role does not have authorization to view this module.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-secondary text-xs">Home</Link>
          <Link to="/login" className="btn-primary text-xs">Switch Account</Link>
        </div>
      </div>
    </div>
  );
}


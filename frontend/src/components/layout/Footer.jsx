import { Wrench, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-white font-bold text-lg">HomeServe</span>
            </div>
            <p className="text-sm text-gray-400">
              India's leading on-demand home services SaaS platform. Verified professionals delivered to your doorstep.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Top Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Electrician', 'Plumber', 'AC Technician', 'Home Cleaning', 'Pest Control'].map(s => (
                <li key={s}><Link to="/services" className="hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/register?role=provider" className="hover:text-white transition-colors">Join as Provider</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Customer Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Technician Hub</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Pricing & Estimates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Direct Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-500 shrink-0" /> support@homeserve.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-500 shrink-0" /> <a href="tel:+919724799469" className="hover:text-white transition-colors">+91 97247 99469</a></li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed text-gray-300">
                  101 Aditya Complex, University Road, Above SBI Bank, Rajkot - 360005
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} HomeServe SaaS Platform. All rights reserved. Razorpay test integration enabled.</p>
        </div>
      </div>
    </footer>
  );
}


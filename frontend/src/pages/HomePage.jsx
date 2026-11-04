import { Link } from 'react-router-dom';
import { 
  Zap, Droplets, Wind, Sparkles, Paintbrush, Hammer, Settings, Bug, 
  ShieldCheck, Clock, CheckCircle2, Star, ArrowRight, ChevronRight, IndianRupee, Users
} from 'lucide-react';

const categories = [
  { name: 'Electrician', icon: Zap, color: 'bg-yellow-50 text-yellow-600', slug: 'electrician', desc: 'Wiring, switches & fixtures' },
  { name: 'Plumber', icon: Droplets, color: 'bg-blue-50 text-blue-600', slug: 'plumber', desc: 'Leakages, pipes & fittings' },
  { name: 'AC Technician', icon: Wind, color: 'bg-cyan-50 text-cyan-600', slug: 'ac-technician', desc: 'Gas refilling, jet service' },
  { name: 'Home Cleaner', icon: Sparkles, color: 'bg-emerald-50 text-emerald-600', slug: 'home-cleaner', desc: 'Deep cleaning & sanitization' },
  { name: 'Painter', icon: Paintbrush, color: 'bg-rose-50 text-rose-600', slug: 'painter', desc: 'Waterproofing & wall textures' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-amber-50 text-amber-600', slug: 'carpenter', desc: 'Furniture assembly & locks' },
  { name: 'Appliance Repair', icon: Settings, color: 'bg-purple-50 text-purple-600', slug: 'appliance-repair', desc: 'Fridges, washing machines' },
  { name: 'Pest Control', icon: Bug, color: 'bg-red-50 text-red-600', slug: 'pest-control', desc: 'Odorless cockroach & termite' },
];

const stats = [
  { label: 'Happy Customers', value: '45,000+' },
  { label: 'Verified Pros', value: '1,800+' },
  { label: 'Service Quality', value: '4.8 ★' },
  { label: 'Avg Arrival Time', value: '60 Mins' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 to-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
            India's Most Trusted Home Services Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Home Services Booked in <span className="text-primary-600 underline decoration-primary-300">Seconds</span>.
          </h1>
          
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            Book background-checked electricians, plumbers, AC engineers, cleaners and carpenters with transparent upfront pricing.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/services" className="btn-primary px-8 py-3.5 text-base flex items-center gap-2 shadow-lg shadow-primary-500/20">
              Browse All Services <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/register?role=provider" className="btn-secondary px-8 py-3.5 text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" /> Partner With Us
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> 100% Background Verified</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-blue-600" /> Fixed Slot Booking</span>
            <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-primary-600" /> Razorpay Secured Checkout</span>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-600">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Choose a Service Category</h2>
          <p className="text-sm text-gray-500 mt-2">Certified technicians ready in your neighborhood</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/services?category=${cat.slug}`}
              className="card group hover:border-primary-300 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center p-6 bg-white"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              <span className="mt-4 text-xs font-semibold text-primary-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Book now <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-primary-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-primary-800 rounded-xl"><ShieldCheck className="h-6 w-6 text-primary-300" /></div>
            <div>
              <h4 className="font-bold text-base">Verified & Insured Pros</h4>
              <p className="text-xs text-primary-200 mt-1">Police verification & skills assessment completed for every onboarded partner.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-primary-800 rounded-xl"><CheckCircle2 className="h-6 w-6 text-emerald-400" /></div>
            <div>
              <h4 className="font-bold text-base">30-Day Service Guarantee</h4>
              <p className="text-xs text-primary-200 mt-1">Free revisits if the issue recurs within 30 days of job completion.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-primary-800 rounded-xl"><Star className="h-6 w-6 text-yellow-400" /></div>
            <div>
              <h4 className="font-bold text-base">Transparent Pricing</h4>
              <p className="text-xs text-primary-200 mt-1">Standardized rate card with no hidden post-service surprise charges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


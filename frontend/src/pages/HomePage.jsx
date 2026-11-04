import { Link } from 'react-router-dom';
import { 
  Zap, Droplets, Wind, Sparkles, Paintbrush, Hammer, Settings, Bug, 
  ShieldCheck, Clock, CheckCircle2, Star, ArrowRight, ChevronRight, IndianRupee, Users,
  Check, Award, HeartHandshake, PhoneCall
} from 'lucide-react';

const categories = [
  { name: 'Electrician', icon: Zap, color: 'bg-red-50 text-red-600 border-red-200', slug: 'electrician', desc: 'Wiring, MCBs & smart switches' },
  { name: 'Plumber', icon: Droplets, color: 'bg-rose-50 text-rose-600 border-rose-200', slug: 'plumber', desc: 'Leakages, pipes & fittings' },
  { name: 'AC Technician', icon: Wind, color: 'bg-red-50 text-red-700 border-red-200', slug: 'ac-technician', desc: 'Jet servicing & gas refilling' },
  { name: 'Home Cleaner', icon: Sparkles, color: 'bg-rose-50 text-rose-600 border-rose-200', slug: 'home-cleaner', desc: 'Deep sanitation & scrubbing' },
  { name: 'Painter', icon: Paintbrush, color: 'bg-red-50 text-red-600 border-red-200', slug: 'painter', desc: 'Waterproofing & fresh coat' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-rose-50 text-rose-700 border-rose-200', slug: 'carpenter', desc: 'Modular repair, assembly & locks' },
  { name: 'Appliance Repair', icon: Settings, color: 'bg-red-50 text-red-600 border-red-200', slug: 'appliance-repair', desc: 'Fridge, washing machines & microwave' },
  { name: 'Pest Control', icon: Bug, color: 'bg-rose-50 text-rose-700 border-rose-200', slug: 'pest-control', desc: 'Safe herbal pest management' },
];

const stats = [
  { label: 'Happy Customers', value: '45,000+' },
  { label: 'Verified Pros', value: '1,800+' },
  { label: 'Service Quality', value: '4.8 ★' },
  { label: 'Avg Arrival Time', value: '45 Mins' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      
      {/* Hero Section with Red + White Gradient & Animated Service Icons */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-rose-600 to-red-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Animated Background Glow Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '5s' }}></div>

        {/* Floating Animated Service Badges in Background */}
        <div className="absolute top-12 left-6 md:left-24 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 shadow-xl hidden sm:flex items-center gap-3 animate-float-slow">
          <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold shadow">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold block">Electrician</span>
            <span className="text-[10px] text-rose-200">Arrives in 45m</span>
          </div>
        </div>

        <div className="absolute top-20 right-6 md:right-28 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 shadow-xl hidden sm:flex items-center gap-3 animate-float-delayed">
          <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-bold shadow">
            <Wind className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold block">AC Servicing</span>
            <span className="text-[10px] text-rose-200">Jet Pump Clean</span>
          </div>
        </div>

        <div className="absolute bottom-12 left-10 md:left-32 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 shadow-xl hidden md:flex items-center gap-3 animate-float-delayed">
          <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold block">Deep Cleaning</span>
            <span className="text-[10px] text-rose-200">100% Sanitized</span>
          </div>
        </div>

        <div className="absolute bottom-16 right-10 md:right-32 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 shadow-xl hidden md:flex items-center gap-3 animate-float-slow">
          <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-bold shadow">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold block">Plumbing Fix</span>
            <span className="text-[10px] text-rose-200">No Leakage Guarantee</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-white animate-ping"></span>
            India's Leading Home Services SaaS Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
            Reliable Home Services <br className="hidden sm:inline" />
            <span className="text-rose-200 underline decoration-white/40 underline-offset-8">At Your Doorstep</span>.
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-rose-100 max-w-2xl mx-auto leading-relaxed">
            Connecting homeowners with verified electricians, plumbers, AC technicians, house cleaners and carpenters with upfront transparent rates.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/services" 
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-red-700 hover:bg-rose-50 font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/30 transition-all transform hover:-translate-y-0.5"
            >
              Browse Services <ArrowRight className="h-5 w-5 text-red-600" />
            </Link>
            <Link 
              to="/register?role=provider" 
              className="w-full sm:w-auto px-8 py-3.5 bg-red-900/40 hover:bg-red-900/60 text-white border border-white/30 font-semibold rounded-xl text-base flex items-center justify-center gap-2 backdrop-blur-md transition-all"
            >
              <Users className="h-5 w-5 text-rose-200" /> Register as Partner
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-rose-100/90 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-white" /> 100% Background Verified</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-white" /> Fixed 45-Min Arrival</span>
            <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-white" /> Razorpay Test Gateway</span>
          </div>
        </div>

        {/* Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
      </section>

      {/* Metrics Bar */}
      <section className="border-b border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-red-50/70 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label} className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-red-600">{s.value}</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            Top Categories
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Choose a Service Category</h2>
          <p className="text-sm text-gray-500 mt-2">Certified technicians ready to assist across your city</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/services?category=${cat.slug}`}
              className="card group hover:border-red-300 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-200 flex flex-col items-center text-center p-6 bg-white border border-rose-100/80 rounded-2xl"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 shadow-sm border`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              <span className="mt-4 text-xs font-semibold text-red-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Book now <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-gradient-to-r from-red-800 via-rose-700 to-red-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl text-rose-200 border border-white/20">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-bold text-base">Verified & Insured Pros</h4>
              <p className="text-xs text-rose-100/90 mt-1.5 leading-relaxed">Identity verification, background checks & trade certification before onboarding.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl text-rose-200 border border-white/20">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-bold text-base">30-Day Service Guarantee</h4>
              <p className="text-xs text-rose-100/90 mt-1.5 leading-relaxed">Complete peace of mind. Free re-inspection if the fixed issue recurs within 30 days.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl text-rose-200 border border-white/20">
              <Star className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-bold text-base">Transparent Rate Card</h4>
              <p className="text-xs text-rose-100/90 mt-1.5 leading-relaxed">No surprise bills. Upfront approved pricing with secure Razorpay test payments.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import earthVideo from '@assets/video/earth-rotating.mp4';
import USGSLogo from '@assets/images/USGS.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Login Button in Top Right */}
      <div className="absolute top-8 right-8 z-20">
        <Link to="/signin">
        <button className="px-6 py-2 bg-white/10 hover:cursor-pointer hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 text-sm font-medium backdrop-blur-md">
          Login
        </button>
        </Link>
      </div>

      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* background layer image */}
        <div className="absolute inset-0 z-0">
          <video className="w-full h-full object-cover" autoPlay loop muted>
            <source src={earthVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* EXPLORE button */}
        <div className="relative z-10 mb-12">
          <Link to="/globe">
            <button className="px-10 py-4 bg-black/60 border border-white/30 text-white text-2xl font-bold tracking-widest hover:bg-white hover:cursor-pointer hover:text-black transition-all duration-300 backdrop-blur-sm uppercase rounded-full">
              EXPLORE
            </button>
          </Link>
        </div>
      </section>

      {/* 2. Content Section (head panel) */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-linear-to-b from-black to-[#051a14]">
        <div className="absolute top-12 left-8 md:left-16 z-10 max-w-xs text-left">
          <p className="text-gray-300 italic text-lg leading-relaxed">
            A <span className="font-bold text-white">glimpse</span> into the history behind the project.
          </p>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* USGS Logo */}
          <div className="flex justify-center mb-12">
            <img 
              src={USGSLogo} 
              alt="USGS science for a changing world" 
              className="h-32 md:h-40 object-contain"
            />
          </div>

          <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed font-light">
            <p>
              The United States Geological Survey (USGS) has been <br />
              <span className="font-bold text-white">America's foremost earth science agency</span> since 1879, monitoring <br />
              everything from volcanic activity and groundwater to terrain and <br />
              climate shifts.
            </p>
            
            <p>
              What makes them especially valuable today is their commitment to <br />
              open data – a freely accessible library of real-time APIs that <br />
              any developer or researcher can build upon.
            </p>

            <p className="pt-8">
              Among all the phenomena they track, earthquakes stand apart. There's something <br />
              visceral about the ground <span className="italic">itself moving</span> – faults slipping, energy radiating <br />
              outward across thousands of miles in mere seconds.
            </p>

            <p>
              <span className="font-bold text-white">The USGS Earthquake Hazards Program</span> catalogs every tremor on the planet in real <br />
              time, from imperceptible micro-quakes to massive megathrusts. That combination of <br />
              raw geological drama and live, structured data made the choice clear:
            </p>

            <p className="font-bold text-white pt-6 text-xl md:text-2xl uppercase tracking-wider">
              we wanted to make that invisible activity visible, and their Earthquake API gave <br />
              us exactly the foundation to do it.
            </p>
          </div>

          {/* Decorative separator */}
          <div className="w-64 h-px bg-white/30 mx-auto mt-16"></div>
        </div>
      </section>
    
      {/* 3. Footer Section */}
      <footer className="bg-black pt-20 pb-12 px-6 md:px-12 lg:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {/* Navigation Links */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">About</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Get Help</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Want to connect with us?</h3>
              <p className="text-gray-400 text-sm">
                Leave your email and we'll get back to you as soon as possible.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email..." 
                  className="flex-1 bg-white text-black px-4 py-3 rounded-md focus:outline-none"
                />
                <button className="bg-white text-black px-6 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors uppercase text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Line separator */}
          <div className="h-px bg-white/10 w-full mb-8"></div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-xs">
              @Copyright. All rights reserved.
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
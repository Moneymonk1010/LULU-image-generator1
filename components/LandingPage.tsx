import React, { useState, useEffect } from 'react';
import { LogoIcon, InstallIcon } from './Icons';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon />
            <span className="text-2xl font-bold tracking-tight">lulu</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
          </nav>
          
          <div className="flex items-center gap-4">
            {deferredPrompt && (
                <button 
                  onClick={handleInstall}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/5"
                >
                  <InstallIcon />
                  Install
                </button>
            )}
            <button 
                onClick={onStart}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            >
                Start Creating
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-12">
        <section className="relative px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh]">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl glass-card animate-float delay-0" />
          <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 rounded-full glass-card animate-float delay-1000" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium text-indigo-300 mb-8 border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Powered by Gemini 2.5 Flash Image
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
            Dream it. <br />
            <span className="text-gradient">Visualize it.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Create stunning, photorealistic imagery in seconds with our advanced AI engine. 
            Deep dark aesthetics meets infinite creativity.
          </p>
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-full text-lg hover:bg-indigo-50 transition-all flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Launch Studio</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="relative z-10 group-hover:translate-x-1 transition-transform">
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </section>

        {/* Scrolling Strip */}
        <div className="w-full overflow-hidden py-12 opacity-60">
            <div className="flex gap-4 w-[200%] animate-[float_20s_linear_infinite] hover:pause">
               {[...Array(10)].map((_, i) => (
                   <div key={i} className="w-64 h-40 shrink-0 rounded-lg overflow-hidden glass-card">
                       <img 
                        src={`https://picsum.photos/300/200?random=${i}`} 
                        alt="AI Example" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                       />
                   </div>
               ))}
            </div>
        </div>

        {/* Features with Images */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Cinematic Lighting", 
                desc: "Master light and shadow with volumetrics, ray-traced effects, and studio grading.",
                img: "https://picsum.photos/seed/lighting/800/600"
              },
              { 
                title: "Infinite Styles", 
                desc: "From Cyberpunk to Oil Painting, our engine understands every artistic nuance instantly.",
                img: "https://picsum.photos/seed/art/800/600" 
              },
              { 
                title: "Smart Enhance", 
                desc: "Gemini 2.5 transforms simple text into intricate, high-fidelity visual descriptions.",
                img: "https://picsum.photos/seed/tech/800/600"
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2">
                <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={feature.img} 
                      alt={feature.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 rounded-lg bg-white/5 text-indigo-400">
                        <LogoIcon className="w-5 h-5" />
                     </div>
                     <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="max-w-7xl mx-auto px-6 py-24">
            <h2 className="text-4xl font-bold mb-12 text-center">Community Creations</h2>
            <div className="columns-1 md:columns-3 gap-6 space-y-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="break-inside-avoid relative group rounded-2xl overflow-hidden glass-card">
                        <img src={`https://picsum.photos/600/${n % 2 === 0 ? 800 : 600}?random=${n + 20}`} alt="Gallery" className="w-full h-auto" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <p className="text-sm text-slate-200 line-clamp-2">"A futuristic city with flying cars and neon lights in cyberpunk style"</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
        {/* Blog Mock */}
        <section id="blog" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
           <div className="flex justify-between items-end mb-12">
               <div>
                   <h2 className="text-3xl font-bold mb-2">Latest Insights</h2>
                   <p className="text-slate-400">Updates from the generative AI world.</p>
               </div>
               <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">View all posts &rarr;</a>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
               {[1, 2, 3].map((n) => (
                   <article key={n} className="group cursor-pointer">
                       <div className="rounded-xl overflow-hidden h-48 mb-4 relative">
                           <img src={`https://picsum.photos/500/300?random=${n + 50}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog" />
                       </div>
                       <div className="text-xs text-indigo-400 mb-2 font-medium">AI & DESIGN</div>
                       <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-300 transition-colors">The Future of Generative Interface Design</h3>
                       <p className="text-sm text-slate-500 line-clamp-2">How AI is changing the way we interact with digital tools and creative workflows.</p>
                   </article>
               ))}
           </div>
        </section>
      </main>

      {/* Mega Footer */}
      <footer className="border-t border-white/5 bg-slate-950 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-12 mb-16">
                  <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-6">
                          <LogoIcon />
                          <span className="text-xl font-bold">lulu</span>
                      </div>
                      <p className="text-slate-400 max-w-sm mb-6">
                          Empowering creators with the most advanced AI generation tools. 
                          Built for the future, available today.
                      </p>
                      <div className="glass-input p-1 rounded-full flex max-w-sm">
                          <input type="email" placeholder="Enter your email" className="bg-transparent border-none focus:ring-0 text-sm px-4 w-full text-white placeholder-slate-500" />
                          <button className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold hover:bg-slate-200">Subscribe</button>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold mb-6">Product</h4>
                      <ul className="space-y-4 text-sm text-slate-400">
                          <li><a href="#" className="hover:text-white">Features</a></li>
                          <li><a href="#" className="hover:text-white">Pricing</a></li>
                          <li><a href="#" className="hover:text-white">API</a></li>
                          <li><a href="#" className="hover:text-white">Gallery</a></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold mb-6">Company</h4>
                      <ul className="space-y-4 text-sm text-slate-400">
                          <li><a href="#" className="hover:text-white">About</a></li>
                          <li><a href="#" className="hover:text-white">Blog</a></li>
                          <li><a href="#" className="hover:text-white">Careers</a></li>
                          <li><a href="#" className="hover:text-white">Legal</a></li>
                      </ul>
                  </div>
              </div>
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                  <p>&copy; 2024 Lulu AI. All rights reserved.</p>
                  <div className="flex gap-6 mt-4 md:mt-0">
                      <a href="#" className="hover:text-white">Twitter</a>
                      <a href="#" className="hover:text-white">Instagram</a>
                      <a href="#" className="hover:text-white">Discord</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
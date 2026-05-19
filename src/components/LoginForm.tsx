import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Zap, User, Key, Moon, Sun as SunIcon, Loader2 } from 'lucide-react';

import { API_URL } from '../config';

// Login form component matching the reference design exactly
const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(''); // Changed from username to email
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Changed to unified login endpoint
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login successful
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChanged"));


      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-300 relative overflow-hidden ${theme === 'dark' ? 'bg-[#111827]' : 'bg-[#ECFDF5]'}`}>
      {/* Background Curve SVG */}
      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath clipPathUnits="objectBoundingBox" id="desktopCurve">
            <path d="M 0,0 L 1,0 C 1,0.35 0.75,0.65 0.9,1 L 0,1 Z"></path>
          </clipPath>
          <clipPath clipPathUnits="objectBoundingBox" id="mobileCurve">
            <polygon points="0 0, 1 0, 1 0.85, 0 1" />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#34D399]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className={`rounded-3xl shadow-2xl w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden relative z-10 animate-fade-in-up transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1F2937]' : 'bg-white'}`}>
        {/* Left Side */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-green-400 via-emerald-600 to-teal-800 relative p-8 md:p-12 flex flex-col justify-between text-white" style={{ clipPath: 'url(#desktopCurve)' }}>
          {/* For mobile responsiveness, the inline style for clipPath might need conditional logic or CSS class adjustment which mimics the HTML's behavior. 
                     The original HTML used a 'clip-curved' class which changed based on media query. 
                     Here, I will apply a style that works for desktop as a default, or use a responsive class approach if I added the CSS.
                     Since I can't easily inject the @media CSS into a style tag inside JSX cleanly without styled-components, 
                     I will rely on the fact that Tailwind container queries handles this or just stick to desktop curve for validation, 
                     or add a style tag.
                  */}
          <style>{`
                        .clip-custom {
                            clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);
                        }
                        @media (min-width: 768px) {
                            .clip-custom {
                                clip-path: url(#desktopCurve);
                            }
                        }
                    `}</style>

          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect fill="url(#grid)" height="100%" width="100%"></rect>
            </svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight opacity-90 drop-shadow-sm vertical-text-md">
              Welcome
            </h2>
          </div>
          <div className="relative z-10 flex-grow flex items-center justify-center py-8">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <img alt="Solar energy panels reflecting sun in a futuristic array" className="relative w-full h-full object-cover rounded-2xl shadow-lg border-2 border-white/30 rotate-3 hover:rotate-0 transition-transform duration-500 mask-image-gradient" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKw9Q5C2rt3a9M0heXOISE9R2uqLKyygxgKDfy4SQazq0zZDj3miWAFgWBKLqPEVruRCrxBRHS36qU9ThNVl0RqKlNtUPY6r7UZa2cxyUHC18dn5mFdTeALMmPlJ7aMBkTgfqsp5fg1cIlowrSP5HQ_aISTH0sj_mGsfJfqtU4DQrNHIeBZnMl0gRTpzAjGGnhX2CO8ca_cRO9rCOretS9zDAFEVwkQK0zsNAUPnErtOc_9inEFt-L0rCFTFUKa6ibqx99aI_K1Q" style={{ WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 100%)', maskImage: 'radial-gradient(circle, black 50%, transparent 100%)' }} />
              <div className="absolute -top-4 -right-4 bg-white/30 backdrop-blur-md p-2 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <Sun className="text-white w-6 h-6" />
              </div>
              <div className="absolute -bottom-2 -left-6 bg-white/30 backdrop-blur-md p-2 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
                <Zap className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm md:text-base font-medium text-teal-50 uppercase tracking-widest opacity-90 border-t border-white/20 pt-4">
              Introducing Solarica Nexus<br />Operating System
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={`w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1F2937]' : 'bg-white'}`}>
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h1 className={`text-3xl font-display font-bold mb-2 ${theme === 'dark' ? 'text-[#34D399]' : 'text-[#0F766E]'}`}>LOGIN</h1>
              <p className="text-gray-400 text-sm dark:text-gray-500">Access your energy dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="sr-only" htmlFor="email">Email</label>
                <input
                  className={`w-full pl-0 pr-10 py-3 bg-transparent border-0 border-b-2 focus:ring-0 focus:outline-none transition-colors duration-200 ${theme === 'dark' ? 'border-gray-700 text-gray-200 placeholder-gray-500 focus:border-[#34D399]' : 'border-gray-200 text-gray-700 placeholder-gray-400 focus:border-[#34D399]'}`}
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <User className={`absolute right-2 top-3 w-5 h-5 ${theme === 'dark' ? 'text-teal-500' : 'text-emerald-400'}`} />
              </div>
              <div className="relative mt-6">
                <label className="sr-only" htmlFor="password">Password</label>
                {/* <input
                  className={`w-full pl-0 pr-10 py-3 bg-transparent border-0 border-b-2 focus:ring-0 focus:outline-none transition-colors duration-200 ${theme === 'dark' ? 'border-gray-700 text-gray-200 placeholder-gray-500 focus:border-[#34D399]' : 'border-gray-200 text-gray-700 placeholder-gray-400 focus:border-[#34D399]'}`}
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> */}
                <input
  className={`w-full pl-0 pr-10 py-3 bg-transparent border-0 border-b-2 focus:ring-0 focus:outline-none transition-colors duration-200 ${theme === 'dark' ? 'border-gray-700 text-gray-200 placeholder-gray-500 focus:border-[#34D399]' : 'border-gray-200 text-gray-700 placeholder-gray-400 focus:border-[#34D399]'}`}
  id="password"
  name="password"
  placeholder="Password"
  required
  type={showPassword ? "text" : "password"}   // 👈 CHANGE HERE
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
                {/* <Key className={`absolute right-2 top-3 w-5 h-5 ${theme === 'dark' ? 'text-teal-500' : 'text-emerald-400'}`} /> */}
            
            <div
  className="absolute right-2 top-3 cursor-pointer"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? (
    <span className={`${theme === 'dark' ? 'text-teal-500' : 'text-emerald-400'}`}>
      👁️
    </span>
  ) : (
    <Key className={`${theme === 'dark' ? 'text-teal-500' : 'text-emerald-400'} w-5 h-5`} />
  )}
</div>
            
              </div>
              <div className="pt-8">
                <button
                  className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-offset-[#1F2937]"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-sm mt-8">
                <a className="text-gray-400 hover:text-[#34D399] dark:text-gray-500 dark:hover:text-[#34D399] transition-colors" href="#">Forgot?</a>
                <a className="text-gray-400 hover:text-[#34D399] dark:text-gray-500 dark:hover:text-[#34D399] transition-colors" href="#">Help</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button
          className="p-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-md text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

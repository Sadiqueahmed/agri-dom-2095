import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, Activity, CloudSun, ShieldCheck, Globe, Github, Linkedin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/contexts/AppSettingsContext';

export default function LandingPage() {
    const { settings, updateSetting } = useAppSettings();

    const toggleDarkMode = () => {
        updateSetting('darkMode', !settings.darkMode);
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${settings.darkMode ? 'bg-slate-950 text-slate-50' : 'bg-gradient-to-br from-green-50 to-emerald-100 text-slate-900'}`}>
            {/* Header */}
            <header className={`px-6 py-4 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${settings.darkMode ? 'border-slate-800 bg-slate-950/80' : 'border-emerald-100/50 bg-white/50'}`}>
                <div className="flex items-center space-x-2">
                    <Sprout className={`h-8 w-8 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r tracking-tight ${settings.darkMode ? 'from-emerald-400 to-green-500' : 'from-emerald-700 to-green-600'}`}>
                        Agri Dom
                    </span>
                </div>
                <nav className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        className={`mr-4 rounded-full transition-colors ${settings.darkMode ? 'text-amber-400 hover:bg-slate-800 hover:text-amber-300' : 'text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'}`}
                        aria-label="Toggle dark mode"
                    >
                        {settings.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Link to="/sign-in">
                        <Button variant="ghost" className={`mr-2 hidden sm:inline-flex font-medium ${settings.darkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800'}`}>
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/sign-in">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 font-semibold rounded-full px-6 transition-all hover:scale-105">
                            Explore Dashboard
                        </Button>
                    </Link>
                </nav>
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col justify-center items-center text-center">
                {/* Animated Badge */}
                <div className={`mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm shadow-sm animate-fade-in-up backdrop-blur-sm ${settings.darkMode ? 'border-emerald-800 bg-emerald-950/50 text-emerald-300' : 'border-emerald-200 bg-emerald-100/50 text-emerald-800'}`}>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    The Future of Digital Agriculture
                </div>

                <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Empowering Farmers with <span className={`text-transparent bg-clip-text bg-gradient-to-r ${settings.darkMode ? 'from-emerald-400 to-teal-400' : 'from-emerald-600 to-teal-500'}`}>Data-Driven</span> Insights.
                </h1>

                <p className={`text-xl md:text-2xl mb-10 max-w-2xl font-medium leading-relaxed ${settings.darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Manage your crops, monitor weather alerts, track finances, and optimize your yield—all from one highly intelligent unified dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
                    <Link to="/sign-in" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-full px-8 shadow-xl shadow-emerald-600/30 transition-all hover:translate-y-[-2px]">
                            Explore Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className={`w-full sm:w-auto h-14 text-lg font-bold rounded-full px-8 backdrop-blur-sm transition-all hover:translate-y-[-2px] ${settings.darkMode ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white/80 border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>
                        Learn More
                    </Button>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-8">
                    {/* Feature 1 */}
                    <div className={`backdrop-blur-lg border rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:shadow-xl group ${settings.darkMode ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-700 hover:shadow-emerald-900/20' : 'bg-white/70 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50'}`}>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform ${settings.darkMode ? 'bg-slate-800/80 shadow-slate-950' : 'bg-gradient-to-br from-emerald-100 to-green-50'}`}>
                            <Globe className={`h-8 w-8 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${settings.darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Live Integration</h3>
                        <p className={`leading-relaxed text-sm ${settings.darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Seamless connectivity with real-time public weather endpoints and local market data feeds.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className={`backdrop-blur-lg border rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:shadow-xl group ${settings.darkMode ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-700 hover:shadow-emerald-900/20' : 'bg-white/70 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50'}`}>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform ${settings.darkMode ? 'bg-slate-800/80 shadow-slate-950' : 'bg-gradient-to-br from-emerald-100 to-green-50'}`}>
                            <CloudSun className={`h-8 w-8 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${settings.darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Weather Alerts</h3>
                        <p className={`leading-relaxed text-sm ${settings.darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Advanced open-meteo AI parsing ensures you are never caught off guard by heavy droughts or monsoons.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className={`backdrop-blur-lg border rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:shadow-xl group ${settings.darkMode ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-700 hover:shadow-emerald-900/20' : 'bg-white/70 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50'}`}>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform ${settings.darkMode ? 'bg-slate-800/80 shadow-slate-950' : 'bg-gradient-to-br from-emerald-100 to-green-50'}`}>
                            <Activity className={`h-8 w-8 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${settings.darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Yield Tracking</h3>
                        <p className={`leading-relaxed text-sm ${settings.darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Dynamic operational tracking allowing complex ROI visualization and inventory management.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className={`backdrop-blur-lg border rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:shadow-xl group ${settings.darkMode ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-700 hover:shadow-emerald-900/20' : 'bg-white/70 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50'}`}>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform ${settings.darkMode ? 'bg-slate-800/80 shadow-slate-950' : 'bg-gradient-to-br from-emerald-100 to-green-50'}`}>
                            <ShieldCheck className={`h-8 w-8 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${settings.darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Fully Secure</h3>
                        <p className={`leading-relaxed text-sm ${settings.darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Agridom utilizes the Clerk robust infrastructure to securely scale and protect all authenticated layers.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`w-full mt-auto py-8 px-6 border-t backdrop-blur-md relative z-10 transition-colors duration-300 ${settings.darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-emerald-100/50 bg-white/30'}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className={`text-sm font-medium ${settings.darkMode ? 'text-slate-400' : 'text-emerald-800/80'}`}>
                        &copy; {new Date().getFullYear()} Agri Dom. Made by <span className={`font-bold ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>Sadique Ahmed</span>. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-6">
                        <a
                            href="https://github.com/Sadiqueahmed"
                            target="_blank"
                            rel="noreferrer"
                            className={`transition-colors flex items-center gap-2 text-sm font-medium ${settings.darkMode ? 'text-slate-400 hover:text-white' : 'text-emerald-700/70 hover:text-emerald-900'}`}
                            aria-label="GitHub Profile"
                        >
                            <Github className="h-5 w-5" />
                            <span>GitHub</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/sadique-ahmed-b2039524b/"
                            target="_blank"
                            rel="noreferrer"
                            className={`transition-colors flex items-center gap-2 text-sm font-medium ${settings.darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-emerald-700/70 hover:text-blue-700'}`}
                            aria-label="LinkedIn Profile"
                        >
                            <Linkedin className="h-5 w-5" />
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>
            </footer>

            {/* Decorative Background Elements */}
            <div className={`fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 transition-opacity duration-500 ${settings.darkMode ? 'opacity-20' : 'opacity-100'}`}>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-40 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NewsArticle {
    id: string;
    title: string;
    source: string;
    timestamp: string;
    category: 'Market' | 'Weather' | 'Subsidies' | 'Technology';
    summary: string;
    readTime: string;
}

const mockNews: NewsArticle[] = [
    {
        id: '1',
        title: 'Wheat Futures Surge Following Unseasonal Rains in the Midwest',
        source: 'AgriMarket Daily',
        timestamp: '2 hours ago',
        category: 'Market',
        summary: 'Unexpected precipitation has caused widespread speculation about the upcoming harvest, driving wheat prices up by 4.2% on the Chicago Board of Trade.',
        readTime: '3 min read'
    },
    {
        id: '2',
        title: 'New Government Subsidies Announced for Drip Irrigation Systems',
        source: 'Dept. of Agriculture',
        timestamp: '5 hours ago',
        category: 'Subsidies',
        summary: 'Farmers transitioning to water-efficient drip irrigation can now claim up to 40% rebate on installation costs under the newly launched WaterConservation Act.',
        readTime: '5 min read'
    },
    {
        id: '3',
        title: 'AI-Powered Drones: The Next Frontier in Pest Management',
        source: 'TechFarm Weekly',
        timestamp: 'Yesterday',
        category: 'Technology',
        summary: 'Recent field tests show that autonomous drones using computer vision can reduce pesticide use by up to 60% by targeting only infected crops.',
        readTime: '4 min read'
    },
    {
        id: '4',
        title: 'Soybean Exports Expected to Hit Record Highs This Quarter',
        source: 'Global Trade Insights',
        timestamp: 'Yesterday',
        category: 'Market',
        summary: 'Increased demand from Asian markets combined with a strong domestic yield positions soybean farmers for one of the most profitable quarters in a decade.',
        readTime: '6 min read'
    },
];

export const NewsFeed: React.FC = () => {
    const { settings } = useAppSettings();
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate fetching data
    useEffect(() => {
        const timer = setTimeout(() => {
            setArticles(mockNews);
            setIsLoading(false);
        }, 1500); // 1.5s simulated loading

        return () => clearTimeout(timer);
    }, []);

    const getCategoryColor = (category: NewsArticle['category']) => {
        switch (category) {
            case 'Market': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Weather': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
            case 'Subsidies': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'Technology': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <Card className="h-full flex flex-col border-emerald-100/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3 border-b border-emerald-50 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                            <Newspaper className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-800 dark:text-slate-100">Market & Agri News</CardTitle>
                            <CardDescription className="text-xs text-gray-500 dark:text-slate-400">Live updates and insights</CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hidden sm:flex text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-y-auto no-scrollbar">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex flex-col space-y-3 pb-4 border-b border-gray-100 dark:border-slate-800/50">
                                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-5/6"></div>
                                <div className="flex justify-between pt-2">
                                    <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-emerald-50 dark:divide-slate-800/50">
                        {articles.map((article) => (
                            <div key={article.id} className="p-5 hover:bg-emerald-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={`border-none ${getCategoryColor(article.category)}`}>
                                        {article.category}
                                    </Badge>
                                    <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {article.timestamp}
                                    </span>
                                </div>

                                <h4 className="font-semibold text-gray-800 dark:text-slate-200 text-sm md:text-base mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                    {article.title}
                                </h4>

                                <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                                    {article.summary}
                                </p>

                                <div className="flex justify-between items-center text-xs font-medium">
                                    <span className="text-emerald-600 dark:text-emerald-500 flex items-center">
                                        {article.source}
                                    </span>
                                    <div className="flex items-center text-gray-400 dark:text-slate-500">
                                        <span className="mr-3">{article.readTime}</span>
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

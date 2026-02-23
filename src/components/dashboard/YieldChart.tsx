import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Line
} from 'recharts';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface PerformanceData {
    name: string;
    current: number;
    target: number;
    unit: string;
}

interface YieldChartProps {
    data: PerformanceData[];
}

export const YieldChart: React.FC<YieldChartProps> = ({ data }) => {
    const { settings } = useAppSettings();

    return (
        <div className="w-full h-[400px] mt-6 bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-emerald-100 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-slate-200">
                Yield Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={settings.darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: settings.darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: settings.darkMode ? '#94a3b8' : '#64748b' }}
                    />
                    <Tooltip
                        cursor={{ fill: settings.darkMode ? '#1e293b' : '#f1f5f9' }}
                        contentStyle={{
                            backgroundColor: settings.darkMode ? '#0f172a' : '#ffffff',
                            borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
                            color: settings.darkMode ? '#f8fafc' : '#0f172a',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar
                        dataKey="current"
                        name="Current Yield"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                    <Line
                        type="monotone"
                        dataKey="target"
                        name="Target Yield"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: settings.darkMode ? '#0f172a' : '#ffffff' }}
                        activeDot={{ r: 8 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

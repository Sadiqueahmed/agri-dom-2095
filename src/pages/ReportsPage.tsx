import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Sprout, 
  CloudRain, 
  Sun,
  Droplet,
  Wind,
  Calendar,
  Wallet,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import { EditableField } from '../components/ui/editable-field';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import PageHeader from '../components/layout/PageHeader';
import PageLayout from '../components/layout/PageLayout';

// Sample data for reports
const financialData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 38000, profit: 14000 },
  { month: 'Mar', revenue: 58000, expenses: 42000, profit: 16000 },
  { month: 'Apr', revenue: 62000, expenses: 45000, profit: 17000 },
  { month: 'May', revenue: 68000, expenses: 48000, profit: 20000 },
  { month: 'Jun', revenue: 72000, expenses: 52000, profit: 20000 },
  { month: 'Jul', revenue: 75000, expenses: 55000, profit: 20000 },
];

const cropPerformanceData = [
  { crop: 'Rice', yield: 6.2, area: 25, revenue: 155000 },
  { crop: 'Wheat', yield: 4.8, area: 30, revenue: 144000 },
  { crop: 'Sugarcane', yield: 85, area: 15, revenue: 127500 },
  { crop: 'Cotton', yield: 2.1, area: 20, revenue: 84000 },
  { crop: 'Pulses', yield: 1.8, area: 18, revenue: 72000 },
];

const weatherImpactData = [
  { month: 'Jan', monsoon: 0, drought: 0, heatwave: 15, flood: 0 },
  { month: 'Feb', monsoon: 0, drought: 0, heatwave: 20, flood: 0 },
  { month: 'Mar', monsoon: 0, drought: 0, heatwave: 25, flood: 0 },
  { month: 'Apr', monsoon: 0, drought: 0, heatwave: 30, flood: 0 },
  { month: 'May', monsoon: 0, drought: 0, heatwave: 35, flood: 0 },
  { month: 'Jun', monsoon: 85, drought: 0, heatwave: 0, flood: 10 },
  { month: 'Jul', monsoon: 90, drought: 0, heatwave: 0, flood: 15 },
];

const recentReports = [
  {
    id: 1,
    title: 'Financial Performance Q2 2024',
    type: 'Financial Report',
    generated: '2024-07-15',
    status: 'Completed',
    format: 'PDF'
  },
  {
    id: 2,
    title: 'Crop Yield Analysis - Kharif Season',
    type: 'Crop Report',
    generated: '2024-07-10',
    status: 'Completed',
    format: 'Excel'
  },
  {
    id: 3,
    title: 'Weather Impact Assessment - Monsoon',
    type: 'Weather Report',
    generated: '2024-07-05',
    status: 'Completed',
    format: 'PDF'
  },
  {
    id: 4,
    title: 'Farm Performance Summary - June 2024',
    type: 'Performance Report',
    generated: '2024-06-30',
    status: 'Completed',
    format: 'CSV'
  }
];

const ReportsPage = () => {
  // State for the page
  const [title, setTitle] = useState('Agricultural Reports & Analytics');
  const [description, setDescription] = useState('Comprehensive reporting and analytics for your Indian agricultural operations');
  
  // Dialog states
  const [showGenerateReportDialog, setShowGenerateReportDialog] = useState(false);
  const [showReportPreviewDialog, setShowReportPreviewDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('Financial Report');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  // Form states
  const [reportConfig, setReportConfig] = useState({
    type: 'Financial Report',
    period: 'monthly',
    format: 'PDF',
    includeCharts: true,
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Handle changes
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast.success('Title updated');
  };

  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast.success('Description updated');
  };

  // Report operations
  const handleGenerateReport = () => {
    toast.success(`${reportConfig.type} generated successfully!`);
    setShowGenerateReportDialog(false);
    // In a real app, this would trigger report generation
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportPreviewDialog(true);
  };

  const handleExportReport = (report: any) => {
    toast.success(`${report.title} exported successfully!`);
  };

  const handleDeleteReport = (reportId: number) => {
    toast.success('Report deleted successfully!');
  };

  const handleExportAllReports = () => {
    toast.success('All reports exported successfully!');
  };

  // Chart colors
  const chartColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <PageLayout>
      <div className="space-y-6 animate-enter">
        {/* Header */}
        <PageHeader
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
        />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          className="bg-agri-primary hover:bg-agri-primary-dark"
          onClick={() => setShowGenerateReportDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
        <Button variant="outline" onClick={handleExportAllReports}>
          <Download className="h-4 w-4 mr-2" />
          Export All Reports
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter Reports
        </Button>
      </div>

      {/* Report Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reports */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{recentReports.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-blue-600">+2</span>
            <span className="text-muted-foreground ml-1">this month</span>
          </div>
        </div>

        {/* Financial Reports */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Financial Reports</p>
              <p className="text-2xl font-bold">₹4,25,000</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 12.3%</span>
            <span className="text-muted-foreground ml-1">vs last year</span>
          </div>
        </div>

        {/* Crop Reports */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Crop Performance</p>
              <p className="text-2xl font-bold">6.2 t/ha</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Sprout className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-orange-600">↑ 8.7%</span>
            <span className="text-muted-foreground ml-1">vs last season</span>
          </div>
        </div>

        {/* Weather Reports */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Weather Impact</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CloudRain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-purple-600">↓ 15%</span>
            <span className="text-muted-foreground ml-1">irrigation cost</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Performance Chart */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#374151' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.3}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Performance Chart */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Crop Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cropPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yield" fill="#8B5CF6" name="Yield (t/ha)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weather Impact Chart */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Weather Impact Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weatherImpactData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="monsoon" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.3}
              name="Monsoon (%)"
            />
            <Area 
              type="monotone" 
              dataKey="heatwave" 
              stroke="#F59E0B" 
              fill="#F59E0B" 
              fillOpacity={0.3}
              name="Heatwave (days)"
            />
            <Area 
              type="monotone" 
              dataKey="flood" 
              stroke="#EF4444" 
              fill="#EF4444" 
              fillOpacity={0.3}
              name="Flood (days)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Report Title</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Generated</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Format</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{report.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {report.generated}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {report.format}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportReport(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateReportDialog} onOpenChange={setShowGenerateReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Custom Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">
                Report Type
              </Label>
              <select
                id="reportType"
                value={reportConfig.type}
                onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Financial Report">Financial Report</option>
                <option value="Crop Report">Crop Report</option>
                <option value="Weather Report">Weather Report</option>
                <option value="Performance Report">Performance Report</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportPeriod" className="text-right">
                Period
              </Label>
              <select
                id="reportPeriod"
                value={reportConfig.period}
                onChange={(e) => setReportConfig({...reportConfig, period: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportFormat" className="text-right">
                Format
              </Label>
              <select
                id="reportFormat"
                value={reportConfig.format}
                onChange={(e) => setReportConfig({...reportConfig, format: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="includeCharts" className="text-right">
                Include Charts
              </Label>
              <input
                id="includeCharts"
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
                className="col-span-3 h-4 w-4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={reportConfig.dateRange.start}
                onChange={(e) => setReportConfig({
                  ...reportConfig, 
                  dateRange: {...reportConfig.dateRange, start: e.target.value}
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={reportConfig.dateRange.end}
                onChange={(e) => setReportConfig({
                  ...reportConfig, 
                  dateRange: {...reportConfig.dateRange, end: e.target.value}
                })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Preview Dialog */}
      <Dialog open={showReportPreviewDialog} onOpenChange={setShowReportPreviewDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {selectedReport.type}
                  </div>
                  <div>
                    <span className="font-medium">Generated:</span> {selectedReport.generated}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {selectedReport.status}
                  </div>
                  <div>
                    <span className="font-medium">Format:</span> {selectedReport.format}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-muted-foreground">
                    This is a preview of the {selectedReport.type.toLowerCase()}. 
                    The full report contains detailed analysis and insights for your agricultural operations.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportPreviewDialog(false)}>
              Close
            </Button>
            <Button onClick={() => selectedReport && handleExportReport(selectedReport)}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
                 </DialogContent>
       </Dialog>
       </div>
     </PageLayout>
   );
 };

export default ReportsPage;

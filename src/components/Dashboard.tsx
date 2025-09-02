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
  ArrowRight,
  Calendar,
  Wallet,
  Trash2,
  Plus,
  X,
  Check,
  Edit,
  MapPin
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { EditableField } from './ui/editable-field';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import PageHeader from './layout/PageHeader';
import WeatherForecast from './WeatherForecast';

// Sample data for charts - Adapted for Indian agriculture
const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 58000 },
  { month: 'Apr', revenue: 62000 },
  { month: 'May', revenue: 68000 },
  { month: 'Jun', revenue: 72000 },
  { month: 'Jul', revenue: 75000 },
];

const productionData = [
  { name: 'Rice', value: 35 },
  { name: 'Wheat', value: 25 },
  { name: 'Sugarcane', value: 15 },
  { name: 'Cotton', value: 12 },
  { name: 'Pulses', value: 13 },
];

// Task list adapted to Indian agricultural context
const initialUpcomingTasks = [
  { id: 1, title: 'Harvest wheat crop', due: 'Today', priority: 'high' },
  { id: 2, title: 'Prepare paddy fields for rice', due: 'Tomorrow', priority: 'medium' },
  { id: 3, title: 'Tractor maintenance', due: '28/08', priority: 'low' },
  { id: 4, title: 'Irrigate sugarcane fields', due: '30/08', priority: 'medium' },
];

// Alerts for farmers in India
const initialAlerts = [
  { id: 1, message: 'Low stock of wheat seeds', type: 'warning' },
  { id: 2, message: 'Monsoon forecast for next week', type: 'info' },
  { id: 3, message: 'Government subsidy deadline approaching', type: 'info' },
];

// Weather alerts data - Adapted for Indian regions
const initialWeatherAlerts = [
  { 
    id: 1, 
    type: 'Monsoon', 
    region: 'Maharashtra', 
    startDate: '2023-09-10', 
    endDate: '2023-09-12', 
    severity: 'moderate', 
    description: 'Heavy monsoon rains expected' 
  },
  { 
    id: 2, 
    type: 'Drought', 
    region: 'Rajasthan', 
    startDate: '2023-09-20', 
    endDate: '2023-09-23', 
    severity: 'critical', 
    description: 'Extended dry spell affecting crops' 
  }
];

const Dashboard = () => {
  // State for editable content
  const [title, setTitle] = useState('Hello, Indian Farmer');
  const [description, setDescription] = useState('Here is an overview of your agricultural operation in India');
  const [currentMonth, setCurrentMonth] = useState('August 2023');
  
  // Stats cards
  const [monthlyRevenue, setMonthlyRevenue] = useState(154500);
  const [revenueGrowth, setRevenueGrowth] = useState(8.5);
  const [cultivatedArea, setCultivatedArea] = useState(35);
  const [parcelsCount, setParcelsCount] = useState(5);
  const [averageYield, setAverageYield] = useState(75);
  const [yieldGrowth, setYieldGrowth] = useState(5.2);
  const [alertsCount, setAlertsCount] = useState(3);
  
  // Farm locations for weather forecasts
  const farmLocations = [
    { id: 1, name: 'Main Farm', location: 'Maharashtra, India' },
    { id: 2, name: 'Northern Fields', location: 'Punjab, India' },
    { id: 3, name: 'Southern Plantation', location: 'Tamil Nadu, India' }
  ];
  
  const [selectedLocation, setSelectedLocation] = useState(farmLocations[0].location);
  const [weatherAlertsCount, setWeatherAlertsCount] = useState(2);
  
  // Lists
  const [upcomingTasks, setUpcomingTasks] = useState(initialUpcomingTasks);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [weatherAlerts, setWeatherAlerts] = useState(initialWeatherAlerts);
  
  // Dialog states
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddAlertDialog, setShowAddAlertDialog] = useState(false);
  
  // Form states
  const [newTask, setNewTask] = useState({ title: '', due: '', priority: 'medium' });
  const [newAlert, setNewAlert] = useState({
    type: 'Monsoon',
    message: '',
    severity: 'Medium',
    region: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  // Editing states
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');



  // Handle changes
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast.success('Title updated');
  };

  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast.success('Description updated');
  };

  const handleMonthlyRevenueChange = (value: string | number) => {
    setMonthlyRevenue(Number(value));
    toast.success('Monthly revenue updated');
  };

  // Task operations
  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        due: newTask.due,
        priority: newTask.priority as 'high' | 'medium' | 'low'
      };
      setUpcomingTasks([...upcomingTasks, task]);
      setNewTask({ title: '', due: '', priority: 'medium' });
      setShowAddTaskDialog(false);
      toast.success('Task added successfully');
    }
  };

  const handleDeleteTask = (id: number) => {
    setUpcomingTasks(upcomingTasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const handleEditTask = (id: number) => {
    const task = upcomingTasks.find(t => t.id === id);
    if (task) {
      setEditingTask(id);
      setEditedTaskTitle(task.title);
    }
  };

  const handleSaveTaskEdit = (id: number) => {
    if (editedTaskTitle.trim()) {
      setUpcomingTasks(upcomingTasks.map(task => 
        task.id === id ? { ...task, title: editedTaskTitle } : task
      ));
      setEditingTask(null);
      setEditedTaskTitle('');
      toast.success('Task updated successfully');
    }
  };

  // Alert operations
  const handleAddAlert = () => {
    if (newAlert.message.trim()) {
      const alert = {
        id: Date.now(),
        message: newAlert.message,
        type: newAlert.type as 'warning' | 'info' | 'error'
      };
      setAlerts([...alerts, alert]);
      setNewAlert({ type: 'Monsoon', message: '', severity: 'Medium', region: '', startDate: '', endDate: '', description: '' });
      setShowAddAlertDialog(false);
      toast.success('Alert added successfully');
    }
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Alert deleted successfully');
  };

  // Weather alert operations
  const handleAddWeatherAlert = () => {
    if (newAlert.description && newAlert.region) {
      const alert = {
        id: Date.now(),
        type: newAlert.type as 'Monsoon' | 'Drought' | 'Heatwave' | 'Flood' | 'Cyclone',
        region: newAlert.region,
        startDate: newAlert.startDate || new Date().toISOString().split('T')[0],
        endDate: newAlert.endDate || new Date().toISOString().split('T')[0],
        severity: newAlert.severity as 'low' | 'moderate' | 'critical',
        description: newAlert.description
      };
      setWeatherAlerts([...weatherAlerts, alert]);
      setNewAlert({
        type: 'Monsoon',
        message: '',
        severity: 'Medium',
        region: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setShowAddAlertDialog(false);
      toast.success('Weather alert added successfully');
    }
  };

  const handleDeleteWeatherAlert = (id: number) => {
    setWeatherAlerts(weatherAlerts.filter(alert => alert.id !== id));
    toast.success('Weather alert deleted successfully');
  };

  const handleFinanceClick = () => {
    toast.success('Navigating to Finance page...');
    // In a real app, this would navigate to the finance page
  };

  return (
    <div className="p-6 space-y-6 animate-enter">
      {/* Header */}
      <PageHeader
        title={title}
        description={description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
      />

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">₹{monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+{revenueGrowth}%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </div>

        {/* Cultivated Area */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cultivated Area</p>
              <p className="text-2xl font-bold">{cultivatedArea} acres</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sprout className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-blue-600">+2.5%</span>
            <span className="text-muted-foreground ml-1">from last year</span>
          </div>
        </div>

        {/* Average Yield */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Yield</p>
              <p className="text-2xl font-bold">{averageYield}%</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-yellow-600">+{yieldGrowth}%</span>
            <span className="text-muted-foreground ml-1">from target</span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold">{alertsCount}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-red-600">-1</span>
            <span className="text-muted-foreground ml-1">from yesterday</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <Button variant="outline" size="sm" onClick={handleFinanceClick}>
              <ArrowRight className="h-4 w-4 ml-2" />
              View Details
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#374151' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Production Distribution */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Production Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#8D6E63" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Weather Forecast Section */}
      <div className="mb-6 bg-white rounded-xl border p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Weather Forecast</h3>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select 
              value={selectedLocation}
              onValueChange={setSelectedLocation}
              className="w-48"
            >
              {farmLocations.map(location => (
                <option key={location.id} value={location.location}>
                  {location.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <WeatherForecast location={selectedLocation} days={5} />
      </div>



      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddTaskDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' : 
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  {editingTask === task.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editedTaskTitle}
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                        className="w-48"
                      />
                      <Button size="sm" onClick={() => handleSaveTaskEdit(task.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium">{task.title}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{task.due}</span>
                  {editingTask !== task.id && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alerts</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddAlertDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' : 
                    alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <span>{alert.message}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Alerts Table */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Weather Alerts</h3>
          <p className="text-sm text-muted-foreground">Track weather alerts impacting agriculture across Indian states</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Region</th>
                <th className="text-left py-3 px-4 font-medium">Date Range</th>
                <th className="text-left py-3 px-4 font-medium">Severity</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weatherAlerts.map((alert) => (
                <tr key={alert.id} className="border-b">
                  <td className="px-4 py-3">
                    {alert.type === 'Cyclone' ? (
                      <span className="flex items-center text-red-500">
                        <Wind size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : alert.type === 'Monsoon' ? (
                      <span className="flex items-center text-blue-500">
                        <CloudRain size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : alert.type === 'Drought' ? (
                      <span className="flex items-center text-orange-500">
                        <Sun size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : alert.type === 'Heatwave' ? (
                      <span className="flex items-center text-red-600">
                        <Sun size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : alert.type === 'Flood' ? (
                      <span className="flex items-center text-blue-600">
                        <Droplet size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Wind size={16} className="mr-1" /> {alert.type}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EditableField
                      value={alert.region}
                      onSave={(value) => {
                        setWeatherAlerts(weatherAlerts.map(a => 
                          a.id === alert.id ? { ...a, region: String(value) } : a
                        ));
                        toast.success('Region updated');
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-muted-foreground">Start:</span>
                        <EditableField
                          value={alert.startDate}
                          type="date"
                          onSave={(value) => {
                            setWeatherAlerts(weatherAlerts.map(a => 
                              a.id === alert.id ? { ...a, startDate: String(value) } : a
                            ));
                            toast.success('Start date updated');
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">End:</span>
                        <EditableField
                          value={alert.endDate}
                          type="date"
                          onSave={(value) => {
                            setWeatherAlerts(weatherAlerts.map(a => 
                              a.id === alert.id ? { ...a, endDate: String(value) } : a
                            ));
                            toast.success('End date updated');
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      alert.severity === 'critical' 
                        ? 'bg-red-100 text-red-800' 
                        : alert.severity === 'moderate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      <EditableField
                        value={alert.severity}
                        onSave={(value) => {
                          setWeatherAlerts(weatherAlerts.map(a => 
                            a.id === alert.id ? { ...a, severity: String(value) } : a
                          ));
                          toast.success('Severity updated');
                        }}
                      />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EditableField
                      value={alert.description}
                      onSave={(value) => {
                        setWeatherAlerts(weatherAlerts.map(a => 
                          a.id === alert.id ? { ...a, description: String(value) } : a
                        ));
                        toast.success('Description updated');
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteWeatherAlert(alert.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskTitle" className="text-right">
                Title
              </Label>
              <Input
                id="taskTitle"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.due}
                onChange={(e) => setNewTask({...newTask, due: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Alert Dialog */}
      <Dialog open={showAddAlertDialog} onOpenChange={setShowAddAlertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new alert</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertMessage" className="text-right">
                Message
              </Label>
              <Input
                id="alertMessage"
                value={newAlert.message}
                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertType" className="text-right">
                Type
              </Label>
              <select
                id="alertType"
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAlertDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAlert}>Add Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Weather Alert Dialog */}
      <Dialog open={showAddAlertDialog} onOpenChange={setShowAddAlertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a weather alert</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertType" className="text-right">
                Type
              </Label>
              <select
                id="alertType"
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Monsoon">Monsoon</option>
                <option value="Drought">Drought</option>
                <option value="Heatwave">Heatwave</option>
                <option value="Flood">Flood</option>
                <option value="Cyclone">Cyclone</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Region
              </Label>
              <Input
                id="region"
                value={newAlert.region}
                onChange={(e) => setNewAlert({...newAlert, region: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newAlert.startDate}
                onChange={(e) => setNewAlert({...newAlert, startDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newAlert.endDate}
                onChange={(e) => setNewAlert({...newAlert, endDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="severity" className="text-right">
                Severity
              </Label>
              <select
                id="severity"
                value={newAlert.severity}
                onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAlertDialog(false)}>Cancel</Button>
            <Button onClick={handleAddWeatherAlert}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Dashboard;
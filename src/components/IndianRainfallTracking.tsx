import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { CloudRain, Droplets, Filter, Calendar, Download, PlusCircle, LineChart as LineChartIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RainfallData {
  id: number;
  month: string;
  year: number;
  amount: number;
  location: string;
  impact: 'Positive' | 'Neutral' | 'Negative';
  notes?: string;
}

const formSchema = z.object({
  month: z.string().min(1, { message: "Month is required" }),
  year: z.coerce.number().min(2000, { message: "Invalid year" }).max(2100),
  amount: z.coerce.number().min(0, { message: "Invalid value" }),
  location: z.string().min(1, { message: "Region is required" }),
  impact: z.enum(['Positive', 'Neutral', 'Negative']),
  notes: z.string().optional(),
});

const IndianRainfallTracking = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Rainfall Tracking in India');
  const [description, setDescription] = useState('Visualization of rainfall data to optimize crop management across Indian states');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [chartType, setChartType] = useState('bar');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "June",
      year: new Date().getFullYear(),
      amount: 0,
      location: "Maharashtra",
      impact: "Neutral",
      notes: "",
    },
  });
  
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([
    { id: 1, month: 'January', year: 2023, amount: 25, location: 'Maharashtra', impact: 'Neutral', notes: 'Winter season, low rainfall' },
    { id: 2, month: 'February', year: 2023, amount: 18, location: 'Maharashtra', impact: 'Neutral' },
    { id: 3, month: 'March', year: 2023, amount: 22, location: 'Maharashtra', impact: 'Neutral' },
    { id: 4, month: 'April', year: 2023, amount: 15, location: 'Maharashtra', impact: 'Negative', notes: 'Pre-monsoon dry spell' },
    { id: 5, month: 'May', year: 2023, amount: 28, location: 'Maharashtra', impact: 'Neutral' },
    { id: 6, month: 'June', year: 2023, amount: 180, location: 'Maharashtra', impact: 'Positive', notes: 'Monsoon onset' },
    { id: 7, month: 'July', year: 2023, amount: 320, location: 'Maharashtra', impact: 'Positive' },
    { id: 8, month: 'August', year: 2023, amount: 280, location: 'Maharashtra', impact: 'Positive' },
    { id: 9, month: 'September', year: 2023, amount: 200, location: 'Maharashtra', impact: 'Positive' },
    { id: 10, month: 'October', year: 2023, amount: 85, location: 'Maharashtra', impact: 'Positive', notes: 'Monsoon withdrawal' },
    { id: 11, month: 'November', year: 2023, amount: 35, location: 'Maharashtra', impact: 'Neutral' },
    { id: 12, month: 'December', year: 2023, amount: 20, location: 'Maharashtra', impact: 'Neutral' },
    { id: 13, month: 'January', year: 2023, amount: 15, location: 'Rajasthan', impact: 'Neutral' },
    { id: 14, month: 'February', year: 2023, amount: 12, location: 'Rajasthan', impact: 'Neutral' },
    { id: 15, month: 'March', year: 2023, amount: 18, location: 'Rajasthan', impact: 'Neutral' },
    { id: 16, month: 'April', year: 2023, amount: 8, location: 'Rajasthan', impact: 'Negative', notes: 'Arid conditions' },
    { id: 17, month: 'May', year: 2023, amount: 15, location: 'Rajasthan', impact: 'Neutral' },
    { id: 18, month: 'June', year: 2023, amount: 120, location: 'Rajasthan', impact: 'Positive', notes: 'Monsoon arrival' },
    { id: 19, month: 'July', year: 2023, amount: 200, location: 'Rajasthan', impact: 'Positive' },
    { id: 20, month: 'August', year: 2023, amount: 180, location: 'Rajasthan', impact: 'Positive' },
    { id: 21, month: 'September', year: 2023, amount: 140, location: 'Rajasthan', impact: 'Positive' },
    { id: 22, month: 'October', year: 2023, amount: 45, location: 'Rajasthan', impact: 'Neutral' },
    { id: 23, month: 'November', year: 2023, amount: 20, location: 'Rajasthan', impact: 'Neutral' },
    { id: 24, month: 'December', year: 2023, amount: 15, location: 'Rajasthan', impact: 'Neutral' },
    { id: 25, month: 'January', year: 2024, amount: 28, location: 'Maharashtra', impact: 'Positive' },
    { id: 26, month: 'February', year: 2024, amount: 22, location: 'Maharashtra', impact: 'Neutral' },
    { id: 27, month: 'March', year: 2024, amount: 25, location: 'Maharashtra', impact: 'Neutral' },
    { id: 28, month: 'January', year: 2024, amount: 18, location: 'Rajasthan', impact: 'Neutral' },
    { id: 29, month: 'February', year: 2024, amount: 15, location: 'Rajasthan', impact: 'Neutral' },
    { id: 30, month: 'March', year: 2024, amount: 20, location: 'Rajasthan', impact: 'Neutral' },
  ]);
  
  // Columns for the editable table
  const columns: Column[] = [
    { id: 'month', header: 'Month', accessorKey: 'month', isEditable: true },
    { id: 'year', header: 'Year', accessorKey: 'year', type: 'number', isEditable: true },
    { id: 'amount', header: 'Rainfall (mm)', accessorKey: 'amount', type: 'number', isEditable: true },
    { id: 'location', header: 'State', accessorKey: 'location', isEditable: true },
    { id: 'impact', header: 'Impact', accessorKey: 'impact', isEditable: true, options: ['Positive', 'Neutral', 'Negative'] },
    { id: 'notes', header: 'Notes', accessorKey: 'notes', isEditable: true }
  ];
  
  // Handlers
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast({
      title: "Title updated",
      description: "Module title has been successfully updated"
    });
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast({
      title: "Description updated",
      description: "Module description has been successfully updated"
    });
  };
  
  // Filter data
  const filteredData = rainfallData.filter(item => {
    const matchesSearch = 
      item.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesYear = filterYear === 'all' || item.year === Number(filterYear);
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    
    return matchesSearch && matchesYear && matchesLocation;
  });
  
  // Prepare data for the chart
  const uniqueMonths = Array.from(new Set(filteredData.map(item => item.month)));
  const uniqueLocations = Array.from(new Set(filteredData.map(item => item.location)));
  
  // Create aggregated data by month for the chart
  const chartData = uniqueMonths.map(month => {
    const dataPoint: any = { month };
    
    uniqueLocations.forEach(location => {
      const matchingData = filteredData.find(item => item.month === month && item.location === location);
      dataPoint[location] = matchingData ? matchingData.amount : 0;
    });
    
    return dataPoint;
  });
  
  // Handle table updates
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...rainfallData];
    const itemId = filteredData[rowIndex].id;
    const dataIndex = newData.findIndex(item => item.id === itemId);
    
    if (dataIndex !== -1) {
      const updatedItem = { ...newData[dataIndex] };
      
      if (columnId === 'year' || columnId === 'amount') {
        updatedItem[columnId] = Number(value);
      } else {
        updatedItem[columnId] = value;
      }
      
      newData[dataIndex] = updatedItem;
      setRainfallData(newData);
      
      toast({
        title: "Data updated",
        description: `Rainfall record for ${updatedItem.month} ${updatedItem.year} updated`
      });
    }
  };
  
  // Handle deletion
  const handleDeleteRow = (rowIndex: number) => {
    const itemId = filteredData[rowIndex].id;
    const newData = rainfallData.filter(item => item.id !== itemId);
    setRainfallData(newData);
    
    toast({
      title: "Data deleted",
      description: "Record successfully deleted"
    });
  };
  
  // Add a new row
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const newId = Math.max(0, ...rainfallData.map(item => item.id)) + 1;
    
    const newRow: RainfallData = {
      id: newId,
      month: data.month,
      year: data.year,
      amount: data.amount,
      location: data.location,
      impact: data.impact,
      notes: data.notes
    };
    
    setRainfallData([...rainfallData, newRow]);
    setDialogOpen(false);
    form.reset();
    
    toast({
      title: "Data added",
      description: `New record added for ${newRow.month} ${newRow.year}`
    });
  };
  
  // Download data
  const handleDownloadData = () => {
    // Create CSV content
    const headers = columns.map(col => col.header).join(',');
    const rows = rainfallData.map(item => {
      return `${item.month},${item.year},${item.amount},${item.location},${item.impact},${item.notes || ''}`;
    }).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `indian_rainfall_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download completed",
      description: "Rainfall data successfully exported to CSV"
    });
  };
  
  // Import CSV data
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      const lines = contents.split('\n');
      
      // Skip header
      const dataLines = lines.slice(1);
      
      const importedData: RainfallData[] = [];
      let lastId = Math.max(0, ...rainfallData.map(item => item.id));
      
      dataLines.forEach(line => {
        if (!line.trim()) return;
        
        const values = line.split(',');
        if (values.length >= 5) {
          lastId++;
          importedData.push({
            id: lastId,
            month: values[0],
            year: parseInt(values[1], 10),
            amount: parseFloat(values[2]),
            location: values[3],
            impact: values[4] as 'Positive' | 'Neutral' | 'Negative',
            notes: values[5]
          });
        }
      });
      
      if (importedData.length > 0) {
        setRainfallData([...rainfallData, ...importedData]);
        toast({
          title: "Import successful",
          description: `${importedData.length} records were successfully imported`
        });
      } else {
        toast({
          title: "No data imported",
          description: "The file does not contain valid data"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };
  
  // Calculate statistics
  const calculateStatistics = () => {
    if (filteredData.length === 0) return { avg: 0, max: 0, min: 0, total: 0 };
    
    const amounts = filteredData.map(item => item.amount);
    const sum = amounts.reduce((acc, val) => acc + val, 0);
    
    return {
      avg: Math.round(sum / amounts.length),
      max: Math.max(...amounts),
      min: Math.min(...amounts),
      total: sum
    };
  };
  
  const stats = calculateStatistics();
  
  // Unique years for filter
  const uniqueYears = Array.from(new Set(rainfallData.map(item => item.year))).sort((a, b) => b - a);
  
  // Get CSS class for impact
  const getImpactClass = (impact: string) => {
    switch (impact) {
      case 'Positive': return 'text-agri-success';
      case 'Negative': return 'text-agri-danger';
      default: return 'text-muted-foreground';
    }
  };

  // Colors for the chart
  const locationColors: {[key: string]: string} = {
    'Maharashtra': '#4CAF50',
    'Rajasthan': '#2196F3',
    'Punjab': '#FFC107',
    'Kerala': '#9C27B0',
    'Odisha': '#FF5722',
    'Gujarat': '#795548'
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <CloudRain className="h-6 w-6 mr-2 text-blue-500" />
            <EditableField
              value={title}
              onSave={handleTitleChange}
              className="inline-block"
            />
          </h2>
          <p className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={handleDescriptionChange}
              className="inline-block"
            />
          </p>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/30 rounded-lg p-4 border flex items-center space-x-3 hover:border-blue-200 transition-all">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Average</div>
              <div className="text-2xl font-bold">{stats.avg} mm</div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border flex items-center space-x-3 hover:border-green-200 transition-all">
            <Droplets className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-sm text-muted-foreground">Maximum</div>
              <div className="text-2xl font-bold">{stats.max} mm</div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border flex items-center space-x-3 hover:border-red-200 transition-all">
            <Droplets className="h-8 w-8 text-red-500" />
            <div>
              <div className="text-sm text-muted-foreground">Minimum</div>
              <div className="text-2xl font-bold">{stats.min} mm</div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border flex items-center space-x-3 hover:border-purple-200 transition-all">
            <Droplets className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{stats.total} mm</div>
            </div>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative flex-grow max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-10"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="w-[180px]">
              <CloudRain className="h-4 w-4 mr-2" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
              <SelectItem value="Punjab">Punjab</SelectItem>
              <SelectItem value="Kerala">Kerala</SelectItem>
              <SelectItem value="Odisha">Odisha</SelectItem>
              <SelectItem value="Gujarat">Gujarat</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2 ml-auto">
            <input
              type="file"
              id="csv-import"
              accept=".csv"
              className="hidden"
              onChange={handleImportData}
            />
            <label htmlFor="csv-import">
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Import CSV
                </span>
              </Button>
            </label>
            
            <Button variant="outline" size="sm" onClick={handleDownloadData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new record</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a month" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
                                  'September', 'October', 'November', 'December'].map(month => (
                                  <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rainfall (mm)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {uniqueLocations.map(location => (
                                  <SelectItem key={location} value={location}>{location}</SelectItem>
                                ))}
                                <SelectItem value="Punjab">Punjab</SelectItem>
                                <SelectItem value="Kerala">Kerala</SelectItem>
                                <SelectItem value="Odisha">Odisha</SelectItem>
                                <SelectItem value="Gujarat">Gujarat</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="impact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impact</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an impact" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Positive">Positive</SelectItem>
                              <SelectItem value="Neutral">Neutral</SelectItem>
                              <SelectItem value="Negative">Negative</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Chart type */}
        <Tabs value={chartType} onValueChange={setChartType} className="mb-6">
          <TabsList>
            <TabsTrigger value="bar">
              <BarChart className="h-4 w-4 mr-2" />
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="line">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line Chart
            </TabsTrigger>
            <TabsTrigger value="area">
              <CloudRain className="h-4 w-4 mr-2" />
              Area Chart
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Charts */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} mm`, '']} />
                <Legend />
                {uniqueLocations.map(location => (
                  <Bar 
                    key={location} 
                    dataKey={location} 
                    name={location} 
                    fill={locationColors[location] || '#8884d8'} 
                  />
                ))}
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} mm`, '']} />
                <Legend />
                {uniqueLocations.map(location => (
                  <Line 
                    key={location} 
                    type="monotone" 
                    dataKey={location} 
                    name={location} 
                    stroke={locationColors[location] || '#8884d8'} 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} mm`, '']} />
                <Legend />
                {uniqueLocations.map(location => (
                  <Area 
                    key={location} 
                    type="monotone" 
                    dataKey={location} 
                    name={location} 
                    fill={locationColors[location] || '#8884d8'} 
                    stroke={locationColors[location] || '#8884d8'} 
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Data table */}
        <EditableTable
          data={filteredData}
          columns={columns}
          onUpdate={handleTableUpdate}
          onDelete={handleDeleteRow}
          sortable={true}
        />
      </div>
    </div>
  );
};

export default IndianRainfallTracking;
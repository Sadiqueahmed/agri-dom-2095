import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { CloudLightning, CloudRain, Wind, Thermometer, Sun, AlertTriangle, Filter, Calendar, PlusCircle, ArrowDown, ArrowUp } from 'lucide-react';
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
import { Badge } from "./ui/badge";
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

interface WeatherAlert {
  id: number;
  date: string;
  type: 'Monsoon' | 'Drought' | 'Heatwave' | 'Flood' | 'Cyclone';
  region: string;
  severity: 'Low' | 'Medium' | 'High' | 'Extreme';
  impactCrops: 'Low' | 'Moderate' | 'Severe';
  description: string;
  recommendation: string;
  status: 'Active' | 'Completed' | 'Scheduled';
}

const alertFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  type: z.enum(['Monsoon', 'Drought', 'Heatwave', 'Flood', 'Cyclone']),
  region: z.string().min(1, { message: "Region is required" }),
  severity: z.enum(['Low', 'Medium', 'High', 'Extreme']),
  impactCrops: z.enum(['Low', 'Moderate', 'Severe']),
  description: z.string().min(5, { message: "Description too short" }),
  recommendation: z.string().min(5, { message: "Recommendation too short" }),
  status: z.enum(['Active', 'Completed', 'Scheduled']),
});

const IndianWeatherAlerts = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Weather Alerts in India');
  const [description, setDescription] = useState('Track weather alerts impacting crops across Indian states and prepare your preventive actions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      type: 'Monsoon',
      region: 'Maharashtra',
      severity: 'Medium',
      impactCrops: 'Moderate',
      description: '',
      recommendation: '',
      status: 'Active',
    },
  });
  
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([
    {
      id: 1,
      date: '2024-06-15',
      type: 'Monsoon',
      region: 'Maharashtra',
      severity: 'High',
      impactCrops: 'Moderate',
      description: 'Heavy monsoon rains expected for 48 hours with flood risk in low-lying areas.',
      recommendation: 'Check field drainage and protect young plants. Temporarily suspend irrigation.',
      status: 'Active'
    },
    {
      id: 2,
      date: '2024-06-20',
      type: 'Drought',
      region: 'Rajasthan',
      severity: 'Extreme',
      impactCrops: 'Severe',
      description: 'Extended dry spell affecting crops with water scarcity in multiple districts.',
      recommendation: 'Implement water conservation measures. Consider drought-resistant crop varieties.',
      status: 'Active'
    },
    {
      id: 3,
      date: '2024-06-25',
      type: 'Heatwave',
      region: 'Delhi NCR',
      severity: 'High',
      impactCrops: 'Moderate',
      description: 'Temperatures expected to exceed 45°C for next 5 days.',
      recommendation: 'Increase irrigation frequency. Provide shade for sensitive crops.',
      status: 'Scheduled'
    },
    {
      id: 4,
      date: '2024-06-28',
      type: 'Flood',
      region: 'Kerala',
      severity: 'High',
      impactCrops: 'Severe',
      description: 'Heavy rainfall causing flooding in coastal areas and river basins.',
      recommendation: 'Harvest mature crops immediately. Move livestock to higher ground.',
      status: 'Active'
    },
    {
      id: 5,
      date: '2024-07-01',
      type: 'Cyclone',
      region: 'Odisha',
      severity: 'Extreme',
      impactCrops: 'Severe',
      description: 'Cyclone approaching with winds potentially exceeding 120 km/h and heavy rainfall.',
      recommendation: 'Preventively harvest mature crops. Secure agricultural equipment and structures.',
      status: 'Scheduled'
    }
  ]);

  const columns: Column<WeatherAlert>[] = [
    {
      key: 'date',
      header: 'Date',
      cell: (record) => (
        <EditableField
          value={record.date}
          type="date"
          onSave={(value) => handleEditAlert(record.id, 'date', String(value))}
        />
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (record) => (
        <div className="flex items-center space-x-2">
          {record.type === 'Monsoon' && <CloudRain className="h-4 w-4 text-blue-500" />}
          {record.type === 'Drought' && <Sun className="h-4 w-4 text-orange-500" />}
          {record.type === 'Heatwave' && <Thermometer className="h-4 w-4 text-red-500" />}
          {record.type === 'Flood' && <CloudRain className="h-4 w-4 text-blue-600" />}
          {record.type === 'Cyclone' && <Wind className="h-4 w-4 text-red-600" />}
          <EditableField
            value={record.type}
            onSave={(value) => handleEditAlert(record.id, 'type', String(value))}
          />
        </div>
      ),
    },
    {
      key: 'region',
      header: 'Region',
      cell: (record) => (
        <EditableField
          value={record.region}
          onSave={(value) => handleEditAlert(record.id, 'region', String(value))}
        />
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      cell: (record) => (
        <Badge 
          variant={record.severity === 'Low' ? 'outline' : 
                  record.severity === 'Medium' ? 'secondary' :
                  record.severity === 'High' ? 'default' : 'destructive'}
        >
          <EditableField
            value={record.severity}
            onSave={(value) => handleEditAlert(record.id, 'severity', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'impactCrops',
      header: 'Crop Impact',
      cell: (record) => (
        <Badge 
          variant={record.impactCrops === 'Low' ? 'outline' : 
                  record.impactCrops === 'Moderate' ? 'secondary' : 'destructive'}
        >
          <EditableField
            value={record.impactCrops}
            onSave={(value) => handleEditAlert(record.id, 'impactCrops', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (record) => (
        <EditableField
          value={record.description}
          onSave={(value) => handleEditAlert(record.id, 'description', String(value))}
        />
      ),
    },
    {
      key: 'recommendation',
      header: 'Recommendation',
      cell: (record) => (
        <EditableField
          value={record.recommendation}
          onSave={(value) => handleEditAlert(record.id, 'recommendation', String(value))}
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (record) => (
        <Badge 
          variant={record.status === 'Active' ? 'default' : 
                  record.status === 'Scheduled' ? 'secondary' : 'outline'}
        >
          <EditableField
            value={record.status}
            onSave={(value) => handleEditAlert(record.id, 'status', String(value))}
          />
        </Badge>
      ),
    },
  ];

  const handleEditAlert = (id: number, field: keyof WeatherAlert, value: any) => {
    setWeatherAlerts(alerts => 
      alerts.map(alert => 
        alert.id === id ? { ...alert, [field]: value } : alert
      )
    );
    toast({
      title: "Alert updated",
      description: `${field} has been updated successfully.`,
    });
  };

  const handleDeleteAlert = (id: number) => {
    setWeatherAlerts(alerts => alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert deleted",
      description: "Weather alert has been deleted successfully.",
    });
  };

  const handleAddAlert = (values: z.infer<typeof alertFormSchema>) => {
    const newAlert: WeatherAlert = {
      id: Math.max(...weatherAlerts.map(a => a.id), 0) + 1,
      ...values,
    };
    setWeatherAlerts(alerts => [...alerts, newAlert]);
    setDialogOpen(false);
    form.reset();
    toast({
      title: "Alert added",
      description: "New weather alert has been added successfully.",
    });
  };

  const filteredAlerts = weatherAlerts.filter(alert => {
    const matchesSearch = alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeAlerts = weatherAlerts.filter(alert => alert.status === 'Active').length;
  const extremeAlerts = weatherAlerts.filter(alert => alert.severity === 'Extreme').length;
  const severeImpactAlerts = weatherAlerts.filter(alert => alert.impactCrops === 'Severe').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <EditableField
              value={title}
              onSave={setTitle}
              className="inline-block"
              showEditIcon={true}
            />
          </h1>
          <p className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={setDescription}
              className="inline-block"
              showEditIcon={true}
            />
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-agri-primary hover:bg-agri-primary-dark">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Weather Alert</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddAlert)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monsoon">Monsoon</SelectItem>
                            <SelectItem value="Drought">Drought</SelectItem>
                            <SelectItem value="Heatwave">Heatwave</SelectItem>
                            <SelectItem value="Flood">Flood</SelectItem>
                            <SelectItem value="Cyclone">Cyclone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="Odisha">Odisha</SelectItem>
                            <SelectItem value="Punjab">Punjab</SelectItem>
                            <SelectItem value="Haryana">Haryana</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="West Bengal">West Bengal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Extreme">Extreme</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="impactCrops"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Impact</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recommendation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Alert</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold">{activeAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Extreme Severity</p>
              <p className="text-2xl font-bold">{extremeAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Severe Crop Impact</p>
              <p className="text-2xl font-bold">{severeImpactAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search alerts by type, region, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Extreme">Extreme</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerts Table */}
        <EditableTable
          data={filteredAlerts}
          columns={columns}
          onDelete={handleDeleteAlert}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default IndianWeatherAlerts;
import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { MapPin, Ruler, Droplets, Sun, PlusCircle, Trash2, Edit, Eye, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
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

interface Plot {
  id: number;
  name: string;
  area: number;
  unit: 'hectares' | 'acres';
  location: string;
  soilType: 'Clay' | 'Loam' | 'Sandy' | 'Red Soil' | 'Black Soil' | 'Alluvial';
  irrigationType: 'Drip' | 'Sprinkler' | 'Flood' | 'Manual' | 'Canal';
  currentCrop: string;
  cropStage: 'Planted' | 'Growing' | 'Flowering' | 'Fruiting' | 'Harvest Ready' | 'Fallow';
  lastIrrigation: string;
  nextIrrigation: string;
  soilMoisture: 'Low' | 'Medium' | 'High' | 'Optimal';
  notes: string;
}

const plotFormSchema = z.object({
  name: z.string().min(1, { message: "Plot name is required" }),
  area: z.number().min(0.1, { message: "Area must be greater than 0" }),
  unit: z.enum(['hectares', 'acres']),
  location: z.string().min(1, { message: "Location is required" }),
  soilType: z.enum(['Clay', 'Loam', 'Sandy', 'Red Soil', 'Black Soil', 'Alluvial']),
  irrigationType: z.enum(['Drip', 'Sprinkler', 'Flood', 'Manual', 'Canal']),
  currentCrop: z.string().min(1, { message: "Current crop is required" }),
  cropStage: z.enum(['Planted', 'Growing', 'Flowering', 'Fruiting', 'Harvest Ready', 'Fallow']),
  lastIrrigation: z.string().min(1, { message: "Last irrigation date is required" }),
  nextIrrigation: z.string().min(1, { message: "Next irrigation date is required" }),
  soilMoisture: z.enum(['Low', 'Medium', 'High', 'Optimal']),
  notes: z.string().optional(),
});

const IndianParcelManagement = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Plot Management in India');
  const [description, setDescription] = useState('Manage your agricultural plots across different Indian states');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSoilType, setFilterSoilType] = useState('all');
  const [filterCropStage, setFilterCropStage] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof plotFormSchema>>({
    resolver: zodResolver(plotFormSchema),
    defaultValues: {
      name: '',
      area: 0,
      unit: 'hectares',
      location: 'Punjab',
      soilType: 'Loam',
      irrigationType: 'Drip',
      currentCrop: 'Rice',
      cropStage: 'Planted',
      lastIrrigation: new Date().toISOString().slice(0, 10),
      nextIrrigation: new Date().toISOString().slice(0, 10),
      soilMoisture: 'Medium',
      notes: '',
    },
  });
  
  const [plots, setPlots] = useState<Plot[]>([
    {
      id: 1,
      name: 'Plot A1',
      area: 2.5,
      unit: 'hectares',
      location: 'Punjab',
      soilType: 'Loam',
      irrigationType: 'Drip',
      currentCrop: 'Rice',
      cropStage: 'Growing',
      lastIrrigation: '2024-06-20',
      nextIrrigation: '2024-06-25',
      soilMoisture: 'Optimal',
      notes: 'Excellent soil quality, good drainage'
    },
    {
      id: 2,
      name: 'Plot B2',
      area: 3.0,
      unit: 'hectares',
      location: 'Haryana',
      soilType: 'Clay',
      irrigationType: 'Sprinkler',
      currentCrop: 'Wheat',
      cropStage: 'Harvest Ready',
      lastIrrigation: '2024-06-18',
      nextIrrigation: '2024-06-28',
      soilMoisture: 'Medium',
      notes: 'Heavy soil, requires careful water management'
    },
    {
      id: 3,
      name: 'Plot C3',
      area: 1.8,
      unit: 'hectares',
      location: 'Maharashtra',
      soilType: 'Red Soil',
      irrigationType: 'Drip',
      currentCrop: 'Sugarcane',
      cropStage: 'Fruiting',
      lastIrrigation: '2024-06-22',
      nextIrrigation: '2024-06-27',
      soilMoisture: 'High',
      notes: 'Red soil with good organic content'
    },
    {
      id: 4,
      name: 'Plot D4',
      area: 2.2,
      unit: 'hectares',
      location: 'Gujarat',
      soilType: 'Black Soil',
      irrigationType: 'Canal',
      currentCrop: 'Cotton',
      cropStage: 'Flowering',
      lastIrrigation: '2024-06-19',
      nextIrrigation: '2024-06-26',
      soilMoisture: 'Low',
      notes: 'Black cotton soil, excellent for cotton cultivation'
    },
    {
      id: 5,
      name: 'Plot E5',
      area: 1.5,
      unit: 'hectares',
      location: 'Madhya Pradesh',
      soilType: 'Alluvial',
      irrigationType: 'Flood',
      currentCrop: 'Pulses',
      cropStage: 'Growing',
      lastIrrigation: '2024-06-21',
      nextIrrigation: '2024-06-29',
      soilMoisture: 'Medium',
      notes: 'Alluvial soil near river, good for pulses'
    }
  ]);

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Plot Name',
      cell: (record) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
          <EditableField
            value={record.name}
            onSave={(value) => handleEditPlot(record.id, 'name', String(value))}
          />
        </div>
      ),
    },
    {
      key: 'area',
      header: 'Area',
      cell: (record) => (
        <div className="flex items-center space-x-1">
          <Ruler className="h-4 w-4 text-green-500" />
          <EditableField
            value={record.area}
            type="number"
            onSave={(value) => handleEditPlot(record.id, 'area', Number(value))}
          />
          <span className="text-xs text-muted-foreground">{record.unit}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      cell: (record) => (
        <EditableField
          value={record.location}
          onSave={(value) => handleEditPlot(record.id, 'location', String(value))}
        />
      ),
    },
    {
      key: 'soilType',
      header: 'Soil Type',
      cell: (record) => (
        <Badge variant="outline">
          <EditableField
            value={record.soilType}
            onSave={(value) => handleEditPlot(record.id, 'soilType', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'irrigationType',
      header: 'Irrigation',
      cell: (record) => (
        <div className="flex items-center">
          <Droplets className="h-4 w-4 mr-2 text-blue-500" />
          <EditableField
            value={record.irrigationType}
            onSave={(value) => handleEditPlot(record.id, 'irrigationType', String(value))}
          />
        </div>
      ),
    },
    {
      key: 'currentCrop',
      header: 'Current Crop',
      cell: (record) => (
        <EditableField
          value={record.currentCrop}
          onSave={(value) => handleEditPlot(record.id, 'currentCrop', String(value))}
        />
      ),
    },
    {
      key: 'cropStage',
      header: 'Stage',
      cell: (record) => (
        <Badge 
          variant={record.cropStage === 'Harvest Ready' ? 'default' : 
                  record.cropStage === 'Growing' ? 'secondary' :
                  record.cropStage === 'Fruiting' ? 'outline' : 'destructive'}
        >
          <EditableField
            value={record.cropStage}
            onSave={(value) => handleEditPlot(record.id, 'cropStage', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'soilMoisture',
      header: 'Moisture',
      cell: (record) => (
        <Badge 
          variant={record.soilMoisture === 'Optimal' ? 'default' : 
                  record.soilMoisture === 'High' ? 'secondary' :
                  record.soilMoisture === 'Medium' ? 'outline' : 'destructive'}
        >
          <EditableField
            value={record.soilMoisture}
            onSave={(value) => handleEditPlot(record.id, 'soilMoisture', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'nextIrrigation',
      header: 'Next Irrigation',
      cell: (record) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
          <EditableField
            value={record.nextIrrigation}
            type="date"
            onSave={(value) => handleEditPlot(record.id, 'nextIrrigation', String(value))}
          />
        </div>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      cell: (record) => (
        <EditableField
          value={record.notes}
          onSave={(value) => handleEditPlot(record.id, 'notes', String(value))}
        />
      ),
    },
  ];

  const handleEditPlot = (id: number, field: keyof Plot, value: any) => {
    setPlots(plots => 
      plots.map(plot => 
        plot.id === id ? { ...plot, [field]: value } : plot
      )
    );
    toast({
      title: "Plot updated",
      description: `${field} has been updated successfully.`,
    });
  };

  const handleDeletePlot = (id: number) => {
    setPlots(plots => plots.filter(plot => plot.id !== id));
    toast({
      title: "Plot deleted",
      description: "Plot has been deleted successfully.",
    });
  };

  const handleAddPlot = (values: z.infer<typeof plotFormSchema>) => {
    const newPlot: Plot = {
      id: Math.max(...plots.map(p => p.id), 0) + 1,
      ...values,
    };
    setPlots(plots => [...plots, newPlot]);
    setDialogOpen(false);
    form.reset();
    toast({
      title: "Plot added",
      description: "New plot has been added successfully.",
    });
  };

  const filteredPlots = plots.filter(plot => {
    const matchesSearch = plot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plot.currentCrop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSoilType = filterSoilType === 'all' || plot.soilType === filterSoilType;
    const matchesCropStage = filterCropStage === 'all' || plot.cropStage === filterCropStage;
    
    return matchesSearch && matchesSoilType && matchesCropStage;
  });

  const totalArea = plots.reduce((sum, plot) => {
    if (plot.unit === 'acres') return sum + (plot.area * 0.404686); // Convert acres to hectares
    return sum + plot.area;
  }, 0);

  const plotsNeedingIrrigation = plots.filter(plot => {
    const nextIrrigation = new Date(plot.nextIrrigation);
    const today = new Date();
    const diffTime = nextIrrigation.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  }).length;

  const harvestReadyPlots = plots.filter(plot => plot.cropStage === 'Harvest Ready').length;

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
              Add Plot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Plot</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddPlot)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plot Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hectares">Hectares</SelectItem>
                            <SelectItem value="acres">Acres</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Punjab">Punjab</SelectItem>
                            <SelectItem value="Haryana">Haryana</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
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
                    name="soilType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soil Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Clay">Clay</SelectItem>
                            <SelectItem value="Loam">Loam</SelectItem>
                            <SelectItem value="Sandy">Sandy</SelectItem>
                            <SelectItem value="Red Soil">Red Soil</SelectItem>
                            <SelectItem value="Black Soil">Black Soil</SelectItem>
                            <SelectItem value="Alluvial">Alluvial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="irrigationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Irrigation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Drip">Drip</SelectItem>
                            <SelectItem value="Sprinkler">Sprinkler</SelectItem>
                            <SelectItem value="Flood">Flood</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Canal">Canal</SelectItem>
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
                    name="currentCrop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Crop</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cropStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Planted">Planted</SelectItem>
                            <SelectItem value="Growing">Growing</SelectItem>
                            <SelectItem value="Flowering">Flowering</SelectItem>
                            <SelectItem value="Fruiting">Fruiting</SelectItem>
                            <SelectItem value="Harvest Ready">Harvest Ready</SelectItem>
                            <SelectItem value="Fallow">Fallow</SelectItem>
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
                    name="lastIrrigation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Irrigation</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nextIrrigation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Irrigation</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="soilMoisture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Moisture</FormLabel>
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
                          <SelectItem value="Optimal">Optimal</SelectItem>
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
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Plot</Button>
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
              <p className="text-sm font-medium text-muted-foreground">Total Area</p>
              <p className="text-2xl font-bold">{totalArea.toFixed(1)} ha</p>
            </div>
            <Ruler className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Need Irrigation</p>
              <p className="text-2xl font-bold">{plotsNeedingIrrigation}</p>
            </div>
            <Droplets className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Harvest Ready</p>
              <p className="text-2xl font-bold">{harvestReadyPlots}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search plots by name, location, or crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterSoilType} onValueChange={setFilterSoilType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Soil Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Soil Types</SelectItem>
                <SelectItem value="Clay">Clay</SelectItem>
                <SelectItem value="Loam">Loam</SelectItem>
                <SelectItem value="Sandy">Sandy</SelectItem>
                <SelectItem value="Red Soil">Red Soil</SelectItem>
                <SelectItem value="Black Soil">Black Soil</SelectItem>
                <SelectItem value="Alluvial">Alluvial</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCropStage} onValueChange={setFilterCropStage}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Planted">Planted</SelectItem>
                <SelectItem value="Growing">Growing</SelectItem>
                <SelectItem value="Flowering">Flowering</SelectItem>
                <SelectItem value="Fruiting">Fruiting</SelectItem>
                <SelectItem value="Harvest Ready">Harvest Ready</SelectItem>
                <SelectItem value="Fallow">Fallow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plots Table */}
        <EditableTable
          data={filteredPlots}
          columns={columns}
          onDelete={handleDeletePlot}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default IndianParcelManagement;
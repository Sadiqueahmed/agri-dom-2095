import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { Sprout, TrendingUp, TrendingDown, Calendar, PlusCircle, ArrowDown, ArrowUp } from 'lucide-react';
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

interface CropData {
  id: number;
  name: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  region: string;
  area: number;
  unit: 'hectares' | 'acres';
  expectedYield: number;
  yieldUnit: 'tonnes' | 'quintals' | 'kg';
  status: 'Growing' | 'Harvested' | 'Planned' | 'Completed';
  notes: string;
}

const cropFormSchema = z.object({
  name: z.string().min(1, { message: "Crop name is required" }),
  variety: z.string().min(1, { message: "Variety is required" }),
  season: z.enum(['Kharif', 'Rabi', 'Zaid']),
  region: z.string().min(1, { message: "Region is required" }),
  area: z.number().min(0.1, { message: "Area must be greater than 0" }),
  unit: z.enum(['hectares', 'acres']),
  expectedYield: z.number().min(0, { message: "Expected yield must be 0 or greater" }),
  yieldUnit: z.enum(['tonnes', 'quintals', 'kg']),
  status: z.enum(['Growing', 'Harvested', 'Planned', 'Completed']),
  notes: z.string().optional(),
});

const IndianSpecificCrops = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Indian Specific Crops');
  const [description, setDescription] = useState('Manage and track your Indian agricultural crops across different seasons');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeason, setFilterSeason] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof cropFormSchema>>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      name: 'Rice',
      variety: 'Basmati',
      season: 'Kharif',
      region: 'Punjab',
      area: 0,
      unit: 'hectares',
      expectedYield: 0,
      yieldUnit: 'tonnes',
      status: 'Planned',
      notes: '',
    },
  });
  
  const [cropsData, setCropsData] = useState<CropData[]>([
    {
      id: 1,
      name: 'Rice',
      variety: 'Basmati',
      season: 'Kharif',
      region: 'Punjab',
      area: 25,
      unit: 'hectares',
      expectedYield: 75,
      yieldUnit: 'tonnes',
      status: 'Growing',
      notes: 'Premium quality Basmati rice, excellent for export'
    },
    {
      id: 2,
      name: 'Wheat',
      variety: 'Durum',
      season: 'Rabi',
      region: 'Haryana',
      area: 30,
      unit: 'hectares',
      expectedYield: 90,
      yieldUnit: 'tonnes',
      status: 'Harvested',
      notes: 'Good yield despite late sowing, quality is excellent'
    },
    {
      id: 3,
      name: 'Sugarcane',
      variety: 'Co 86032',
      season: 'Kharif',
      region: 'Maharashtra',
      area: 15,
      unit: 'hectares',
      expectedYield: 600,
      yieldUnit: 'tonnes',
      status: 'Growing',
      notes: 'High sugar content variety, suitable for jaggery production'
    },
    {
      id: 4,
      name: 'Cotton',
      variety: 'BT Cotton',
      season: 'Kharif',
      region: 'Gujarat',
      area: 20,
      unit: 'hectares',
      expectedYield: 24,
      yieldUnit: 'quintals',
      status: 'Growing',
      notes: 'BT variety with good pest resistance'
    },
    {
      id: 5,
      name: 'Pulses',
      variety: 'Toor Dal',
      season: 'Kharif',
      region: 'Madhya Pradesh',
      area: 12,
      unit: 'hectares',
      expectedYield: 18,
      yieldUnit: 'quintals',
      status: 'Planned',
      notes: 'Planning for next season, good market demand'
    },
    {
      id: 6,
      name: 'Maize',
      variety: 'Hybrid',
      season: 'Kharif',
      region: 'Karnataka',
      area: 18,
      unit: 'hectares',
      expectedYield: 54,
      yieldUnit: 'tonnes',
      status: 'Growing',
      notes: 'Hybrid variety with high yield potential'
    }
  ]);

  const columns: Column<CropData>[] = [
    {
      key: 'name',
      header: 'Crop',
      cell: (record) => (
        <div className="flex items-center">
          <Sprout className="h-4 w-4 mr-2 text-green-500" />
          <EditableField
            value={record.name}
            onSave={(value) => handleEditCrop(record.id, 'name', String(value))}
          />
        </div>
      ),
    },
    {
      key: 'variety',
      header: 'Variety',
      cell: (record) => (
        <EditableField
          value={record.variety}
          onSave={(value) => handleEditCrop(record.id, 'variety', String(value))}
        />
      ),
    },
    {
      key: 'season',
      header: 'Season',
      cell: (record) => (
        <Badge 
          variant={record.season === 'Kharif' ? 'default' : 
                  record.season === 'Rabi' ? 'secondary' : 'outline'}
        >
          <EditableField
            value={record.season}
            onSave={(value) => handleEditCrop(record.id, 'season', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'region',
      header: 'Region',
      cell: (record) => (
        <EditableField
          value={record.region}
          onSave={(value) => handleEditCrop(record.id, 'region', String(value))}
        />
      ),
    },
    {
      key: 'area',
      header: 'Area',
      cell: (record) => (
        <div className="flex items-center space-x-1">
          <EditableField
            value={record.area}
            type="number"
            onSave={(value) => handleEditCrop(record.id, 'area', Number(value))}
          />
          <span className="text-xs text-muted-foreground">{record.unit}</span>
        </div>
      ),
    },
    {
      key: 'expectedYield',
      header: 'Expected Yield',
      cell: (record) => (
        <div className="flex items-center space-x-1">
          <EditableField
            value={record.expectedYield}
            type="number"
            onSave={(value) => handleEditCrop(record.id, 'expectedYield', Number(value))}
          />
          <span className="text-xs text-muted-foreground">{record.yieldUnit}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (record) => (
        <Badge 
          variant={record.status === 'Growing' ? 'default' : 
                  record.status === 'Harvested' ? 'secondary' :
                  record.status === 'Planned' ? 'outline' : 'destructive'}
        >
          <EditableField
            value={record.status}
            onSave={(value) => handleEditCrop(record.id, 'status', String(value))}
          />
        </Badge>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      cell: (record) => (
        <EditableField
          value={record.notes}
          onSave={(value) => handleEditCrop(record.id, 'notes', String(value))}
        />
      ),
    },
  ];

  const handleEditCrop = (id: number, field: keyof CropData, value: any) => {
    setCropsData(crops => 
      crops.map(crop => 
        crop.id === id ? { ...crop, [field]: value } : crop
      )
    );
    toast({
      title: "Crop updated",
      description: `${field} has been updated successfully.`,
    });
  };

  const handleDeleteCrop = (id: number) => {
    setCropsData(crops => crops.filter(crop => crop.id !== id));
    toast({
      title: "Crop deleted",
      description: "Crop has been deleted successfully.",
    });
  };

  const handleAddCrop = (values: z.infer<typeof cropFormSchema>) => {
    const newCrop: CropData = {
      id: Math.max(...cropsData.map(c => c.id), 0) + 1,
      ...values,
    };
    setCropsData(crops => [...crops, newCrop]);
    setDialogOpen(false);
    form.reset();
    toast({
      title: "Crop added",
      description: "New crop has been added successfully.",
    });
  };

  const filteredCrops = cropsData.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = filterSeason === 'all' || crop.season === filterSeason;
    const matchesStatus = filterStatus === 'all' || crop.status === filterStatus;
    
    return matchesSearch && matchesSeason && matchesStatus;
  });

  const totalArea = cropsData.reduce((sum, crop) => {
    if (crop.unit === 'acres') return sum + (crop.area * 0.404686); // Convert acres to hectares
    return sum + crop.area;
  }, 0);

  const growingCrops = cropsData.filter(crop => crop.status === 'Growing').length;
  const harvestedCrops = cropsData.filter(crop => crop.status === 'Harvested').length;

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
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddCrop)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select crop" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Rice">Rice</SelectItem>
                            <SelectItem value="Wheat">Wheat</SelectItem>
                            <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                            <SelectItem value="Cotton">Cotton</SelectItem>
                            <SelectItem value="Pulses">Pulses</SelectItem>
                            <SelectItem value="Maize">Maize</SelectItem>
                            <SelectItem value="Oilseeds">Oilseeds</SelectItem>
                            <SelectItem value="Vegetables">Vegetables</SelectItem>
                            <SelectItem value="Fruits">Fruits</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="variety"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variety</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Kharif">Kharif (Monsoon)</SelectItem>
                            <SelectItem value="Rabi">Rabi (Winter)</SelectItem>
                            <SelectItem value="Zaid">Zaid (Summer)</SelectItem>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expectedYield"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Yield</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="yieldUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yield Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tonnes">Tonnes</SelectItem>
                            <SelectItem value="quintals">Quintals</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="Growing">Growing</SelectItem>
                          <SelectItem value="Harvested">Harvested</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
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
                  <Button type="submit">Add Crop</Button>
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
            <Sprout className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Growing</p>
              <p className="text-2xl font-bold">{growingCrops}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Harvested</p>
              <p className="text-2xl font-bold">{harvestedCrops}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search crops, varieties, or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterSeason} onValueChange={setFilterSeason}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="Kharif">Kharif</SelectItem>
                <SelectItem value="Rabi">Rabi</SelectItem>
                <SelectItem value="Zaid">Zaid</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="Growing">Growing</SelectItem>
                <SelectItem value="Harvested">Harvested</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Crops Table */}
        <EditableTable
          data={filteredCrops}
          columns={columns}
          onDelete={handleDeleteCrop}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default IndianSpecificCrops;
import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { TrendingUp, TrendingDown, Calendar, Download, Filter, PlusCircle, ArrowDown, ArrowUp } from 'lucide-react';
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

interface HarvestRecord {
  id: number;
  date: string;
  crop: string;
  variety: string;
  quantity: number;
  unit: 'kg' | 'tonnes' | 'quintals';
  quality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  location: string;
  notes: string;
}

const harvestFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  crop: z.string().min(1, { message: "Crop is required" }),
  variety: z.string().min(1, { message: "Variety is required" }),
  quantity: z.number().min(0.1, { message: "Quantity must be greater than 0" }),
  unit: z.enum(['kg', 'tonnes', 'quintals']),
  quality: z.enum(['Excellent', 'Good', 'Average', 'Poor']),
  location: z.string().min(1, { message: "Location is required" }),
  notes: z.string().optional(),
});

const IndianHarvestTracking = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Harvest Tracking in India');
  const [description, setDescription] = useState('Track yields and quality for main Indian crops');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCrop, setFilterCrop] = useState('all');
  const [filterQuality, setFilterQuality] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof harvestFormSchema>>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      crop: 'Rice',
      variety: 'Basmati',
      quantity: 0,
      unit: 'kg',
      quality: 'Good',
      location: 'Punjab',
      notes: '',
    },
  });
  
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([
    {
      id: 1,
      date: '2024-06-15',
      crop: 'Rice',
      variety: 'Basmati',
      quantity: 2500,
      unit: 'kg',
      quality: 'Excellent',
      location: 'Punjab',
      notes: 'Excellent harvest season with good grain quality'
    },
    {
      id: 2,
      date: '2024-06-20',
      crop: 'Wheat',
      variety: 'Durum',
      quantity: 1800,
      unit: 'kg',
      quality: 'Good',
      location: 'Haryana',
      notes: 'Good yield despite late sowing'
    },
    {
      id: 3,
      date: '2024-06-25',
      crop: 'Sugarcane',
      variety: 'Co 86032',
      quantity: 45,
      unit: 'tonnes',
      quality: 'Good',
      location: 'Maharashtra',
      notes: 'High sugar content this season'
    },
    {
      id: 4,
      date: '2024-06-28',
      crop: 'Cotton',
      variety: 'BT Cotton',
      quantity: 1200,
      unit: 'kg',
      quality: 'Average',
      location: 'Gujarat',
      notes: 'Moderate yield due to pest pressure'
    },
    {
      id: 5,
      date: '2024-07-01',
      crop: 'Pulses',
      variety: 'Toor Dal',
      quantity: 800,
      unit: 'kg',
      quality: 'Good',
      location: 'Madhya Pradesh',
      notes: 'Good harvest with minimal damage'
    }
  ]);

  const columns: Column[] = [
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'date',
      type: 'text',
      isEditable: true
    },
    {
      id: 'crop',
      header: 'Crop', 
      accessorKey: 'crop',
      type: 'text',
      isEditable: true
    },
    {
      id: 'variety',
      header: 'Variety',
      accessorKey: 'variety', 
      type: 'text',
      isEditable: true
    },
    {
      id: 'quantity',
      header: 'Quantity',
      accessorKey: 'quantity',
      type: 'number',
      isEditable: true
    },
    {
      id: 'unit',
      header: 'Unit',
      accessorKey: 'unit',
      type: 'select',
      options: ['kg', 'tonnes', 'quintals'],
      isEditable: true
    },
    {
      id: 'quality',
      header: 'Quality', 
      accessorKey: 'quality',
      type: 'select',
      options: ['Excellent', 'Good', 'Average', 'Poor'],
      isEditable: true
    },
    {
      id: 'location',
      header: 'Location',
      accessorKey: 'location',
      type: 'text', 
      isEditable: true
    },
    {
      id: 'notes',
      header: 'Notes',
      accessorKey: 'notes',
      type: 'text',
      isEditable: true
    }
  ];

  const handleEditRecord = (id: number, field: keyof HarvestRecord, value: any) => {
    setHarvestRecords(records => 
      records.map(record => 
        record.id === id ? { ...record, [field]: value } : record
      )
    );
    toast({
      title: "Record updated",
      description: `${field} has been updated successfully.`,
    });
  };

  const handleDeleteRecord = (id: number) => {
    setHarvestRecords(records => records.filter(record => record.id !== id));
    toast({
      title: "Record deleted",
      description: "Harvest record has been deleted successfully.",
    });
  };

  const handleAddRecord = (values: z.infer<typeof harvestFormSchema>) => {
    const newRecord: HarvestRecord = {
      id: Math.max(...harvestRecords.map(r => r.id), 0) + 1,
      date: values.date || new Date().toISOString().split('T')[0],
      crop: values.crop || 'Rice',
      variety: values.variety || 'Unknown',
      quantity: values.quantity || 0,
      unit: values.unit || 'kg',
      quality: values.quality || 'Good', 
      location: values.location || 'Unknown',
      notes: values.notes || '',
    };
    setHarvestRecords(records => [...records, newRecord]);
    setDialogOpen(false);
    form.reset();
    toast({
      title: "Record added",
      description: "New harvest record has been added successfully.",
    });
  };

  const filteredRecords = harvestRecords.filter(record => {
    const matchesSearch = record.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = filterCrop === 'all' || record.crop === filterCrop;
    const matchesQuality = filterQuality === 'all' || record.quality === filterQuality;
    
    return matchesSearch && matchesCrop && matchesQuality;
  });

  const totalQuantity = harvestRecords.reduce((sum, record) => {
    if (record.unit === 'tonnes') return sum + (record.quantity * 1000);
    if (record.unit === 'quintals') return sum + (record.quantity * 100);
    return sum + record.quantity;
  }, 0);

  const averageQuality = harvestRecords.reduce((sum, record) => {
    const qualityScores = { 'Poor': 1, 'Average': 2, 'Good': 3, 'Excellent': 4 };
    return sum + qualityScores[record.quality as keyof typeof qualityScores];
  }, 0) / harvestRecords.length;

  const qualityLabel = averageQuality >= 3.5 ? 'Excellent' : 
                      averageQuality >= 2.5 ? 'Good' : 
                      averageQuality >= 1.5 ? 'Average' : 'Poor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <EditableField
              value={title}
              onSave={(value: string) => setTitle(value)}
              className="inline-block"
              showEditIcon={true}
            />
          </h1>
          <p className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={(value: string) => setDescription(value)}
              className="inline-block"
              showEditIcon={true}
            />
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-agri-primary hover:bg-agri-primary-dark">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Harvest Record</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddRecord)} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop</FormLabel>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
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
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="tonnes">tonnes</SelectItem>
                            <SelectItem value="quintals">quintals</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Average">Average</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
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
                  <Button type="submit">Add Record</Button>
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
              <p className="text-sm font-medium text-muted-foreground">Total Harvest</p>
              <p className="text-2xl font-bold">{totalQuantity.toLocaleString()} kg</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Records</p>
              <p className="text-2xl font-bold">{harvestRecords.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Quality</p>
              <p className="text-2xl font-bold">{qualityLabel}</p>
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
              placeholder="Search crops, varieties, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterCrop} onValueChange={setFilterCrop}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                <SelectItem value="Cotton">Cotton</SelectItem>
                <SelectItem value="Pulses">Pulses</SelectItem>
                <SelectItem value="Maize">Maize</SelectItem>
                <SelectItem value="Oilseeds">Oilseeds</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterQuality} onValueChange={setFilterQuality}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Records Table */}
        <EditableTable
          data={filteredRecords}
          columns={columns}
          onUpdate={(rowIndex: number, columnId: string, value: any) => {
            const recordId = filteredRecords[rowIndex].id;
            setHarvestRecords(records =>
              records.map(record =>
                record.id === recordId
                  ? { ...record, [columnId]: value }
                  : record
              )
            );
          }}
          onDelete={handleDeleteRecord}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default IndianHarvestTracking;
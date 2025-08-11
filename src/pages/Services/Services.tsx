'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from '@/redux/features/Services/serviceApi';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react'; // ✅ Icon library used by ShadCN
import Spinner from '@/components/Spinner';

const ServicePage = () => {
  const router = useRouter();

  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  const { data, isLoading, isError } = useGetAllServicesQuery({});
  const services = Array.isArray(data) ? data : data?.data || [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });

  const openEditModal = (service: any) => {
    setSelectedService(service);
    setFormData({ name: service.name });
    setIsOpen(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
  
    try {
      await deleteService(id).unwrap();
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Failed to delete service');
    }
  };

  const handleSave = async () => {
    try {
      await updateService({ id: selectedService._id, ...formData }).unwrap();
      toast.success('Service updated successfully');
      setIsOpen(false);
    } catch (error) {
      console.error('Update failed', error);
      toast.error('Failed to update service');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Services</h1>
      </div>

      {isLoading && <Spinner></Spinner>}
      {isError && <p>Error loading services</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service: any) => (
    <Card
  key={service._id}
  className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg transition hover:shadow-xl"
>
  <CardHeader className="text-lg font-semibold text-primary">
    {service?.name}
  </CardHeader>
  <CardContent className="flex justify-end gap-2">
    <Button
      variant="outline"
      size="icon"
      className="border-gray-300 hover:bg-primary/10"
      onClick={() => openEditModal(service)}
    >
      <Pencil className="w-4 h-4 text-gray-700" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="border-gray-300 hover:bg-red-50"
      onClick={() => handleDelete(service._id)}
    >
      <Trash2 className="w-4 h-4 text-red-500" />
    </Button>
  </CardContent>
</Card>

        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter service name"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicePage;

'use client';

import { useState } from 'react';
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const ServicePage = () => {
  const router = useRouter();

  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  const { data, isLoading, isError } = useGetAllServicesQuery({});
  const services = Array.isArray(data) ? data : data?.data || [];

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });

  const openEditModal = (service: any) => {
    setSelectedService(service);
    setFormData({ name: service.name });
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this service?');
    if (!confirmed) return;

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

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading services</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service: any) => (
          <Card key={service._id} className="rounded-2xl shadow-md p-4">
            <CardHeader className="text-lg font-semibold">
              {service?.name}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openEditModal(service)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(service._id)}
                >
                  Delete
                </Button>
              </div>
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

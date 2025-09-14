'use client';

import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from '@/redux/features/Services/serviceApi';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { Service } from '@/types/products';
import CreateServiceModal from './CreateServices';



const ServicePage = () => {
  const { data, isLoading, isError, refetch } = useGetAllServicesQuery({});
  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  const services: Service[] = Array.isArray(data) ? data : data?.data || [];

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState({ name: '' });

  // Add Service modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setEditForm({ name: service.name });
    setIsEditOpen(true);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This service will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteService(id).unwrap();
        toast.success('Service deleted successfully');
        refetch();
      } catch (error) {
        console.error('Delete failed', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const handleEditSave = async () => {
    if (!selectedService || !editForm.name.trim()) return;

    try {
      await updateService({ id: selectedService._id, ...editForm }).unwrap();
      toast.success('Service updated successfully');
      setIsEditOpen(false);
      refetch();
    } catch (error) {
      console.error('Update failed', error);
      toast.error('Failed to update service');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Services</h1>
        <Button
          variant="secondary"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {isLoading && <Spinner />}
      {isError && <p className="text-red-500">Error loading services</p>}

      {!isLoading && !isError && (
        <>
          <Table className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <TableCaption>A list of all available services</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-16">#</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service, index) => (
                  <TableRow key={service._id} className="hover:bg-gray-50 transition">
                    <TableCell className="font-medium">
                      {(page - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(service)}
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(service._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-6">
                    No services found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-3 mt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Enter service name"
              className="focus:ring-2 focus:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleEditSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

  {/* Add Service Modal */}
<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
  <DialogContent className="sm:max-w-md">
    <CreateServiceModal
      onSuccess={() => {
        setIsAddOpen(false); // close modal
        refetch();           // refresh service list
      }}
    />
  </DialogContent>
</Dialog>


    </div>
  );
};

export default ServicePage;

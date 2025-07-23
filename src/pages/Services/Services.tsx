'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';

const ServicePage = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetAllServicesQuery({});

  const services = Array.isArray(data) ? data : data?.data || [];

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this service?');
    if (!confirmed) return;

    try {
      // Example: dispatch(deleteService(id))
      console.log('Delete service with id:', id);
    } catch (error) {
      console.error('Delete failed', error);
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
            <CardHeader className="text-lg font-semibold">{service?.name}</CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/services/edit/${service._id}`)
                  }
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
    </div>
  );
};

export default ServicePage;

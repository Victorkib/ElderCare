import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import apiRequest from '../../utils/api';

const AssignCaregiverModal = ({
  isOpen,
  onClose,
  elderId,
  onAssignSuccess,
}) => {
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch caregivers when the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchCaregivers();
    }
  }, [isOpen]);

  // Fetch caregivers from backend
  const fetchCaregivers = async () => {
    try {
      const response = await apiRequest.get('/caregivers');
      setCaregivers(response.data.caregivers);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to fetch caregivers.'
      );
    }
  };

  // Assign caregiver to elder
  const assignCaregiver = async () => {
    if (!selectedCaregiver) {
      toast.error('Please select a caregiver.');
      return;
    }

    setLoading(true);
    try {
      await apiRequest.patch(`/elders/assignCaregiver/${elderId}`, {
        caregiverId: selectedCaregiver,
      });
      toast.success('Caregiver assigned successfully.');
      onAssignSuccess?.(); // Callback for success
      onClose(); // Close the modal
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to assign caregiver.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Assign Caregiver</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {caregivers.length > 0 ? (
            caregivers.map((caregiver) => (
              <div
                key={caregiver._id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedCaregiver === caregiver._id ? 'bg-blue-100' : ''
                }`}
                onClick={() => setSelectedCaregiver(caregiver._id)}
              >
                <p className="font-medium">{caregiver.name}</p>
                <p className="text-sm text-gray-500">
                  {caregiver.specialization}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No caregivers available.</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={assignCaregiver}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignCaregiverModal;

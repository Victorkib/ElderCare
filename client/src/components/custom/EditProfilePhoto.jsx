import { useState } from 'react';
import { Upload } from 'lucide-react';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import apiRequest from '../../utils/api';
import UploadWidget from '../uploadWidget/UploadWidget';

const EditProfilePhoto = ({ userId, currentPhoto, onPhotoUpdated }) => {
  const [photo, setPhoto] = useState(currentPhoto);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = async (url) => {
    setPhoto(url);
    setLoading(true);

    try {
      // Send request to update profile photo
      const response = await apiRequest.patch(`/elders/updatePhoto/${userId}`, {
        photo: url,
      });

      if (response.status === 200) {
        toast.success('Profile photo updated successfully!');
        if (onPhotoUpdated) onPhotoUpdated(url);
      } else {
        throw new Error('Failed to update photo');
      }
    } catch (error) {
      toast.error(
        error.response.data.message || 'Error updating profile photo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-3">Edit Profile Photo</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="text-gray-400" size={24} />
          )}
        </div>

        {loading ? (
          <TailSpin
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="loading"
          />
        ) : (
          <UploadWidget
            uwConfig={{
              cloudName: 'victorkib',
              uploadPreset: 'eldercare',
              multiple: false,
              maxImageFileSize: 2000000,
              folder: 'avatars',
            }}
            onUploadSuccess={handlePhotoUpload}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
};

export default EditProfilePhoto;

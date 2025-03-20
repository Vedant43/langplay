import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Avatar,
  TextField,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";
import UserApi from "../api/UserApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"

export function SetupProfilePage() {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      channelName: "",
      description: "",
      profileImage: null,
      coverImage: null,
    },
  });

  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setCroppingImage({ file, type });
    }
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels);
  }, []);

  const handleCropConfirm = () => {
    if (croppingImage.type === "profile") {
      setProfileImage(croppingImage.file);
      setValue("profileImage", croppingImage.file);
    } else {
      setCoverImage(croppingImage.file);
      setValue("coverImage", croppingImage.file);
    }
    setCroppingImage(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("channelName", data.channelName);
    formData.append("description", data.description);

    if (profileImage) formData.append("profilePicture", profileImage);
    if (coverImage) formData.append("coverPicture", coverImage);

    UserApi.updateProfile(formData)
      .then((response) => {
        console.log(response);
        toast.success("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-6 p-4"
    >
      {/* Cover Image Section */}
      <div className="relative">
        {coverImage ? (
          <img
            src={URL.createObjectURL(coverImage)}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            <Typography variant="body1" color="textSecondary">
              No Cover Image
            </Typography>
          </div>
        )}
        <label className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-2 rounded cursor-pointer">
          <Upload size={16} className="inline-block mr-2" /> Upload Cover
          <input
            type="file"
            hidden
            {...register("coverImage")}
            onChange={(e) => handleFileChange(e, "cover")}
          />
        </label>
      </div>

      {/* Profile Image */}
      <div className="relative flex justify-center">
        <Avatar
          src={profileImage ? URL.createObjectURL(profileImage) : ""}
          alt="Profile"
          sx={{ width: 96, height: 96, border: "4px solid white" }}
        />
        <label className="absolute bottom-0 right-0 cursor-pointer">
          <IconButton component="span" color="primary" size="small">
            <Upload size={18} />
          </IconButton>
          <input
            type="file"
            hidden
            {...register("profileImage")}
            onChange={(e) => handleFileChange(e, "profile")}
          />
        </label>
      </div>

      {/* Form Inputs */}
      <Card>
        <CardContent className="space-y-4">
          <TextField
            fullWidth
            label="Channel Name"
            variant="outlined"
            {...register("channelName")}
          />
          <TextField
            fullWidth
            label="Channel Description"
            multiline
            rows={3}
            variant="outlined"
            {...register("description")}
          />
          <div className="flex justify-end space-x-4">
            <Button variant="outlined" color="secondary">
              Discard
            </Button>
            <Link
              to="/profile"
              className="no-underline"
            >
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Cropping Dialog */}
      {croppingImage && (
        <Dialog open={!!croppingImage} onClose={() => setCroppingImage(null)}>
          <DialogContent>
            <div className="relative w-[300px] h-[200px]">
              <Cropper
                image={URL.createObjectURL(croppingImage.file)}
                crop={crop}
                zoom={zoom}
                aspect={croppingImage.type === "profile" ? 1 : 16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => setCroppingImage(null)} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleCropConfirm}
                variant="contained"
                color="primary"
              >
                Confirm Crop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
}

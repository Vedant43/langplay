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
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../Components/redux/features/authSlice";

export function SetupProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { id, username, channelName, profilePicture, coverPicture, subscribers, description } = useSelector(
    (state) => state.auth
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      channelName: channelName || "",
      description: "",
      profileImage: null,
      coverImage: null,
    },
  });

  const [coverImagePreview, setCoverImagePreview] = useState(coverPicture ? coverPicture : null);
  const [profileImagePreview, setProfileImagePreview] = useState(profilePicture ? profilePicture : null);
  
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  
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
  }, []);

  const handleCropConfirm = () => {
    if (croppingImage.type === "profile") {
      setProfileImageFile(croppingImage.file);
      setProfileImagePreview(URL.createObjectURL(croppingImage.file));
      setValue("profileImage", croppingImage.file);
    } else {
      setCoverImageFile(croppingImage.file);
      setCoverImagePreview(URL.createObjectURL(croppingImage.file));
      setValue("coverImage", croppingImage.file);
    }
    setCroppingImage(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      formData.append("channelName", data.channelName);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      if (profileImageFile) {
        formData.append("profilePicture", profileImageFile);
      }
      
      if (coverImageFile) {
        formData.append("coverPicture", coverImageFile);
      }
    
      
      const response = await UserApi.updateProfile(formData);
  
      
      
      const updatedData = response?.data || response;
      
      dispatch(setUser({
        id,
        username,
        profilePicture: updatedData?.profilePicture || profilePicture,
        coverPicture: updatedData?.coverPicture || coverPicture,
        channelName: updatedData?.channelName || channelName,
        subscribers: updatedData?.subscribers?.length || subscribers || 0,
        description: updatedData?.description || ""
      }))
      
    
      toast.success("Profile updated successfully");
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setValue("channelName", channelName || "");
    setValue("description", description || "");
    setProfileImagePreview(profilePicture || null);
    setCoverImagePreview(coverPicture || null);
  }, [channelName, description, profilePicture, coverPicture, setValue]);
  
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-6 p-4"
    >
      {/* Cover Image Section */}
      <div className="relative">
        {coverImagePreview ? (
          <img
            src={coverImagePreview}
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
            accept="image/*"
            hidden
            onChange={(e) => handleFileChange(e, "cover")}
          />
        </label>
      </div>

      {/* Profile Image */}
      <div className="relative flex justify-center">
        <Avatar
          src={profileImagePreview}
          alt="Profile"
          sx={{ width: 96, height: 96, border: "4px solid white" }}
        />
        <label className="absolute bottom-0 right-0 cursor-pointer">
          <IconButton component="span" color="primary" size="small">
            <Upload size={18} />
          </IconButton>
          <input
            type="file"
            accept="image/*"
            hidden
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
            required
            value={watch("channelName")}
            onChange={(e) => setValue("channelName", e.target.value)}
            error={watch("channelName").length < 3 && watch("channelName").length > 0}
            helperText={
              watch("channelName").length < 3 && watch("channelName").length > 0
                ? "Channel name must be at least 3 characters long"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Channel Description"
            multiline
            rows={3}
            variant="outlined"
            inputProps={{ maxLength: 500 }}
            {...register("description")}
            helperText={`${watch("description")?.length || 0}/500 characters`}
          />
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={watch("channelName").length < 3 || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
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
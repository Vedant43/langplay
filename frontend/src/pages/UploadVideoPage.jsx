import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HdIcon from "@mui/icons-material/Hd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import VideoApi from "../api/VideoApi";
import toast from "react-hot-toast";

export const UploadVideoPage = () => {
  // const [visibility, setVisibility] = useState("Public");

  const { register, handleSubmit, watch, getValues, reset, formState: { errors }, } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description:""
    },
  })
  const watchAllFields = watch()
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const [descriptionValue, setDescriptionValue] = useState("");
  const maxLengthDescription = 500;
  const navigate = useNavigate();

  const handleThumbnailPreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file))
    }
  }
  
  const handleVideoPreview = (file) => {
    if (file && file.type.startsWith('video/')) {
      setVideoFileName(file.name);
      const videoURL = URL.createObjectURL(file);
      setSelectedFile(videoURL);
    }
    return null;
  }

  const uploadVideo = (data) => {
    const formData = new FormData()

    formData.append("title", data.title)
    formData.append("description", data.description)

    if (data.thumbnail && data.thumbnail.length > 0) {
      formData.append("thumbnail", data.thumbnail[0])
    }
    
    if (data.video && data.video.length > 0) {
      formData.append("video", data.video[0])
    }

    VideoApi.uploadVideo( formData )
    .then((response) => {
      // set loading, toast message
      toast.success(response)
      handleThumbnailPreview(null)
      handleVideoPreview(null)
    })
    .catch( error => {
      console.log(error)
      setThumbnail(null)
      setSelectedFile(null)
      reset({"title":"", "description":""})
    })
  }

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile);
      }
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    }
  }, [ selectedFile, thumbnail ])

  return (
    <div 
      className="fixed inset-0 rounded-lg bg-black bg-opacity-50 flex items-center justify-center z-50 text-black transition-opacity duration-300 ease-in-out"
    >
      <form 
        onSubmit={handleSubmit(uploadVideo)}
      >
        <div 
          className="bg-white w-full max-w-4xl rounded-lg"
        >
          <div 
            className="flex justify-between rounded-sm items-center p-3 border-b border-gray-300"
          >
            <h2 
              className="text-lg font-medium"
            >
              Upload video 
            </h2>
            <button
              className="text-gray-900 hover:text-black"
              onClick={() => navigate(-1)}
            >
              <CloseIcon />
            </button>
          </div>

          <div 
            className="p-4"
          >
            <h3 
              className="text-xl mr-4 mb-4"
            >
              Details
            </h3>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 "
            >
              <div 
                className="space-y-4"
              >
                <div>
                  <label>
                    Title
                  </label>
                  <div 
                    className="bg-gray-100 p-3 rounded"
                  >
                    <input
                      className="w-full text-black bg-transparent outline-none border-none focus:ring-0"
                      type="text"
                      placeholder="Video title goes here(must be atleast 5 characters)"
                      {...register("title", { 
                        required: "Title can not be empty", 
                        minLength: {
                          value: 5,
                          message:"Title must be atleast 5 characters"
                        }
                      })}
                    />
                  </div>
                  {errors.title && <span className="text-sm text-red-400">{errors.title.message}</span>}
                </div>
                <div>
                  <label>
                    Description
                  </label>
                  <div 
                    className=""
                  >
                    <textarea
                      className="w-full bg-gray-100 rounded p-3 text-black resize-y max-h-36 outline-none border-none focus:ring-0"
                      {...register("description")}
                      rows={4}
                      placeholder="This is a sample video description"
                      maxLength={500}
                    />
                    {descriptionValue.length >= maxLengthDescription && (
                      <p 
                        className="text-red-500 text-xs"
                      >
                        Can not exceed 500 charcters!
                      </p>
                    )}
                    <p 
                      className="text-xs"
                    >
                      {descriptionValue.length}/{maxLengthDescription}
                    </p>
                  </div>
                </div>
                {/* <div className="bg-gray-100 rounded p-3">
                  <input type="text" className="w-full text-black bg-transparent outline-none border-none focus:ring-0" defaultValue="comedy, coding" />
                </div> */}
                <div 
                  className="text-xl ml-2 mb-2"
                >
                  <h3 
                    className="text-xl mb-2"
                  >
                    Thumbnail
                  </h3>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="w-56 h-32 object-cover rounded shadow"
                    />
                  ) : (
                    <div>
                      <p 
                        className="text-gray-700 text-sm mb-2"
                      >
                        Select or upload a picture.
                      </p>
                      <label
                        htmlFor="thumbnail-upload"
                        className="bg-gray-100 inline-block p-3 rounded cursor-pointer"
                      >
                        <p
                          className="text-gray-600 text-sm"
                        >
                          Click to select an image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          id="thumbnail-upload"
                          className="hidden"
                          {...register("thumbnail", { 
                            required: true, 
                            onChange: (e) => handleThumbnailPreview(e) 
                          })}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div 
                className="space-y-4 px-8"
              >

                <div 
                  className="flex flex-col items-center justify-center"
                >
                  
                  {selectedFile 
                    ? (
                      <>
                        <video
                          src={selectedFile} 
                          className="w-96"
                          type="video/mp4" 
                          controls
                        >
                        </video>
                        <p 
                          className="mt-4 text-gray-700 text-sm"
                        >
                          Selected File: {videoFileName}
                        </p>
                      </>
                      )
                    : (
                      <>
                        <div
                          className={`w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 ${
                            isDragging ? "border-2 border-blue-500" : ""
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(true)
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault()
                            setIsDragging(false)
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(false)
                            const file = e.dataTransfer.files[0]
                            if (file) {
                              handleVideoPreview(file)
                            }
                          }}
                        >
                          <FileUploadIcon style={{ fontSize: 36, color: "#6b7280" }} />
                        </div>

                        <p 
                          className="text-lg font-medium text-gray-800 mb-2"
                        >
                          Drag and drop video files to upload
                        </p>
                        <p 
                          className="text-gray-500 text-sm mb-4 text-center"
                        >
                          Your videos will be private until you publish them.
                        </p>

                        <label 
                          className="bg-[#7e82bf] hover:bg-[#464a8a] text-white py-2 px-6 rounded-sm font-medium cursor-pointer"
                        >
                          SELECT FILE
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            {...register("video", { 
                              required: true,
                              onChange: (e) => {
                                {
                                  const file = e.target.files[0]
                                  if (file) {
                                    handleVideoPreview(file)
                                  }
                                }
                              }
                            })}
                          />
                        </label>
                      </>
                    )  
                  }
                </div>
                <div>
                  <p 
                    className="text-gray-600 text-sm"
                  >
                    Filename
                  </p>
                  <p>
                    {getValues("title")} 
                  </p>
                </div>
                {/* <div>
                  <p className="text-gray-600 text-sm mb-1">Visibility</p>
                  <div className="bg-gray-200 p-3 rounded flex justify-between items-center">
                    <span>{visibility}</span>
                    <KeyboardArrowDownIcon />
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div 
            className="p-4 border-t border-gray-300 flex justify-between items-center"
          >
            <div 
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon 
                style={{ 
                  color: "#3EA6FF" 
                }} 
              />
              <HdIcon 
                style={{ 
                  color: "#3EA6FF" 
                }}
              />
              <span 
                className="text-gray-600"
              >
                Video uploaded
              </span>
            </div>
            <button 
              type="submit"
              className="bg-primary hover:bg-h-primary text-white py-2 px-6 rounded-sm cursor-pointer"
            >
              UPLOAD
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
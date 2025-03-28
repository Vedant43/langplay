import React, { useEffect, useState } from "react";
import {
  Eye,
  Users,
  Heart,
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
} from "lucide-react";
import VideoApi from "../api/VideoApi";
import { useSelector } from "react-redux";
import UserApi from "../api/UserApi";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";

export const DashboardPage = () => {
  const [videos, setVideos] = useState([]);
  const [countViews, setCountViews] = useState(0);
  const [countLikes, setCountLikes] = useState(0);
  const [countSubscribers, setCountSubscribers] = useState(0);

  const { channelName, id } = useSelector((state) => state.auth);

  useEffect(() => {
    VideoApi.fetchAllVideosByUser()
      .then((response) => {
        console.log(response);
        setVideos(response);
        setCountViews(
          response.reduce((accumulator, video) => accumulator + video.views, 0)
        );
        setCountLikes(
          response.reduce((accumulator, video) => {
            const likeCountPerVideo = video.videoEngagement.filter(
              (vid) => vid.engagementType == "LIKE"
            ).length;
            return accumulator + likeCountPerVideo;
          }, 0)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    UserApi.getSubscriberCount()
      .then((response) => {
        setCountSubscribers(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const deleteVideo = (videoId) => {
    VideoApi.deleteVideo(videoId)
      .then((response) => {
        console.log(response)
        setVideos((prevVideos) => 
          prevVideos.filter(vid => vid.id !== videoId)
        )
      })
      .catch( err => {
        console.log(err)
      })
  }

  return (
    <div 
      className="p-6 bg-white min-h-screen"
    >
      <div 
        className="flex items-start justify-between"
      >
        <div 
          className="mb-6"
        >
          <h1 
            className="text-2xl font-bold"
          >
            Welcome Back {channelName}
          </h1>
          <p 
            className="text-gray-500"
          >
            Track and manage your channel and videos
          </p>
        </div>

        <div 
          className="mt-4 text-right"
        >
          <Link
            to="/upload-video"
          >
            <button 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              + Upload
            </button>
          </Link>
        </div>
      </div>

      <div 
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <div 
          className="bg-white shadow rounded-lg"
        >
          <div 
            className="flex items-center p-4"
          >
            <Eye 
              className="mr-3 text-primary" 
            />
            <div>
              <div 
                className="text-2xl font-bold"
              >
                {countViews}
              </div>
              <div 
                className="text-gray-500"
              >
                Total Views
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bg-white shadow rounded-lg"
        >
          <div 
            className="flex items-center p-4"
          >
            <Users 
              className="mr-3 text-primary" 
            />
            <div>
              <div 
                className="text-2xl font-bold"
              >
                {countSubscribers}
              </div>
              <div 
                className="text-gray-500"
              >
                Total Subscribers
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bg-white shadow rounded-lg"
        >
          <div 
            className="flex items-center p-4"
          >
            <Heart 
              className="mr-3 text-primary" 
            />
            <div>
              <div 
                className="text-2xl font-bold"
              >
                {countLikes}
              </div>
              <div 
                className="text-gray-500"
              >
                Total Likes
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="bg-white shadow rounded-lg"
      >
        <div 
          className="p-4"
        >
          <h2 
            className="text-xl font-semibold mb-4"
          >
            Your Videos
          </h2>
          <table 
            className="w-full"
          >
            <thead>
              <tr 
                className="border-b"
              >
                <th 
                  className="text-left p-2"
                >
                  Status
                </th>
                <th 
                  className="text-left p-2"
                >
                  Uploaded
                </th>
                <th 
                  className="text-left p-2"
                >
                  Rating
                </th>
                <th 
                  className="text-left p-2"
                >
                  Date Uploaded
                </th>
                <th 
                  className="text-right p-2"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr 
                  key={index} 
                  className="border-b hover:bg-gray-50"
                >
                  <td 
                    className="p-2 flex items-center"
                  >
                    <span 
                      className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {/* {video.status} */}
                      Uploaded
                    </span>
                  </td>
                  <td 
                    className="p-2"
                  >
                    {video.title}
                  </td>
                  <td 
                    className="p-2"
                  >
                    <span 
                      className="text-green-600 mr-2"
                    >
                      {video.videoEngagement.length > 0
                        ? video.videoEngagement?.filter(
                            (e) => e.engagementType === "LIKE"
                          ).length
                        : 0}{" "}
                      Likes
                    </span>
                    <span 
                      className="text-red-600"
                    >
                      {video.videoEngagement.length > 0
                        ? video.videoEngagement?.filter(
                            (e) => e.engagementType === "DISLIKE"
                          ).length
                        : 0}{" "}
                      Dislikes
                    </span>
                  </td>
                  <td 
                    className="p-2"
                  >
                    {new Date(video.createdAt).toLocaleDateString("en-In")}
                  </td>
                  <td 
                    className="p-2 flex items-center justify-end space-x-2"
                  >
                    <EditIcon
                      className="text-gray-500 cursor-pointer"
                      size={20}
                    />
                    <IconButton
                      onClick={() => {
                        deleteVideo(video.id)
                      }}
                    >
                      <DeleteIcon
                        className="text-red-500 cursor-pointer"
                        size={20}
                      />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

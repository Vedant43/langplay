import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Container } from "../Components/container/Container";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@vedant567/neotube-common";
import { Loader } from "../Components/AuthForm/Loader";
import avatar from "../assets/default-avatar.jpg";
import UserApi from "../api/UserApi";
import { useDispatch } from "react-redux";
import { setUser } from "../Components/redux/features/authSlice";
import { fetchPlaylistsIfNeeded } from "../Components/redux/features/playlistSlice";
import { z } from "zod";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";

const extendedSignUpSchema = signUpSchema.extend({
  languageToLearn: z.string().min(1, "Please select a language"),
  level: z.string().min(1, "Please select your level"),
});

export const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(extendedSignUpSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
  
    UserApi.userSignUp(data)
      .then((response) => {
        setIsLoading(false);
        console.log("Signup response:", response);
  
        const id = response.newUser.id;
        const username = response.newUser.username;
        const channelName = response.newUser.channelName || "";
        const profilePicture = response.newUser.profilePicture || avatar;
        const coverPicture = response.newUser.coverPicture || null;
        const description = response.newUser.description || "";
        const subscribers = response.newUser.subscribers?.length || 0;
  
        dispatch(setUser({ id, username, channelName, profilePicture, coverPicture, description, subscribers }));
        localStorage.setItem("accessToken", response.accessToken);
        dispatch(fetchPlaylistsIfNeeded());
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        reset({ username: "", email: "", password: "", confirmPassword: "", languageToLearn: "" });
  
        setError("dbError", {
          type: "db",
          message: error?.response?.data?.message || "Something went wrong",
        });
      });
  };
  
  
  

  const closeSignUp = () => navigate("/");

  return (
    <Container className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* BACKGROUND OVERLAY */}
      <div
        className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30"
        onClick={closeSignUp}
      ></div>

      {/* MODAL PANEL */}
      <div className="z-40 w-full max-w-4xl h-[520px] md:flex bg-white rounded-xl overflow-hidden shadow-2xl border border-zinc-200 relative">
        {/* LEFT PANEL */}
        <div className="w-full md:w-1/2 px-8 py-10 bg-white z-40 flex flex-col justify-center">
          <h2 className="text-[26px] font-bold text-[#1c1c2e] mb-4">Sign up</h2>

          {isLoading ? (
            <Loader />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center h-full space-y-4"
            >
              {/* Username */}
              <div>
                <label className="text-sm text-gray-800 mb-1 block">Username</label>
                <div className="relative">
                  <PersonIcon className="absolute left-3 top-1 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("username")}
                    type="text"
                    placeholder="Enter your username"
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#616494]"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-800 mb-1 block">Email</label>
                <div className="relative">
                  <EmailIcon className="absolute left-3 top-1 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#616494]"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-800 mb-1 block">Password</label>
                <div className="relative">
                  <HttpsIcon className="absolute left-3 top-1 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#616494]"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Language Dropdown */}
              <div>
                <label className="text-sm text-gray-800 mb-1 block">Language to Learn</label>
                <select
                  {...register("languageToLearn")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#616494]"
                >
                  <option value="">Select a language</option>
                  <option value="english">English</option>
                  <option value="" disabled>More languages coming soon...</option>
                </select>
                {errors.languageToLearn && (
                  <p className="text-xs text-red-500 mt-1">{errors.languageToLearn.message}</p>
                )}
              </div>

              {/* Level Dropdown */}
              <div>
                <label className="text-sm text-gray-800 mb-1 block">Your Level</label>
                <select
                  {...register("level")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#616494]"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                </select>
                {errors.level && (
                  <p className="text-xs text-red-500 mt-1">{errors.level.message}</p>
                )}
              </div>

              {/* SignUp Button */}
              <button
                type="submit"
                className="w-72 mx-auto mt-4 py-3 bg-[#616494] text-white font-semibold rounded-md hover:bg-[#4d5078] transition"
              >
                Sign up
              </button>

              {/* Redirect */}
              <p className="text-sm text-center text-gray-700 mt-2">
                Already have an account?{" "}
                <Link to="/signin" className="text-[#616494] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-start py-8 px-6 bg-[#1c1c2e] text-white">
          <h2 className="text-[26px] font-bold mb-2">Speak the World</h2>
          <p className="text-sm text-gray-300 mb-4 text-center max-w-xs">
            Master any language with conversations that feel real.
          </p>
          <img
            src="/coverimage.jpg"
            alt="illustration"
            className="w-full rounded-md shadow-md object-cover mb-2"
            style={{ height: "calc(100% - 100px)", objectPosition: "center" }}
          />
        </div>
      </div>
    </Container>
  );
};

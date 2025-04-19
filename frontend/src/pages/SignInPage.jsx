import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container } from "../Components/container/Container";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@vedant567/neotube-common";
import { Loader } from "../Components/AuthForm/Loader";
import avatar from "../assets/default-avatar.jpg";
import UserApi from "../api/UserApi";
import { useDispatch } from "react-redux";
import { setUser } from "../Components/redux/features/authSlice";
import { fetchPlaylistsIfNeeded } from "../Components/redux/features/playlistSlice";
import PersonIcon from "@mui/icons-material/Person";
import HttpsIcon from "@mui/icons-material/Https";

export const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

  const onSubmit = async (data) => {
    setLoading(true);
    UserApi.userSignIn(data)
      .then((response) => {
        setLoading(false);
        const { username, id } = response.user;
        const profilePicture = response.user.profilePicture || avatar;
        const channelName = response.user.channelName;

        dispatch(setUser({ profilePicture, channelName, username, id }));
        dispatch(fetchPlaylistsIfNeeded());
        localStorage.setItem("accessToken", response.accessToken);
        navigate(redirectTo);
      })
      .catch((error) => {
        setLoading(false);
        reset({ usernameOrEmail: "", password: "" });
        console.error(error);
      });
  };

  const closeSignIn = () => {
    navigate("/");
  };

  return (
    <Container className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
    {/* BACKGROUND BLUR OVERLAY */}
    <div
      className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30"
      onClick={closeSignIn}
    ></div>
  
    {/* CENTERED MODAL */}
    <div className="z-40 w-full max-w-3xl md:flex bg-white rounded-xl overflow-hidden shadow-2xl border border-zinc-200 relative">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/2 px-8 py-10 bg-white z-40 flex flex-col justify-center">
        <h2 className="text-[28px] font-bold text-[#1c1c2e] mb-6">Sign in</h2>
  
        {loading ? (
          <Loader />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center space-y-6"
          >
            {/* Email */}
            <div>
              <label className="text-sm text-gray-800 mb-1 block">Email address</label>
              <div className="relative">
                <PersonIcon className="absolute left-3 top-1 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("usernameOrEmail")}
                  type="text"
                  placeholder="Enter your email"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#616494]"
                />
                {errors.usernameOrEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.usernameOrEmail.message}
                  </p>
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
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
  
            {/* Forgot + Button */}
            <div className="text-sm text-right">
              <Link to="/forgot-password" className="text-[#616494] hover:underline">
                Forgot password?
              </Link>
            </div>
  
            <button
              type="submit"
              className="w-72 mx-auto py-3 bg-[#616494] text-white font-semibold rounded-md hover:bg-[#4d5078] transition"
            >
              Sign in
            </button>
  
            <p className="text-sm text-center text-gray-700 mt-2">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#616494] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        )}
      </div>
  
{/* RIGHT PANEL */}
<div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#1c1c2e] text-white relative p-8">
  {/* Top Text Section */}
  <div className="z-10">
    <h3 className="text-3xl font-bold mb-2">Speak the World</h3>
    <p className="text-sm text-gray-300">
      Master any language with conversations that feel real.
    </p>
  </div>

  {/* Full-Width Image */}
  <div className="mt-6 w-full">
    <img
      src="/coverimage.jpg"
      alt="Language Illustration"
      className="w-full h-auto object-cover rounded-md"
    />
  </div>
</div>

      </div>
  </Container>
  
  );
};

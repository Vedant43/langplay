import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "../Components/container/Container";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "../Components/AuthForm/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@vedant567/neotube-common";
import avatar from "../assets/default-avatar.jpg";
import { Link } from "react-router-dom";
import { InputField } from "../Components/AuthForm/InputField";
import PersonIcon from "@mui/icons-material/Person";
import HttpsIcon from "@mui/icons-material/Https";
import UserApi from "../api/UserApi";
import { useDispatch } from "react-redux";
import { setUser } from "../Components/redux/features/authSlice";
import { fetchPlaylistsIfNeeded } from "../Components/redux/features/playlistSlice";

export const SignInPage = () => {

  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

  const onSubmit = async (data) => {
    setLoading(true)

    UserApi.userSignIn(data)
      .then((response) => {
        setLoading(false)
        const { username, id } = response.user
        let channelName = response.user.channelName
        let profilePicture = response.user.profilePicture

        if (!profilePicture) profilePicture = avatar

        dispatch(setUser({ profilePicture, channelName, username, id }))
        dispatch(fetchPlaylistsIfNeeded())
        localStorage.setItem("accessToken", response.accessToken)
        navigate(redirectTo)
      })
      .catch((error) => {
        setLoading(false)
        reset({ usernameOrEmail: "", password: "" })
        console.log(error)
      })
  }

  const closeSignIn = () => {
    navigate("/");
  }

  return (
    <Container className="relative flex items-center justify-center min-h-screen">
      <div
        className="fixed h-screen w-full inset-0 bg-black opacity-60"
        onClick={closeSignIn}
      >
      </div>
      <div className="z-10 w-full max-w-md">
        <div className="flex items-center justify-center w-full lg:w-4/5 max-w-96 mx-auto p-8 bg-white rounded-lg shadow-2xl border border-gray-200">
          <div className="flex flex-col">
            <h3 className="flex justify-center items-center text-primary mb-4">
              Sign In
            </h3>

            {loading ? (
              <Loader />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                  label={"Username or email:"}
                  placeholder={"Enter your username or email"}
                  icon={<PersonIcon sx={{ fontSize: 18 }} />}
                  type={"text"}
                  id={"usernameOrEmail"}
                  register={register}
                  errors={errors}
                />
                <InputField
                  label={"Password:"}
                  placeholder={"Enter your password"}
                  icon={<HttpsIcon sx={{ fontSize: 18 }} />}
                  type={"password"}
                  id={"password"}
                  register={register}
                  errors={errors}
                />
                <div className="mt-4">
                  <button
                    className="w-full bg-primary hover:bg-h-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                    type="submit"
                  >
                    Sign In
                  </button>

                  {/* {errors.dbError && (
                                <p className="text-red-400 pt-1 text-xs text-center">
                                    {errors.dbError.message}
                                </p>
                            )} */}

                  <p className="pt-2 flex">
                    Don't have an account?{" "}
                    <Link to={"/signup"} className="nunderline">
                      {" "}
                      Sign Up{" "}
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

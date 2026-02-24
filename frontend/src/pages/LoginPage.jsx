import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

export const LoginPage = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin(); // custom hook
  const handleSignUp = (e) => {
    e.preventDefault();
    loginMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SignUp Form Left-Side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Chatterly
            </span>
          </div>

          {/* Error Message */}

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignUp}>
              <div className="space-y-5 mb-10">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {/* Eamil */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full input input-bordered "
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {/* Password */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="**********"
                    className="w-full input input-bordered "
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <button className="btn btn-primary w-full mt-10" type="submit">
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              <div className="text-center mt-4">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link to={"/signup"} className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* SignUp Form Right-Side */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/image_1.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversation, make friends, and improve your language
                skills togather
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

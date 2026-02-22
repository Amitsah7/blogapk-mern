import React, { useState } from "react";
import bgSignup from "../assets/blog-login.png"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/authSlice";

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const {loading} = useSelector(store=>store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setUser((prev)=> ({
      ...prev,
      [name] : value
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(user);

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`http://localhost:4000/api/v1/user/register`, user, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      if(res.data.success) {
        navigate('/login')
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="flex min-h-screen md:pt-14">
      <div className="hidden lg:block lg:w-1/2">
        <img src={bgSignup} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex justify-center items-center w-full lg:w-1/2 px-4">
        <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-2xl font-semibold">
                Create an account
              </h1>
            </CardTitle>
            <p className=" mt-2 text-medium font-serif text-center dark:text-gray-300">
              Enter your details below to create your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    className="dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    className="dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="relative space-y-1.5">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a Password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="absolute right-3 top-9.5 -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                {
                  loading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Please wait
                    </>
                  ) : ("Sign Up")
                }
              </Button>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span className="underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100">
                    Sign in
                  </span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

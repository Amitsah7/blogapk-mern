import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import userLogo from "../assets/user.jpg";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TotalProperty from "@/components/TotalProperty";

export const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    bio: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    github: "",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        occupation: user.occupation || "",
        bio: user.bio || "",
        facebook: user.facebook || "",
        linkedin: user.linkedin || "",
        instagram: user.instagram || "",
        github: user.github || "",
        file: null,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      file: e.target.files?.[0],
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("instagram", input.instagram);
    formData.append("linkedin", input.linkedin);
    formData.append("github", input.github);
    if (input?.file) {
      formData.append("file", input?.file);
    }

    // console.log(input);

    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `http://localhost:4000/api/v1/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="pt-20 md:ml-[320px] md:h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className=" flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className="flex flex-col items-center justify-center md:w-[400px]">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
              {user?.occupation || "Blog Writer"}
            </h1>
            <div className="flex gap-4 items-center">
              <Link to={`${user?.facebook}`} target="_blank">
                <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
              </Link>
              <Link to={`${user?.linkedin}`} target="_blank">
                <FaLinkedin className="w-6 h-6 dark:text-gray-300 text-gray-800" />
              </Link>
              <Link to={`${user?.github}`} target="_blank">
                <FaGithub className="w-6 h-6 dark:text-gray-300 text-gray-800" />
              </Link>
              <Link to={`${user?.instagram}`} target="_blank">
                <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
              </Link>
            </div>
          </div>
          {/* info section */}
          <div>
            <h1 className="font-bold text-center md:text-start text-4xl mb-7">
              Welcome {user?.firstName || "User"}!
            </h1>
            <p className="">
              <span className="font-semibold">Email : </span>
              {user?.email}
            </p>
            <div className="flex flex-col gap-2 items-start justify-start my-5">
              <Label className="text-xl">About Me</Label>
              <p className="border dark:border-gray-600 p-6  rounded-lg">
                {user?.bio ||
                  "I’m a writer and creator on BlogLekh, sharing ideas, stories, and knowledge through meaningful blogs. Passionate about learning, expressing thoughts, and connecting with readers worldwide."}
              </p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="cursor-pointer"
              >
                Edit Profile
              </Button>
              <DialogContent className="md:w-[425px] ">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">
                    Edit Profile
                  </DialogTitle>
                  <DialogDescription className="text-center text-md">
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="name" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={input.firstName}
                        onChange={changeEventHandler}
                        placeholder="First Name"
                        type="text"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="name" className="text-right">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={input.lastName}
                        onChange={changeEventHandler}
                        placeholder="Last Name"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Label>Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={input.facebook}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label>Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={input.instagram}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <div className="space-y-1.5">
                      <Label>Linkedin</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={input.linkedin}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label>Github</Label>
                      <Input
                        id="github"
                        name="github"
                        value={input.github}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="name" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      name="bio"
                      placeholder="I’m a writer and creator on BlogLekh, sharing ideas, stories, and knowledge through meaningful blogs. Passionate about learning, expressing thoughts, and connecting with readers worldwide."
                      className="col-span-3 text-gray-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="name" className="text-right">
                        Profession
                      </Label>
                      <Input
                        name="occupation"
                        value={input.occupation || ""}
                        onChange={changeEventHandler}
                        className="col-span-3 text-gray-500"
                        placeholder="Blog Writer"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="name" className="text-right">
                        Picture
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="w-[215px] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  {loading ? (
                    <Button>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                      wait
                    </Button>
                  ) : (
                    <Button
                      onClick={submitHandler}
                      className="cursor-pointer"
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
      <TotalProperty />
    </div>
  );
};

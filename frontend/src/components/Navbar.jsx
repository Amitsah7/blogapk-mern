import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png"
import userLogo from "../assets/user.jpg"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChartColumnBig, LogOut, Search, User } from "lucide-react";
import { FaMoon, FaRegEdit, FaSun } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { toast } from "sonner";
import API from "@/lib/api"
import { setUser } from "../redux/authSlice";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger
} from '../components/ui/dropdown-menu'
import { LiaCommentSolid } from "react-icons/lia"
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi"
import ResponsiveMenu from "./ResponsiveMenu";


const Navbar = () => {

  const {user} = useSelector(store=>store.auth)
  const {theme} = useSelector(store=>store.theme)
  const [searchTerm, setSearchTerm] = useState("")
  const [openNav, setOpenNav] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toggleNav = ()=> {
    setOpenNav(!openNav)
  }

  const handleSearch = (e)=> {
    e.preventDefault();
    if(searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm("")
    }
  }

  const logoutHandler = async ()=> {
    try {
      const res = await API.get(`/api/v1/user/logout`, {
        withCredentials: true
      })
      if(res.data.success) {
        navigate("/")
        dispatch(setUser(null))
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo section */}
        <div className="flex gap-7 items-center">
          <Link to={"/"}>
            <div className="flex gap-2 items-center">
              <img
                src={Logo}
                alt=""
                className="w-7 h-7 md:w-10 md:h-10 dark:invert"
              />
              <h1 className="font-bold text-3xl md:text-4xl">BlogLekh</h1>
            </div>
          </Link>
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="absolute right-0 top-0 cursor-pointer" 
            onClick={handleSearch}
            >
              <Search />
            </Button>
          </div>
        </div>

        {/* nav section */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
            <NavLink to={"/"} className="cursor-pointer">
              <li>Home</li>
            </NavLink>
            <NavLink to={"/blogs"} className={`cursor-pointer`}>
              <li>Blogs</li>
            </NavLink>
            <NavLink to={"/about"} className={`cursor-pointer`}>
              <li>About</li>
            </NavLink>
            {/* <NavLink to={'/write-blog'} className={`cursor-pointer`}><li>Write a Blog</li></NavLink> */}
          </ul>
          <div className="flex">
            <Button onClick={() => dispatch(toggleTheme())} className="cursor-pointer">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {user ? (
              <div className="ml-7 flex gap-3 items-center">
                {/* <Link to={'/profile'}> */}
                <DropdownMenu className="">
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user?.photoUrl || userLogo} />
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 dark:bg-gray-800">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer"
                        onClick={() => navigate("/dashboard/profile")}
                      >
                        <User />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"
                        onClick={() => navigate("/dashboard/your-blog")}
                      >
                        <ChartColumnBig />
                        <span>Your Blogs</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"
                        onClick={() => navigate("/dashboard/comments")}
                      >
                        <LiaCommentSolid />
                        <span>Comments</span>
                        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"
                        onClick={() => navigate("/dashboard/write-blog")}
                      >
                        <FaRegEdit />
                        <span>Write Blog</span>
                        <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer">
                      <LogOut />
                      <span>Logout</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* </Link> */}
                <Button className="hidden md:block cursor-pointer" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ml-7 md:flex gap-2 ">
                <Link to={"/login"}>
                  <Button className="cursor-pointer">Login</Button>
                </Link>
                <Link className="hidden md:block" to={"/signup"}>
                  <Button className="cursor-pointer">Signup</Button>
                </Link>
              </div>
            )}
          </div>
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden cursor-pointer" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden cursor-pointer" />
          )}
        </nav>
        <ResponsiveMenu
          openNav={openNav}
          setOpenNav={setOpenNav}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
};

export default Navbar;

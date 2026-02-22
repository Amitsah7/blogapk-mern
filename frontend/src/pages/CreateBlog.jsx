import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setLoading } from "@/redux/authSlice";
import { setBlog } from "@/redux/blogSlice";
import API from "@/lib/api"
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateBlog = () => {

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {blog, loading} = useSelector(store=>store.blog)

    const getSelectedCategory = (value) => {
        setCategory(value);
    }

    const createBlogHandler = async()=> {
        try {
            dispatch(setLoading(true))
            const res = await API.post(`/api/v1/blog/`, {title, category}, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            });
            if(res.data.success) {
                if(!blog) {
                    dispatch(setBlog([res.data.blog]))
                    navigate(`/dashboard/write-blog/${res.data.blog._id}`)
                    toast.success(res.data.message);
                }
                dispatch(setBlog([...blog, res.data.blog]))
                navigate(`/dashboard/write-blog/${res.data.blog._id}`)
                toast.success(res.data.message);
            } else {
                toast.error("Something went wrong")
            }

        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoading(false))
        }
    }

  return (
    <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
      <Card className="md:p-10 p-4 dark:bg-gray-800">
        <h1 className="text-4xl font-bold">Let's Create a Blog</h1>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Share your ideas, stories, and knowledge with the world on BlogLekh.
          Write meaningful blogs, express your thoughts, and connect with readers
          through powerful storytelling.
        </p>
        <div className="mt-7 ">
          <div className="space-y-1.5 flex-1">
            <Label className="text-md">Title</Label>
            <Input
              type="text"
              placeholder="Your Blog Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white dark:bg-gray-700"
            />
          </div>
          <div className="mt-4 mb-5 space-y-1.5 flex-1">
            <Label className="text-md">Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-700">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Blogging">Writing</SelectItem>
                    <SelectItem value="Writing">Blogging</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Personal Growth">Personal Growth</SelectItem>
                  </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {/* <Button  variant="outline">Cancel</Button> */}
            <Button className="cursor-pointer" disabled={loading} onClick={createBlogHandler}>
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create Blog"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;

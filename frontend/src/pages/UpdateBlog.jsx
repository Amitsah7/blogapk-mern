import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setLoading } from "@/redux/authSlice";
import { setBlog } from "@/redux/blogSlice";
import axios from "axios";
import JoditEditor from "jodit-react";
import { Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UpdateBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.blogId;
  const { blog, loading } = useSelector((store) => store.blog);
  const selectBlog = blog.find((blog) => blog._id === id);

  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState(selectBlog.description);

  const [blogData, setBlogData] = useState({
    title: selectBlog?.title,
    subtitle: selectBlog?.subtitle,
    description: content,
    category: selectBlog?.category,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value});
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);
    formData.append("file", blogData.thumbnail);
    try {
      dispatch(setLoading(true));
      const res = await axios.put(`http://localhost:4000/api/v1/blog/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      if(res.data.success) {
        toast.success(res.data.message);
        // dispatch([...course, setCourse(res.data.course)])
        console.log(blogData);
      }

    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePublishUnpublish = async (action) => {
    console.log("action", action);

    try {
      const res = await axios.patch(`http://localhost:4000/api/v1/blog/${id}`, {
          params: {
            action,
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
        navigate(`/dashboard/your-blog`);
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/v1/blog/delete/${id}`, { 
        withCredentials: true },
      );
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
      // console.log(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("something went error");
    }
  };

  return (
    <div className="pb-10 px-3 pt-20 md:ml-[320px]">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">
          <h1 className=" text-4xl font-bold ">Basic Blog Information</h1>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Make changes to your blogs here. Click publish when you're done.
          </p>
          <div className="space-x-2">
            <Button className="cursor-pointer"
              onClick={() =>
                togglePublishUnpublish(!selectBlog?.isPublished)
              }
            >
              {selectBlog?.isPublished ? "UnPublish" : "Publish"}
            </Button>
            <Button variant="destructive" onClick={deleteBlog} className="cursor-pointer">
              Delete Blog
            </Button>
          </div>
          <div className="pt-7 space-y-1.5 flex-1">
            <Label className="text-md">Title</Label>
            <Input
              type="text"
              placeholder="Enter a title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <Label className="text-md">Subtitle</Label>
            <Input
              type="text"
              placeholder="Enter a subtitle"
              name="subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div className="space-y-2 flex-1">
            <Label className="text-md">Description</Label>
            <JoditEditor
              ref={editor}
              value={blogData.description}
              onChange={(newContent) => setContent(newContent)}
              className="jodit_toolbar"
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <Label className="text-md">Category</Label>
            <Select
              onValueChange={selectCategory}
              className="dark:border-gray-300"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Blogging">Blogging</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Personal Growth">Personal Growth</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1"> 
            <Label className="mb-1 text-md">Thumbnail</Label>
            <Input
              id="file"
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-full dark:border-gray-300 cursor-pointer"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-full my-2"
                alt="Blog Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)} className="cursor-pointer">
              Back
            </Button>
            <Button onClick={updateBlogHandler} className="cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Saving... 
                </> 
              ) : ( 
                "Save Changes"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;

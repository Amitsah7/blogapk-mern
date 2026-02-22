import React from "react";
import aboutImg from "../assets/About-blog.avif"

const About = () => {
  return (
    <div className=" min-h-screen pt-28 px-4 md:px-0 mb-7 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="md:text-5xl text-4xl font-extrabold  mb-4">
            About BlogLekh
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            BlogLekh is a space where ideas become stories — empowering creators
            to write, share, and inspire through meaningful blogging.
          </p>
        </div>

        {/* Image + Text Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={aboutImg}
            alt="Blog Illustration"
            className="w-full h-72 object-cover rounded-2xl shadow-md"
          />
          <div>
            <p className=" text-lg mb-4">
              Welcome to BlogLekh — a platform built for writers, thinkers, and
              storytellers. Here, anyone can turn ideas into blogs and share
              knowledge with a global community.
            </p>
            <p className=" text-lg mb-4">
              Whether you're writing about technology, lifestyle, travel, or personal
              experiences, BlogLekh provides simple and powerful tools to help you
              publish effortlessly and connect with readers.
            </p>
            <p className=" text-lg">
              Our mission is to make writing accessible to everyone and create a
              community where creativity and learning grow together.
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl italic text-gray-500 max-w-2xl mx-auto leading-relaxed">
            “Every story matters. BlogLekh gives your words a voice.”
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default About;

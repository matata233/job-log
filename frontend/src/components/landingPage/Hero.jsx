import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="pt-32 md:pt-40">
        {/* Section header */}
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold leading-relaxed dark:text-gray-200 md:text-6xl md:leading-loose">
            The{" "}
            <span className="rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 px-1 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500">
              Job Application Tracker
            </span>{" "}
            you're looking for
          </h1>
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
              <span className="rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 px-1 font-semibold italic dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500">
                JoBlog
              </span>{" "}
              is a comprehensive job application management app designed to
              streamline the job search process for job seekers. It helps you
              keep track of all your job applications in one place, so you can
              focus on what really matters:{" "}
              <strong className="text-light-purple-300 dark:text-dark-purple-300">
                getting hired!
              </strong>
            </p>
            <div className="flex items-center justify-center">
              <Link
                to={"/signup"}
                className="rounded bg-light-purple-100 p-2 text-indigo-800 transition-colors duration-500 ease-in-out hover:bg-white hover:ring-2 hover:ring-indigo-800 dark:bg-purple-950 dark:text-dark-purple-100 dark:hover:bg-dark-bgColor-300 dark:hover:ring-dark-purple-100"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

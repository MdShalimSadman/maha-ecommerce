"use client";

import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto mt-10">
      {/* Welcome Card Skeleton */}
      <div className="border rounded-lg p-6 animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 rounded mt-2"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-64 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Orders Table Skeleton */}
      <div className="border rounded-lg p-6 animate-pulse space-y-4">
        {/* Table Header */}
        <div className="flex space-x-4">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex space-x-4 mt-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;

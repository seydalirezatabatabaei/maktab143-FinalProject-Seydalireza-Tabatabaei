"use client";

import React from "react";

interface AdminPageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full px-8 py-5 border-b bg-white">
      <h1 className="text-2xl font-bold text-gray-900">
        {title}
      </h1>

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
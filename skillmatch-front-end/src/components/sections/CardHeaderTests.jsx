import React from "react";
import { Badge } from "../ui/badge";
import { CardHeader } from "../ui/card";

export const CardHeaderByAnima = () => {
  return (
    <div className="bg-white w-full">
      <CardHeader className="flex flex-row items-center justify-between py-5 px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-900 text-[18px] leading-[28px] font-medium tracking-[0px]">
            Problems
          </h2>
          <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-50 px-2 py-0.5 rounded-2xl">
            <span className="text-[12px] leading-[18px] font-medium">
              100 problem
            </span>
          </Badge>
        </div>
      </CardHeader>
    </div>
  );
};

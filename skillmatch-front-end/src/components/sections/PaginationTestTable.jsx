import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";

export const PaginationByAnima = () => {
  // Page numbers data for mapping
  const pageNumbers = [1, 2, 3, null, 8, 9, 10]; // null represents ellipsis

  return (
    <Pagination className="flex items-center justify-between pt-3 pb-4 px-6 relative self-stretch w-full flex-[0_0_auto]">
      <PaginationItem className="inline-flex items-start relative flex-[0_0_auto] rounded-lg">
        <Button
          variant="outline"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 relative flex-[0_0_auto] bg-white rounded-lg overflow-hidden border border-solid border-[#cfd4dc] shadow-shadow-xs"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="text-gray-700 text-sm leading-5 whitespace-nowrap [font-family:'Inter',Helvetica] font-medium">
            Previous
          </span>
        </Button>
      </PaginationItem>

      <PaginationContent className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
        {pageNumbers.map((number, index) =>
          number === null ? (
            <PaginationItem
              key={`ellipsis-${index}`}
              className="relative w-10 h-10 rounded-lg overflow-hidden"
            >
              <PaginationEllipsis className="flex w-10 h-10 items-center justify-center p-3 relative rounded-lg">
                <span className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  ...
                </span>
              </PaginationEllipsis>
            </PaginationItem>
          ) : (
            <PaginationItem
              key={number}
              className={`relative w-10 h-10 ${number === 1 ? "bg-primary-50" : ""} rounded-lg overflow-hidden`}
            >
              <PaginationLink
                href="#"
                className="flex w-10 h-10 items-center justify-center p-3 relative rounded-lg"
                isActive={number === 1}
              >
                <span
                  className={`relative w-fit [font-family:'Inter',Helvetica] font-medium ${number === 1 ? "text-primary-600" : "text-gray-500"} text-sm tracking-[0] leading-5 whitespace-nowrap`}
                >
                  {number}
                </span>
              </PaginationLink>
            </PaginationItem>
          ),
        )}
      </PaginationContent>

      <PaginationItem className="inline-flex items-start relative flex-[0_0_auto] rounded-lg">
        <Button
          variant="outline"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 relative flex-[0_0_auto] bg-white rounded-lg overflow-hidden border border-solid border-[#cfd4dc] shadow-shadow-xs"
        >
          <span className="text-gray-700 text-sm leading-5 whitespace-nowrap [font-family:'Inter',Helvetica] font-medium">
            Next
          </span>
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </PaginationItem>
    </Pagination>
  );
};

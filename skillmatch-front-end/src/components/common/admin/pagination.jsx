// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   MoreHorizontalIcon,
// } from "lucide-react";
// import * as React from "react";

// import { cn } from "./lib/utils";
// import { buttonVariants } from "./button";

// // Fixed: Added children and wrapped the content inside the <nav> element
// const Pagination = ({ className, children, ...props }) => (
//   <nav
//     role="navigation"
//     aria-label="pagination"
//     className={cn("mx-auto flex w-full justify-center", className)}
//     {...props}
//   >
//     {children}
//   </nav>
// );
// Pagination.displayName = "Pagination";

// const PaginationContent = React.forwardRef(
//   ({ className, children, ...props }, ref) => (
//     <ul
//       ref={ref}
//       className={cn("flex flex-row items-center gap-1", className)}
//       {...props}
//     >
//       {children}
//     </ul>
//   )
// );
// PaginationContent.displayName = "PaginationContent";

// const PaginationItem = React.forwardRef(
//   ({ className, children, ...props }, ref) => (
//     <li ref={ref} className={cn("", className)} {...props}>
//       {children}
//     </li>
//   )
// );
// PaginationItem.displayName = "PaginationItem";

// const PaginationLink = ({
//   className,
//   isActive,
//   size = "icon",
//   children,
//   ...props
// }) => (
//   <a
//     aria-current={isActive ? "page" : undefined}
//     className={cn(
//       buttonVariants({
//         variant: isActive ? "outline" : "ghost",
//         size,
//       }),
//       className
//     )}
//     {...props}
//   >
//     {children}
//   </a>
// );
// PaginationLink.displayName = "PaginationLink";

// const PaginationPrevious = ({ className, ...props }) => (
//   <PaginationLink
//     aria-label="Go to previous page"
//     size="default"
//     className={cn("gap-1 pl-2.5", className)}
//     {...props}
//   >
//     <ChevronLeftIcon className="h-4 w-4" />
//     <span>Previous</span>
//   </PaginationLink>
// );
// PaginationPrevious.displayName = "PaginationPrevious";

// const PaginationNext = ({ className, ...props }) => (
//   <PaginationLink
//     aria-label="Go to next page"
//     size="default"
//     className={cn("gap-1 pr-2.5", className)}
//     {...props}
//   >
//     <span>Next</span>
//     <ChevronRightIcon className="h-4 w-4" />
//   </PaginationLink>
// );
// PaginationNext.displayName = "PaginationNext";

// const PaginationEllipsis = ({ className, ...props }) => (
//   <span
//     aria-hidden
//     className={cn("flex h-9 w-9 items-center justify-center", className)}
//     {...props}
//   >
//     <MoreHorizontalIcon className="h-4 w-4" />
//     <span className="sr-only">More pages</span>
//   </span>
// );
// PaginationEllipsis.displayName = "PaginationEllipsis";

// export {
//   Pagination,
//   PaginationContent,
//   PaginationLink,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationNext,
//   PaginationEllipsis,
// };

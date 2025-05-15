import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";
import { api } from "../api/api";
import NavbarCompany from "../components/common/navbarCompany";
function cn(...inputs) {
    return twMerge(clsx(inputs));
}


const Avatar = React.forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className,
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className,
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);


const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className,
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";
const Pagination = ({ className, ...props }) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            className,
        )}
        {...props}
    />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeftIcon className="h-4 w-4" />
        <span>Previous</span>
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>Next</span>
        <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
            className,
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className,
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className,
        )}
        {...props}
    />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className,
        )}
        {...props}
    />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";

const ContentByAnima = () => {

    const [candidates, setCandidates] = React.useState([]);
    const [Loading, setLoading] = React.useState(true)
    const [message, setMessage] = React.useState('')
    const [currentPage, setCurrentPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(1);
    const CompanyId = JSON.parse(localStorage.getItem("company_id"));
    const goToPage = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= lastPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex flex-wrap items-center mt-4 gap-1">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
                >
                    Previous
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'border text-gray-600 hover:bg-gray-100'}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
                >
                    Next
                </button>
            </div>
        );
    };
    const Fire = async (candidateId) => {
        try {
            console.log("Firing candidate with ID:", candidateId);
            console.log("Company ID:", CompanyId);

            const response = await api.delete('api/company/delete/candidate/selected', {
                data: {
                    candidate_id: candidateId,
                    company_id: CompanyId
                }
            });

            console.log(response.data.message);
            // Optional: Use toast or UI message instead of reload
            window.location.reload();
        } catch (error) {
            console.error("Error deleting candidate selection:", error.response?.data?.message || error.message);
        }
    };

    React.useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const companyId = JSON.parse(localStorage.getItem("company_id")); // dynamic ID
                await api.get('/sanctum/csrf-cookie');
                const response = await api.get(`api/company/${CompanyId}/candidates/selected?page=${currentPage}`);

                const formattedCandidates = response.data.data.map((candidate) => {
                    const hasImage = !!candidate.profile?.photoProfil;
                    const avatar = hasImage
                        ? `${import.meta.env.VITE_API_BASE_URL}/storage/${candidate.profile.photoProfil}`
                        : "";
                    const initials = !hasImage && candidate.name
                        ? candidate.name.charAt(0).toUpperCase()
                        : "";

                    return {
                        id: candidate.id,
                        name: candidate.name,
                        email: candidate.email,
                        avatar,
                        hasImage,
                        initials,
                        date: new Date(candidate?.pivot?.created_at).toLocaleDateString(),
                        badges: candidate?.badges?.length ?? 0,
                        badgeImage: "https://c.animaapp.com/macl8400TWBRsn/img/image-9-9.png",
                    };
                });

                setCandidates(formattedCandidates);
                setLastPage(response.data.last_page);
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Something went wrong.";
                setMessage(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [CompanyId, currentPage]);
    if (Loading && !message) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-700"></div>
            </div>
        );
    }
    if (message) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-red-500">{message}</p>
                <button onClick={() => { window.location.href = `/company/Session/${CompanyId}` }}>
                    Home
                </button>
            </div>
        );
    }


    return (
        <>



            <div className="w-full bg-white">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[421px] h-11 px-6 py-3 text-xs font-medium text-gray-500">
                                Candidat
                            </TableHead>
                            <TableHead className="w-44 h-11 px-6 py-3 text-xs font-medium text-gray-500">
                                Date selection
                            </TableHead>
                            <TableHead className="w-44 h-11 px-6 py-3 text-xs font-medium text-gray-500 text-center">
                                Total Badges
                            </TableHead>
                            <TableHead className="w-[220px] h-11 px-6 py-3 text-xs font-medium text-gray-500 text-center">
                                Details
                            </TableHead>
                            <TableHead className="w-[223px] h-11 px-6 py-3 text-xs font-medium text-gray-500 text-center">
                                Fire
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id} className="border-b border-[#eaecf0]">
                                <TableCell className="h-[72px] px-6 py-4 flex items-center gap-3">
                                    {candidate.hasImage ? (
                                        <div
                                            className="w-8 h-8 rounded-[200px] bg-cover bg-center"
                                            style={{ backgroundImage: `url(${candidate.avatar})` }}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-primary-50 rounded-[200px] flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary-600">
                                                {candidate.initials}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-start">
                                        <div className="text-sm font-normal text-gray-900">
                                            {candidate.name}
                                        </div>
                                        <div className="text-sm font-normal text-gray-500">
                                            {candidate.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="h-[72px] px-6 py-4">
                                    <div className="text-sm font-normal text-gray-500">
                                        {candidate.date}
                                    </div>
                                </TableCell>
                                <TableCell className="h-[72px] px-6 py-4 flex items-center justify-center">
                                    <div className="text-base font-medium text-[#667085] mr-2">
                                        {candidate.badges}
                                    </div>
                                    <img
                                        className="w-[31px] h-[31px] object-cover"
                                        alt="Badge"
                                        src={candidate.badgeImage}
                                    />
                                </TableCell>
                                <TableCell className="h-[72px] px-6 py-4 text-center">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = `/company/candidate/profile/${candidate.id}`;
                                        }}
                                        className="w-[103px] h-10 bg-[#0a84ff26] hover:bg-[#0a84ff40] text-[#0a84ff] font-semibold rounded-md transition duration-200 ease-in-out hover:shadow-md"
                                    >
                                        Details
                                    </button>

                                </TableCell>
                                <TableCell className="h-[72px] px-6 py-4 text-center">
                                    <button onClick={(e) => { e.preventDefault(); Fire(candidate.id) }} className="w-[103px] h-10 bg-[#ff000033] hover:bg-[#ff000050] text-[#ff0a0a] font-semibold rounded-md transition duration-200 ease-in-out hover:shadow-md">
                                        Fire
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                {renderPagination()}
            </div>
        </>
    );
};
export const ListCandidateSelected = () => {
    return (
        <>
            <NavbarCompany />
            <div className="w-full min-h-screen bg-white flex justify-center items-start pt-[70px] px-4">
                <div className="w-full max-w-[1216px]">
                    <Card className="w-full border border-gray-200 rounded-lg shadow-shadow-md overflow-hidden">
                        <ContentByAnima />
                    </Card>
                </div>
            </div>
        </>
    );
};
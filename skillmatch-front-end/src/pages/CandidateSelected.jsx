import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cva } from "class-variance-authority";
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

const ContentByAnima = () => {
    const [candidates, setCandidates] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(1);
    const companyId = JSON.parse(localStorage.getItem("company_id"));

    const goToPage = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const maxPagesToShow = 5;
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center mt-4 gap-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Previous page"
                >
                    Previous
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => goToPage(1)}
                            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={cn(
                            buttonVariants({ variant: currentPage === page ? "default" : "ghost", size: "sm" })
                        )}
                    >
                        {page}
                    </button>
                ))}

                {endPage < lastPage && (
                    <>
                        {endPage < lastPage - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => goToPage(lastPage)}
                            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                        >
                            {lastPage}
                        </button>
                    </>
                )}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>
        );
    };

    const removeCandidate = async (candidateId) => {
        try {
            await api.get('/sanctum/csrf-cookie');
            const response = await api.delete('api/company/delete/candidate/selected', {
                data: {
                    candidate_id: candidateId,
                    company_id: companyId
                }
            });
            setCandidates(prev => prev.filter(candidate => candidate.id !== candidateId));
        } catch (error) {
            setError(error.response?.data?.message || "Error during deletion");
        }
    };

    React.useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                await api.get('/sanctum/csrf-cookie');
                const response = await api.get(`api/company/candidates/selected?company_id=${companyId}`);

                if (response.data && response.data.selected_candidates) {
                    const formattedCandidates = response.data.selected_candidates.map((selectedCandidate) => {
                        const candidate = selectedCandidate.candidate;
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
                            date: new Date(selectedCandidate.created_at).toLocaleDateString(),
                            badges: candidate.tests?.length ?? 0,
                            badgeImage: "https://c.animaapp.com/macl8400TWBRsn/img/image-9-9.png",
                        };
                    });

                    setCandidates(formattedCandidates);
                    setLastPage(1); // Pagination needs server-side support
                } else {
                    setCandidates([]);
                    setError("No selected candidates found");
                }
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while loading data.");
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchCandidates();
        } else {
            setError("Company ID missing");
            setLoading(false);
        }
    }, [companyId, currentPage]);

    if (loading && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-700"></div>
            </div>
        );
    }

    if (error && candidates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
                <p className="text-red-500 text-center">{error}</p>
                <button
                    onClick={() => { window.location.href = `/company/dashboard/${companyId}` }}
                    className={cn(buttonVariants({ variant: "default", size: "default" }))}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="w-[421px] h-11 px-6 py-3 text-xs font-medium text-gray-500">
                            Candidate
                        </TableHead>
                        <TableHead className="w-44 h-11 px-6 py-3 text-xs font-medium text-gray-500">
                            Selection Date
                        </TableHead>
                        <TableHead className="w-44 h-11 px-6 py-3 text-xs font-medium text-gray-500 text-center">
                            Total Badges
                        </TableHead>
                        <TableHead className="w-[220px] h-11 px-6 py-3 text-xs font-medium text-gray-500 text-center">
                            Details
                        </TableHead>
                        <TableHead className="w-[223px] h-11 px-6 py-3 text-xs font-medium text-gray-500 text-center">
                            Remove
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidates.map((candidate) => (
                        <TableRow key={candidate.id} className="border-b border-[#eaecf0]">
                            <TableCell className="h-[72px] px-6 py-4 flex items-center gap-3">
                                {candidate.hasImage ? (
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                        <AvatarFallback>{candidate.initials}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-primary-50 text-primary-600">
                                            {candidate.initials}
                                        </AvatarFallback>
                                    </Avatar>
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
                                    className={cn(
                                        buttonVariants({ variant: "outline", size: "sm" }),
                                        "bg-[#0a84ff26] hover:bg-[#0a84ff40] text-[#0a84ff]"
                                    )}
                                    aria-label={`View details for ${candidate.name}`}
                                >
                                    Details
                                </button>
                            </TableCell>
                            <TableCell className="h-[72px] px-6 py-4 text-center">
                                <button
                                    onClick={(e) => { e.preventDefault(); removeCandidate(candidate.id); }}
                                    className={cn(
                                        buttonVariants({ variant: "destructive", size: "sm" }),
                                        "bg-[#ff000033] hover:bg-[#ff000050] text-[#ff0a0a]"
                                    )}
                                    aria-label={`Remove ${candidate.name}`}
                                >
                                    Remove
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {candidates.length > 0 && renderPagination()}
        </div>
    );
};

export const ListCandidateSelected = () => {
    return (
        <>
            <NavbarCompany />
            <div className="w-full min-h-screen bg-white flex justify-center items-start pt-[70px] px-4">
                <div className="w-full max-w-[1216px]">
                    <Card className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
                        <ContentByAnima />
                    </Card>
                </div>
            </div>
        </>
    );
};
"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import clsx from "clsx";

export default function BudgetTransactionsTablePagination({
    currPage,
    totalPageCount,
    disabled,
}: {
    currPage: number,
    totalPageCount: number,
    disabled?: boolean,
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [ ellipsisPlacement, setEllipsisPlacement ] = useState<"hidden" | "left" | "right" | "both">("hidden");

    const getMidPaginationPages = useCallback(() => {
        let startingPageNum = 2, endingPageNum = totalPageCount - 1;
        if (totalPageCount <= 7) {
            if (totalPageCount <= 2) return [];
            if (totalPageCount === 3) return [startingPageNum];
        } else if (currPage <= 4) {
            endingPageNum = 5;
        } else if (currPage >= totalPageCount - 2) {
            startingPageNum = totalPageCount - 2;
        } else {
            startingPageNum = currPage - 1;
            endingPageNum = currPage + 1;
        }
        return Array.from(new Array(endingPageNum - startingPageNum + 1), (_, pageNum) => pageNum + startingPageNum);
    }, [currPage, totalPageCount]);

    const getPaginationLinkUrl = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", `${page}`);
        return `${pathname}?${params.toString()}`;
    }, [searchParams, pathname]);

    useEffect(() => {
        if (totalPageCount <= 7) {
            setEllipsisPlacement("hidden");
            return;
        }
        if (currPage <= 4) {
            setEllipsisPlacement("right");
            return;
        }
        if (currPage >= totalPageCount - 3) {
            setEllipsisPlacement("left");
            return;
        }
        setEllipsisPlacement("both");
    }, [currPage, totalPageCount]);

    return (
        <Pagination className="mt-auto pt-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={getPaginationLinkUrl(currPage - 1)}
                        aria-disabled={disabled || currPage === 1}
                        className={clsx(
                            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                            { "pointer-events-none": currPage === 1 },
                        )}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href={getPaginationLinkUrl(1)}
                        isActive={currPage === 1}
                        aria-disabled={disabled}
                        className={clsx(
                            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                            { "pointer-events-none": disabled },
                        )}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem hidden={ellipsisPlacement === "right" || ellipsisPlacement === "hidden"}>
                    <PaginationEllipsis />
                </PaginationItem>
                {getMidPaginationPages().map((pageNum) => {
                    return (
                        <PaginationItem key={`page_${pageNum}`}>
                            <PaginationLink
                                href={getPaginationLinkUrl(pageNum)}
                                isActive={currPage === pageNum}
                                aria-disabled={disabled}
                                className={clsx(
                                    "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                                    { "pointer-events-none": disabled },
                                )}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem hidden={ellipsisPlacement === "left" || ellipsisPlacement === "hidden"}>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem hidden={totalPageCount <= 1}>
                    <PaginationLink
                        href={getPaginationLinkUrl(totalPageCount)}
                        isActive={currPage === totalPageCount}
                        aria-disabled={disabled}
                        className={clsx(
                            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                            { "pointer-events-none": disabled },
                        )}
                    >
                        {totalPageCount}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        href={getPaginationLinkUrl(currPage + 1)}
                        aria-disabled={currPage >= totalPageCount}
                        className={clsx(
                            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                            { "pointer-events-none": disabled || currPage >= totalPageCount },
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
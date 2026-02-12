import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { router } from '@inertiajs/react';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: Link[];
    className?: string;
}

export default function PaginationLaravel({ links, className }: Props) {
    if (!links || links.length === 0) return null;

    const goTo = (url: string | null) => {
        if (!url) return;

        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className={`mt-4 flex justify-end ${className ?? ''}`}>
            <Pagination>
                <PaginationContent>
                    {links.map((link, index) => {
                        // Previous
                        if (link.label.includes('Previous')) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationPrevious
                                        href={link.url ?? '#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goTo(link.url);
                                        }}
                                        className={
                                            !link.url
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>
                            );
                        }

                        // Next
                        if (link.label.includes('Next')) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationNext
                                        href={link.url ?? '#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goTo(link.url);
                                        }}
                                        className={
                                            !link.url
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>
                            );
                        }

                        // Ellipsis
                        if (link.label === '...') {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        // Page number
                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href={link.url ?? '#'}
                                    isActive={link.active}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goTo(link.url);
                                    }}
                                >
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

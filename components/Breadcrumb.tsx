import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}


export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <li className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {item.href && !isLast ? (
                                <>
                                    <Link
                                        href={item.href}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            ) : (
                                <span className={isLast ? "text-foreground font-medium" : ""}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

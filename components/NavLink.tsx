"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type NavLinkClassFunc = (props: { isActive: boolean; isPending: boolean }) => string;

interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> {
  to: string;
  className?: string | NavLinkClassFunc;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === to;

    const computedClassName = typeof className === 'function'
      ? className({ isActive, isPending: false })
      : cn(className, isActive && activeClassName);

    return (
      <Link
        ref={ref}
        href={to}
        className={computedClassName}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };

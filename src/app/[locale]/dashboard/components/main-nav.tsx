
 "use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FilePenLine, Sparkles, Settings, UserCog, Calendar, Users, Mail, Share2, BarChart3, Package, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

interface MainNavProps {
    isMobile?: boolean;
    onLinkClick?: () => void;
}

export function MainNav({ isMobile = false, onLinkClick }: MainNavProps) {
    const pathname = usePathname()
    const t = useScopedI18n("dashboard");

    const navItems = [
        { href: "/dashboard", icon: Home, label: t("home") },
        { href: "/dashboard/analytics", icon: BarChart3, label: t("analytics") },
        { href: "/dashboard/appointments", icon: Calendar, label: t("appointments") },
        { href: "/dashboard/clients", icon: Users, label: t("clients") },
        { href: "/dashboard/services", icon: Package, label: t("services") },
        { href: "/dashboard/locations", icon: MapPin, label: t("locations") },
        { href: "/dashboard/channels", icon: Share2, label: t("channels") },
        { href: "/dashboard/editor", icon: FilePenLine, label: t("editor") },
        { href: "/dashboard/ai-settings", icon: Sparkles, label: t("ai-settings") },
        { href: "/dashboard/email-templates", icon: Mail, label: t("email-templates") },
        { href: "/dashboard/settings", icon: Settings, label: t("settings") },
        { href: "/dashboard/account", icon: UserCog, label: t("account") },
    ]

    const Comp = isMobile ? 'div' : 'nav';
    const itemClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
    const activeClass = "bg-muted text-primary";

    return (
        <Comp className={isMobile ? "grid items-start gap-4" : "grid items-start px-2 text-sm font-medium lg:px-4"}>
            {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(itemClass, pathname.startsWith(item.href) && item.href !== '/dashboard' ? activeClass : pathname === item.href ? activeClass : '')}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </Comp>
    )
}

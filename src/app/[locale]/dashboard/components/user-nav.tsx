
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/modules/shared/auth/actions"
import { useRouter } from "next/navigation"
import { useScopedI18n } from "@/locales/client"

export function UserNav() {
  const router = useRouter()
  const t = useScopedI18n("user-nav")
  
  const handleLogout = async () => {
    await logout();
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('my-account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
        <DropdownMenuItem>{t('support')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>{t('logout')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, GraduationCap, Users, Book, ListChecks } from 'lucide-react';
import AppLogo from './app-logo';

const allNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
        {
        title: 'Teacher',
        href: '/teachers',
        icon: GraduationCap,
    },
        {
        title: 'Students',
        href: '/students',
        icon: Users,
    },
        {
        title: 'Courses',
        href: '/courses',
        icon: Book,
    },
        {
        title: 'Enrollments',
        href: '/enrollments',
        icon: ListChecks,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRoles = auth?.user?.roles || [];
    const isAdmin = userRoles.includes('admin');

    // Filter navigation items based on user role
    const mainNavItems = allNavItems.filter((item) => {
        // Dashboard is always visible
        if (item.title === 'Dashboard') {
            return true;
        }
        // Admin-only items
        if (['Teacher', 'Students', 'Courses', 'Enrollments'].includes(item.title)) {
            return isAdmin;
        }
        // Default: show all other items
        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

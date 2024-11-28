import SideNav from "@/components/common/sidenav";
import TopBar from "@/components/common/topbar";
import BottomNav from "@/components/common/bottom-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row max-md:flex-col h-screen bg-gray-50 overflow-hidden">
            <SideNav />
            <div className="flex-grow overflow-y-auto">
                <TopBar />
                {children}
                <BottomNav />
            </div>
        </div>
    );
}
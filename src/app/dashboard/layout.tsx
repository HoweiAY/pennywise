import SideNav from "@/components/common/sidenav";
import TopBar from "@/components/common/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row max-md:flex-col h-screen bg-gray-50 overflow-hidden">
            <SideNav />
            <div className="flex-grow overflow-y-auto">
                <TopBar />
                {children}
            </div>
        </div>
    );
}
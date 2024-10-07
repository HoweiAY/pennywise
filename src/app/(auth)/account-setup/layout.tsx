import { SetupBreadcrumbs } from "@/components/auth/account-setup/setup-breadcrumbs";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center h-screen min-h-[700px] bg-gray-50">
            <main className="flex flex-col justify-between border rounded-2xl shadow-2xl w-8/12 max-lg:w-10/12 max-md:w-3/4 md:h-[600px] min-w-[400px] min-h-[400px] p-6 bg-white overflow-hidden">
                <header className="md:p-2">
                    <h1 className="text-4xl max-lg:text-3xl font-bold">
                        Let's get you started!
                    </h1>
                    <p className="my-1 max-lg:text-sm text-gray-500">
                        Set up your account to start using PennyWise
                    </p>
                </header>
                <div className="flex flex-row justify-center items-center gap-1">
                    <SetupBreadcrumbs />
                    {children}
                </div>
            </main>
        </div>
    );
}
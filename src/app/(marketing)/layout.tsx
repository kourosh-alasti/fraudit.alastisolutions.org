import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

const LayoutHeader = () => {
  return (
    <header className="h-20 w-full border-b border-slate-300 px-4">
      <div className="lg:max-w-screen mx-auto flex h-full items-center justify-between">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/logo.png" alt="Mascot" height={40} width={40} />
          <h1 className="text-2xl font-extrabold uppercase tracking-wide text-neutral-700">
            Fraudit
          </h1>
        </div>
        <ClerkLoading>
          <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="lg" variant="ghost">
                Login
              </Button>
            </SignInButton>
          </Show>
        </ClerkLoaded>
      </div>
    </header>
  );
};

export default MarketingLayout;

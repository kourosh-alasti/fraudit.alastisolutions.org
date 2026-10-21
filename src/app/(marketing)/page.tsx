import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignOutButton,
  SignUpButton,
  Show,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MarketingPage = () => {
  return (
    <>
      <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row">
        <div className="relative mb-8 h-[240px] w-[240px] lg:mb-0 lg:h-[424px] lg:w-[424px]">
          <Image src="/logo.png" fill alt="Hero SVG" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-700 lg:text-3xl">
            A New Way to Reddit: Simple, Safe, Secure - Fraudit
          </h1>

          <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </ClerkLoading>
            <ClerkLoaded>
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button size="lg" variant={"default"} className="w-full">
                    Get Started
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant={"ghost"} className="w-full">
                    Already have an account?
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Button
                  size="lg"
                  variant={"secondary"}
                  className="w-full"
                  asChild
                >
                  <Link href="/app">Contine Browsing</Link>
                </Button>
              </Show>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketingPage;

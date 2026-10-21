"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Menu, PlusIcon, XIcon } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { SearchBar } from "./search-bar";

export const AppBar = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="z-999 mb-2 w-full border-b">
      <div className="mx-auto max-w-(--breakpoint-xl) items-center px-4 md:flex md:justify-between md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5">
          <Link href="/rmp">
            <Image
              src="/logo.png"
              height="100"
              width="100"
              alt="Fraudit Logo"
              priority
            />
          </Link>
          <SearchBar className="hidden md:flex" />

          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-gray-700 outline-hidden focus:border focus:border-gray-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon /> : <Menu />}
            </button>
          </div>
        </div>
        <div
          className={`mt-8 w-full flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${isMobileMenuOpen ? "block" : "hidden"}`}
        >
          <ul className="flex w-full flex-col items-center justify-center gap-y-3 md:space-x-6 md:space-y-0">
            <div className="ml-2 flex items-center gap-x-1 md:ml-0 md:gap-4 md:self-end">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
              </Show>
              <div>
                <Button
                  className="px-1"
                  variant="outline"
                  onClick={() => router.push("/rmp/create/review")}
                  disabled
                >
                  <PlusIcon className="h-4 w-4" />
                  Review Professor
                </Button>
              </div>

              <Show when="signed-in">
                <li key="logout-user" className="block md:hidden">
                  <Button>Logout</Button>
                </li>
              </Show>

              <div className="hidden md:block">
                <ClerkLoaded>
                  <UserButton />
                </ClerkLoaded>
                <ClerkLoading>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </ClerkLoading>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

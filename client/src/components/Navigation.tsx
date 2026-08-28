import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <Brain className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-foreground">CAUS Lab</span>
            </Link>
            {location !== "/" && (
              <div className="hidden md:block ml-4 lg:ml-8">
                <div className="flex items-baseline gap-1 xl:gap-2">
                  <Link href="/terminology">
                    <Button variant="ghost" size="sm" className="whitespace-nowrap px-2 text-xs lg:text-sm">
                      Terminology
                    </Button>
                  </Link>
                  <Link href="/causal-foundation-model">
                    <Button variant="ghost" size="sm" className="whitespace-nowrap px-2 text-xs lg:text-sm">
                      What Is a Causal Foundation Model?
                    </Button>
                  </Link>
                  <Link href="/our-service">
                    <Button variant="ghost" size="sm" className="whitespace-nowrap px-2 text-xs lg:text-sm">
                      Our Service
                    </Button>
                  </Link>
                  <Link href="/applications">
                    <Button variant="ghost" size="sm" className="whitespace-nowrap px-2 text-xs lg:text-sm">
                      Applications
                    </Button>
                  </Link>
                  <Link href="/ask">
                    <Button variant="ghost" size="sm" className="whitespace-nowrap px-2 text-xs lg:text-sm">
                      Ask Anything
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}

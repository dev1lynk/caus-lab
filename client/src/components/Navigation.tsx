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
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link href="/workflow">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <span>Workflow</span>
                    </Button>
                  </Link>
                  <Link href="/stm-demo">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <span>STM Demo</span>
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

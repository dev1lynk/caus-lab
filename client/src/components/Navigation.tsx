import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChartGantt, User } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <ChartGantt className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-foreground">CausalAI</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a 
                  href="#" 
                  className="bg-primary/10 text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Projects
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Documentation
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-xs">
              Free Plan
            </Badge>
            <Button size="sm" className="gradient-primary text-primary-foreground">
              Upgrade
            </Button>
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

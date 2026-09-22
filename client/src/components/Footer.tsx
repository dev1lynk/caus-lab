import { ChartGantt } from "lucide-react";
import linkedinIcon from "@assets/linkedin-svgrepo-com_1790100277221.svg";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChartGantt className="text-primary text-xl mr-2" />
            <span className="font-semibold text-foreground">CAUS Lab</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
            <a
              href="https://www.linkedin.com/company/causlab/"
              target="_blank"
              rel="noreferrer"
              aria-label="CAUS Lab on LinkedIn"
              className="hover:text-foreground transition-colors"
            >
              <img src={linkedinIcon} alt="" className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

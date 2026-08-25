import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import WorkflowPage from "@/pages/WorkflowPage";
import STMDemo from "@/pages/STMDemo";
import Terminology from "@/pages/Terminology";
import CausalFoundationModel from "@/pages/CausalFoundationModel";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/workflow" component={WorkflowPage} />
      <Route path="/stm-demo" component={STMDemo} />
      <Route path="/terminology" component={Terminology} />
      <Route path="/causal-foundation-model" component={CausalFoundationModel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

"use client";

import { getTemplates } from "@/api/client/templates";
import { TemplateList } from "@/components/features/template-page/template-list-view";
import { TemplateGridView } from "@/components/features/template-page/template-grid-view";
import { TemplateLoader } from "@/components/features/template-page/loader";
import { Template } from "@/types/templates";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Button,
} from "@/components/shared";
import { LayoutGrid, List, Search, Plus, HelpCircle } from "lucide-react";
import Link from "next/link";
import { TemplateTour } from "@/components/features/tour-guide/template-tour";

export default function TemplatesPage() {
  const templates = useQuery({
    queryKey: ["template"],
    queryFn: getTemplates,
  });

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("grid");
  const [isTourRunning, setIsTourRunning] = useState(false);

  useEffect(() => {
    // Check if the user has seen the tour
    const hasSeenTour = localStorage.getItem("hasSeenTemplatesTour") === "true";
    if (!hasSeenTour && templates.data && templates.data.length > 0) {
      // Only show the tour automatically if there's data to display
      setIsTourRunning(true);
    }
  }, [templates.data]);

  const startTour = () => {
    setIsTourRunning(true);
  };

  const filteredTemplates = (templates.data || []).filter(
    (template: Template) => {
      const searchMatch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    }
  );

  if (templates.isLoading) {
    return <TemplateLoader />;
  }

  if (templates.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error loading templates</div>
      </div>
    );
  }

  return (
    <div id="content">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Template Library</div>
        <Link
          href="/v1/templates/create"
          id="new-template"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Create Template
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <div className="text-sm text-muted-foreground">
        Your personal library of ready-to-use templates — built once, used
        anytime. Streamline your workflow with ease.
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-4">
        <div className="relative flex-1 max-w-md w-full">
          <Input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          <span className="absolute left-2 top-2.5 text-muted-foreground pointer-events-none">
            <Search className="h-4 w-4 ml-1" />
          </span>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-5 w-5" strokeWidth={1.5} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsContent value="grid">
          <TemplateGridView templates={filteredTemplates} />
        </TabsContent>
        <TabsContent value="list">
          <TemplateList templates={filteredTemplates} />
        </TabsContent>
      </Tabs>

      {/* Tour guide component */}
      <TemplateTour isRunning={isTourRunning} setIsRunning={setIsTourRunning} />

      {/* Floating help button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={startTour}
          variant="secondary"
          className="rounded-full w-12 h-12 shadow-lg bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:text-gray-200"
          aria-label="Start tour guide"
        >
          <HelpCircle size={24} />
        </Button>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/multiplex/AppShell";
import { useChatWorkspace } from "@/components/multiplex/ChatWorkspace";

export const Route = createFileRoute("/conversas")({
  head: () => ({
    meta: [
      { title: "HUG" },
      {
        name: "description",
        content: "HUG",
      },
      { property: "og:title", content: "HUG" },
      {
        property: "og:description",
        content: "HUG",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConversasPage,
});

function ConversasPage() {
  const { list, chat } = useChatWorkspace();
  return <AppShell secondary={list}>{chat}</AppShell>;
}

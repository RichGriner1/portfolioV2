import { ProjectsList } from "@/app/projects/projects-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Projects",
  description:
    "Design systems, brand identities, and products shipped for banks, startups, and my own experiments.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <ProjectsList />
      <SiteFooter />
    </>
  );
}

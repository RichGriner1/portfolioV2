import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { WritingList } from "./writing-list";

export const metadata = {
  title: "Writing",
  description: "Process notes and methodology: how the work gets made.",
};

export default function WritingPage() {
  return (
    <>
      <SiteHeader />
      <WritingList />
      <SiteFooter />
    </>
  );
}

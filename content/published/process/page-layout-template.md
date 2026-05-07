---
title: "One Template to Rule Every Page"
pillar: process
status: published
created: 2026-04-30
tags: [design-systems, primeng, angular, ai-tools, wealth-manager]
---

# One Template to Rule Every Page

Why consistency matters more than flexibility, and how a single page layout template replaced three copies of the same header.

## The problem with copy-paste layouts

Three pages, three copies of the same hero header. Same eyebrow, same title size, same subtitle color — but each one defined its own CSS. Change the title font weight in one place and the other two stay behind. That's how inconsistency creeps in: not through bad decisions, but through duplication.

And it gets worse as the product grows. Every new page means another copy. Tabs? Actions? Section dividers? Each page reinvents them. The user notices — not consciously, but in the way things feel slightly off from screen to screen.

## Consistency is the product

Users don't read your design system docs. They learn your product by using it. Every page teaches them where to look for the title, where actions live, how sections separate. When that's consistent, the product feels simple — even when it's complex. When it drifts, cognitive load goes up and trust goes down.

A page template isn't about saving developer time (though it does). It's about making a promise to the user: this product works the same way everywhere. The title is always here. Actions are always there. Sections always separate the same way.

## The template anatomy

Two components do the work. PageLayout wraps the page and exposes named slots gated by booleans. PageSection handles repeatable blocks of content, with a PrimeNG Divider above every section after the first.

_Each labeled box is a zone in the template. Booleans toggle them on or off; ng-content slots accept whatever you put in._

- Meta zone — breadcrumbs, tags, dates. Toggled with showMeta.
- Eyebrow — small uppercase label above the title. Defaults to "AWM Design Showcase."
- Title row — the h1 and optional action buttons, side by side.
- Subtitle — description paragraph below the title.
- Tab bar — optional tabs with their own action area. Toggled with showTabs.
- Body — the main content area. Can be constrained to reading width with narrow.

## Try it

Flip the toggles to see the layout reshape live. Everything below is a real awm-page-layout instance — same component every other page in the app uses.

_Live awm-page-layout. The toggles set the same boolean inputs you would use in code._

## Why booleans, not variants

We considered separate components — a PageHeader, a TabBar, a SectionHeader. But that fragments the layout contract. A single component with boolean toggles means every page declares its shape in one place: "I have a meta area, I have tabs, I'm narrow." You read the template and know the page structure instantly.

Content projection (ng-content slots) keeps it flexible without making the template care what goes in each zone. The tabs slot doesn't know if you're using router tabs or inline panels. The actions slot doesn't know if you have one button or five. The template just guarantees where things go.

## PrimeNG does the heavy lifting

Section dividers use PrimeNG's Divider component instead of a CSS border-bottom. It respects the theme, handles dark mode, and follows the rule: if PrimeNG ships it, use it. The tabs zone accepts PrimeNG Tabs in tabmenu mode for router navigation. No custom tab implementation needed.

We skipped p-toolbar for action rows. It adds a visible container with background and border — too much visual weight for a clean header. Simple flex rows achieve the same layout without the noise.

## What changed in each page

New Releases: deleted 35 lines of hero CSS. The card grid drops into the default content slot. No booleans needed — all defaults.

Changelog: same 35-line reduction. The accordion sits in the content slot.

Case Study: the biggest win. Breadcrumb and status tag move to the meta slot. Each section becomes an awm-page-section with automatic dividers. The 70ch reading width constraint moves from the component's :host into the template's narrow input. One line instead of a custom style block.

## What this enables next

When the Propuestas flow lands, it ships with tabs (Overview, Details, History) and page-level actions (Export, Share) without inventing a new layout. Data pages get section headings with filter buttons. Every new page starts consistent by default — you have to opt out of structure, not opt in.

The template is the promise. Same place for the title. Same place for actions. Same section rhythm. The user never has to relearn the product.

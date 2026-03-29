import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/portfolio";
import { artifactDocs } from "@/content/artifacts";
import { PublicPageShell } from "@/components/portfolio/public-page-shell";
import { ArtifactVisuals } from "@/components/portfolio/graphics/artifact-visuals";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return { title: "Artifact Not Found" };

  return {
    title: `${project.title} - Michael Panico`,
    description: project.oneLiner,
  };
}

export default async function ProjectArtifactPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) return notFound();

  // Look for artifact content in the local filesystem
  let markdownContent = "### Artifact Documentation Pending\n\nThe sanitized documentation and technical artifacts for this project are currently being migrated into the portfolio. Please check back shortly.";
  
  try {
    if (project.sourceMaterialFolder && artifactDocs[project.sourceMaterialFolder]) {
      markdownContent = artifactDocs[project.sourceMaterialFolder];
    }
  } catch (err) {
    console.warn(`Could not load artifact markdown for ${slug}`, err);
  }

  const Icon = project.icon;

  return (
    <PublicPageShell showHeader={true}>
      <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-24 sm:px-6 md:py-32">
        <div className="mb-10">
          <Button asChild variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project Library
            </Link>
          </Button>

          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <Icon className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                {project.status}
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Sanitized
              </Badge>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-400">
                {project.meta}
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {project.title}
              </h1>
            </div>

            <p className="text-xl leading-relaxed text-zinc-300">
              {project.oneLiner}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {project.tools.map((tool) => (
                <span key={tool} className="rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm text-zinc-400">
                  {tool}
                </span>
              ))}
            </div>
          </header>
        </div>

        <article className="prose prose-invert prose-cyan max-w-none rounded-3xl border border-white/10 bg-black/25 p-6 shadow-[0_0_80px_rgba(34,211,238,0.03)] backdrop-blur-xl sm:p-10 lg:prose-lg">
          {markdownContent.length > 200 ? null : (
            <div className="mb-10 rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-zinc-400">
              <p>The raw artifacts for {project.title} (.sql, .pbix, .pdf) are located in the repository's source materials.</p>
              <p className="mt-2 text-cyan-200">They are currently being converted to Markdown documentation for web rendering.</p>
            </div>
          )}
          
          <ArtifactVisuals projectid={project.id} />

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => <h1 className="border-b border-white/10 pb-4 text-3xl font-bold" {...props} />,
              h2: ({ node, ...props }) => <h2 className="mt-12 text-2xl font-semibold text-cyan-50" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-cyan-100" {...props} />,
              a: ({ node, ...props }) => <a className="font-medium text-cyan-400 underline decoration-cyan-400/30 underline-offset-4 hover:decoration-cyan-400" {...props} />,
              pre: ({ node, ...props }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 shadow-inner" {...props} />,
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>
      </main>
    </PublicPageShell>
  );
}

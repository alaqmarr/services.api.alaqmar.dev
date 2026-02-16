
import { prisma } from '@/lib/prisma';
import CreateProjectForm from './create-project-form';
import { deleteProject } from '@/lib/actions';
import { Metadata } from 'next';
import PageHeader from '@/app/ui/page-header';

export const metadata: Metadata = {
    title: 'Showcase Management | Alaqmar',
};

export default async function ShowcasePage() {
    const projects = await prisma.showcase.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="w-full space-y-8">
            <PageHeader
                title="Showcase"
                description="Manage your portfolio projects and case studies."
                icon="✦"
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Projects Grid */}
                <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
                    {projects.map((project) => (
                        <div key={project.id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card-bg border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">

                            {/* Image Area */}
                            <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                                {project.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-secondary/20">
                                        <span className="text-4xl">🖼️</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent opacity-80" />

                                {project.isFeatured && (
                                    <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md border border-primary/20">
                                        ★ Featured
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow p-6 pt-2">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-secondary line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] font-medium text-secondary border border-secondary/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t border-card-border pt-4 mt-auto">
                                    <div className="flex gap-3">
                                        {project.siteUrl && (
                                            <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline hover:text-primary/80 flex items-center gap-1">
                                                Live Demo ↗
                                            </a>
                                        )}
                                        {project.repoUrl && (
                                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-secondary hover:text-foreground flex items-center gap-1">
                                                Code ↗
                                            </a>
                                        )}
                                    </div>
                                    <form action={async () => { 'use server'; await deleteProject(project.id); }}>
                                        <button className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-card-bg border border-dashed border-card-border">
                            <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-3xl">🚀</div>
                            <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
                            <p className="text-secondary text-sm max-w-xs mt-2">Add your first project using the form on the right.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Form */}
                <div className="xl:col-span-1">
                    <div className="sticky top-6">
                        <CreateProjectForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

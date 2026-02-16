
import { prisma } from '@/lib/prisma';
import CreateProjectForm from './create-project-form';
import { deleteProject } from '@/lib/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Showcase Management | Alaqmar',
};

export default async function ShowcasePage() {
    const projects = await prisma.showcase.findMany({
        orderBy: { createdAt: 'desc' }, // sortOrder likely removed, fallback to createdAt
    });

    return (
        <div className="w-full space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Showcase</h1>
                <p className="text-sm text-secondary mt-1">Manage your portfolio projects.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="rounded-2xl bg-card-bg border border-card-border p-5 flex flex-col sm:flex-row gap-5 group hover:border-primary/30 transition-all">
                            <div className="w-full sm:w-28 h-28 rounded-xl bg-background overflow-hidden flex-shrink-0">
                                {project.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-secondary/20 text-3xl">📷</div>
                                )}
                            </div>
                            <div className="flex-grow flex flex-col justify-between min-w-0">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-foreground truncate">{project.title}</h3>
                                        </div>
                                        <div className="flex gap-1.5 flex-shrink-0">
                                            {project.isFeatured && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">★ Featured</span>
                                            )}
                                            {project.siteUrl && (
                                                <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded hover:bg-primary/20">Live ↗</a>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-secondary mt-1.5 line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="text-[10px] font-medium text-secondary/70 bg-secondary/5 px-2 py-0.5 rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-3 pt-3 border-t border-card-border">
                                    <form action={async () => { 'use server'; await deleteProject(project.id); }}>
                                        <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center py-12 text-sm text-secondary bg-card-bg rounded-2xl border border-dashed border-card-border">
                            No projects yet. Add one from the form.
                        </div>
                    )}
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-6"><CreateProjectForm /></div>
                </div>
            </div>
        </div>
    );
}

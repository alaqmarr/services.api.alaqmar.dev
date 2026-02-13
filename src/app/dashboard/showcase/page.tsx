import { prisma } from '@/lib/prisma';
import CreateProjectForm from './create-project-form';
import { deleteProject } from '@/lib/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Showcase Management | Alaqmar',
};

export default async function ShowcasePage() {
    const projects = await prisma.showcase.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="w-full space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Showcase Portfolio</h1>
            <p className="text-secondary max-w-2xl">Manage the projects displayed on your portfolio website.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-card-bg rounded-3xl p-6 border border-card-border shadow-sm flex flex-col md:flex-row gap-6 group hover:border-primary/30 transition-all duration-200">
                                {/* Image Preview */}
                                <div className="w-full md:w-32 h-32 rounded-2xl bg-secondary/10 overflow-hidden flex-shrink-0">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-secondary/30 text-2xl">📷</div>
                                    )}
                                </div>

                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                                            <div className="flex gap-2">
                                                {project.siteUrl && (
                                                    <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20">Live ↗</a>
                                                )}
                                                {project.repoUrl && (
                                                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded hover:bg-secondary/20">Code ↗</a>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-secondary text-sm mt-2 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] uppercase font-bold tracking-wider text-secondary/70 bg-secondary/5 px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4 pt-4 border-t border-card-border">
                                        <form action={async () => {
                                            'use server';
                                            await deleteProject(project.id);
                                        }}>
                                            <button className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                                Delete Project
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center py-12 text-secondary bg-card-bg rounded-3xl border border-dashed border-card-border">
                                No projects in showcase yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <CreateProjectForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

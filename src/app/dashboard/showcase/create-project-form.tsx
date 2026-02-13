'use client';

import { createProject, State } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreateProjectForm() {
    const initialState: State = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(createProject, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Project created!");
            const form = document.getElementById('create-project-form') as HTMLFormElement;
            if (form) form.reset();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form id="create-project-form" action={dispatch} className="bg-card-bg rounded-2xl p-6 border border-card-border space-y-4">
            <div>
                <h2 className="text-sm font-bold text-foreground">Add Project</h2>
                <p className="text-xs text-secondary mt-0.5">Showcase a new project.</p>
            </div>

            <div className="space-y-3">
                <div>
                    <label htmlFor="title" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Title</label>
                    <input id="title" name="title" type="text" placeholder="Project Name" required
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div>
                    <label htmlFor="description" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Description</label>
                    <textarea id="description" name="description" rows={2} placeholder="Brief description..." required
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                <div>
                    <label htmlFor="longDescription" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Long Description</label>
                    <textarea id="longDescription" name="longDescription" rows={3} placeholder="Detailed description (optional)..."
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                <div>
                    <label htmlFor="image" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Image URL</label>
                    <input id="image" name="image" type="text" placeholder="https://example.com/image.png"
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="liveUrl" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Live URL</label>
                        <input id="liveUrl" name="liveUrl" type="text" placeholder="https://..."
                            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label htmlFor="repoUrl" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Repo URL</label>
                        <input id="repoUrl" name="repoUrl" type="text" placeholder="https://github.com/..."
                            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                </div>

                <div>
                    <label htmlFor="tags" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Tags (comma separated)</label>
                    <input id="tags" name="tags" type="text" placeholder="React, Next.js, TypeScript"
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-card-border/50">
                    <input id="isFeatured" name="isFeatured" type="checkbox" className="h-4 w-4 rounded border-card-border text-primary focus:ring-primary/20" />
                    <label htmlFor="isFeatured" className="text-sm text-foreground cursor-pointer select-none">Featured project</label>
                </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-[0.98]">
                Create Project
            </button>
        </form>
    );
}

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
        <form id="create-project-form" action={dispatch} className="bg-card-bg rounded-3xl p-8 border border-card-border shadow-sm space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground">Add Project</h2>
                <p className="text-sm text-secondary">Showcase a new project on your portfolio.</p>
            </div>

            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Project Name"
                        className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Brief description of the project..."
                        className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                        required
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="imageUrl" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                        Image URL
                    </label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="text"
                        placeholder="https://example.com/image.png"
                        className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Site URL */}
                    <div>
                        <label htmlFor="siteUrl" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                            Live URL
                        </label>
                        <input
                            id="siteUrl"
                            name="siteUrl"
                            type="text"
                            placeholder="https://mysite.com"
                            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                        />
                    </div>

                    {/* Repo URL */}
                    <div>
                        <label htmlFor="repoUrl" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                            Repo URL
                        </label>
                        <input
                            id="repoUrl"
                            name="repoUrl"
                            type="text"
                            placeholder="https://github.com/..."
                            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                        Tags (Comma separated)
                    </label>
                    <input
                        id="tags"
                        name="tags"
                        type="text"
                        placeholder="React, Next.js, TypeScript"
                        className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98]"
            >
                Create Project
            </button>
        </form>
    );
}

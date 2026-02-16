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
        <form id="create-project-form" action={dispatch} className="bg-card-bg rounded-3xl p-6 border border-card-border shadow-lg space-y-5 sticky top-6">
            <div className="flex items-center gap-3 mb-2 border-b border-card-border pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    <span>＋</span>
                </div>
                <div>
                    <h2 className="text-base font-bold text-foreground">Add New Project</h2>
                    <p className="text-xs text-secondary mt-0.5">Showcase a new portfolio item.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Title</label>
                    <input id="title" name="title" type="text" placeholder="Project Name" required
                        className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                </div>

                <div>
                    <label htmlFor="description" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Short Description</label>
                    <textarea id="description" name="description" rows={2} placeholder="Brief summary for the card..." required
                        className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner resize-none" />
                </div>

                <div>
                    <label htmlFor="longDescription" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Long Description <span className="text-secondary/40 font-normal normal-case">(Optional)</span></label>
                    <textarea id="longDescription" name="longDescription" rows={3} placeholder="Detailed case study content..."
                        className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner resize-none" />
                </div>

                <div>
                    <label htmlFor="image" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Cover Image URL</label>
                    <div className="relative">
                        <input id="image" name="image" type="text" placeholder="https://..."
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 pl-9 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                        <span className="absolute left-3 top-2.5 text-secondary/50 text-xs">🔗</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="liveUrl" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Live URL</label>
                        <input id="liveUrl" name="liveUrl" type="text" placeholder="https://..."
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                    </div>
                    <div>
                        <label htmlFor="repoUrl" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Repo URL</label>
                        <input id="repoUrl" name="repoUrl" type="text" placeholder="https://..."
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                    </div>
                </div>

                <div>
                    <label htmlFor="tags" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Tags</label>
                    <input id="tags" name="tags" type="text" placeholder="React, Next.js, Design..."
                        className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                </div>

                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-card-border/50 cursor-pointer hover:border-primary/30 transition-colors">
                    <input id="isFeatured" name="isFeatured" type="checkbox" className="h-4 w-4 rounded border-card-border text-primary focus:ring-primary/20 bg-card-bg" />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-foreground cursor-pointer select-none">Mark as Featured</label>
                </div>
            </div>

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-sm font-bold text-[#1c1917] hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                🚀 Launch Project
            </button>
        </form>
    );
}

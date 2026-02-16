import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string | ReactNode;
    icon?: ReactNode;
    actions?: ReactNode;
}

export default function PageHeader({ title, description, icon, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-card-border pb-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    {icon && <span className="text-secondary opacity-80">{icon}</span>}
                    {title}
                </h1>
                {description && (
                    <div className="text-sm text-secondary mt-1 max-w-2xl leading-relaxed opacity-80">
                        {description}
                    </div>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}

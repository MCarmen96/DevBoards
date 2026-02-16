'use client';

import { Breadcrumb } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  currentPage?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, currentPage, children }: PageHeaderProps) {
  return (
    <div className="mb-3 mb-md-4">
      <Breadcrumb currentPage={currentPage || title} />
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h1 className="h4 h3-md fw-bold text-body mb-0">{title}</h1>
          {description && (
            <p className="text-secondary mt-2 mb-0 small">{description}</p>
          )}
        </div>
        {children && (
          <div className="d-flex align-items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

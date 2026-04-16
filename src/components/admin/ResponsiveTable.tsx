import React from "react";

interface ResponsiveTableProps {
  headers: string[];
  children: React.ReactNode;
}

/**
 * Responsive table wrapper for mobile-friendly data display
 * Automatically adds horizontal scroll on mobile devices
 */
export const ResponsiveTable = ({
  headers,
  children,
}: ResponsiveTableProps) => {
  return (
    <div className="w-full overflow-x-auto -mx-4 md:mx-0 md:rounded-lg md:shadow">
      <table className="w-full min-w-max md:min-w-0">{children}</table>
    </div>
  );
};

/**
 * Responsive table header
 */
export const ResponsiveTableHead = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <thead className="bg-gray-50 border-b">{children}</thead>;
};

/**
 * Responsive table header cell
 */
export const ResponsiveTableHeadCell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">
      {children}
    </th>
  );
};

/**
 * Responsive table body
 */
export const ResponsiveTableBody = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <tbody className="divide-y">{children}</tbody>;
};

/**
 * Responsive table row
 */
export const ResponsiveTableRow = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <tr className="hover:bg-gray-50">{children}</tr>;
};

/**
 * Responsive table cell
 */
export const ResponsiveTableCell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
      {children}
    </td>
  );
};

/**
 * Responsive action buttons container
 */
export const ResponsiveActions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-wrap gap-1 md:gap-2">{children}</div>;
};

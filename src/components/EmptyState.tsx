interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No data available.",
}: EmptyStateProps) {
  return (
    <div className="text-center text-gray-500 py-16">
      <p className="text-lg">{message}</p>
    </div>
  );
}

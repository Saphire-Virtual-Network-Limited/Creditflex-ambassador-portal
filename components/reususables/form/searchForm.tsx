import { Search } from "lucide-react";

export const SearchForm = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-sm"
    >
      <input
        type="text"
        placeholder="Search User"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-10 py-2 border border-borderGray rounded-md focus:outline-none focus:ring-blue-500"
      />
      <button
        type="submit"
        className="absolute right-3 top-2.5"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-400" />
      </button>
    </form>
  );
};

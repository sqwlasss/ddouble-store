import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="px-6 md:px-10 lg:px-16 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-[11px]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#6B6B67]">/</span>}
            {item.href ? (
              <Link to={item.href} className="text-[#6B6B67] hover:text-[#1A1A1A] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#1A1A1A]" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

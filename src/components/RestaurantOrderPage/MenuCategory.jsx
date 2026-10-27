function MenuCategory({ category, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-bold text-white">{category.name}</h3>

        {category.description && (
          <p className="mt-1 text-sm text-slate-400">{category.description}</p>
        )}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export default MenuCategory;

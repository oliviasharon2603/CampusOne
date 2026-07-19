const stats = [
  { id: 1, name: 'Departments', value: '9+' },
  { id: 2, name: 'Students', value: '500+' },
  { id: 3, name: 'Faculty', value: '150+' },
  { id: 4, name: 'Books', value: '10k+' },
];

const StatsSection = () => {
  return (
    <section className="bg-indigo-900 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-900/50 mix-blend-multiply"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-indigo-200 uppercase tracking-wide">
                {stat.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

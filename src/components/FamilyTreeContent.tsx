return (
  <div className="flex flex-row items-start p-2 gap-2">
    <div className="flex flex-col items-start p-6 gap-6 bg-white border border-[#DEE0E3] shadow-[0px_1px_2px_rgba(20,21,26,0.05)] rounded-[10px]">
      <div className="flex flex-col items-start p-0 gap-4">
        {/* ... header content ... */}
      </div>

      <div 
        className={`bg-[#F7F7F8] border border-[#DEE0E3] rounded-xl overflow-auto ${
          isStructureView ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]' : ''
        }`}
      >
        {isStructureView ? (
          <div>
            <section className="relative">
              {/* ... section content ... */}
            </section>
          </div>
        ) : (
          <div>
            {children}
          </div>
        )}
      </div>

      {/* ... bottom controls ... */}
    </div>
  </div>
); 
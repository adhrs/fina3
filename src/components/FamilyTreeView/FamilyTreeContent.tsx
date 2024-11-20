import React, { ReactNode, useState } from 'react';

interface FamilyTreeContentProps {
  children: ReactNode;
}

export const FamilyTreeContent: React.FC<FamilyTreeContentProps> = ({ children }) => {
  const [isStructureView, setIsStructureView] = useState(false);

  return (
    <div className="flex flex-row items-start p-2 gap-2 w-full h-full">
      <div className="flex flex-col items-start p-6 gap-6 w-full h-full bg-white border border-[#DEE0E3] shadow-[0px_1px_2px_rgba(20,21,26,0.05)] rounded-[10px]">
        <div className="flex flex-col items-start p-0 gap-4 w-full">
          <div className="flex flex-row items-start p-0 gap-3 w-full">
            <div className="flex flex-col items-start p-0 gap-2 flex-grow">
              <h1 className="text-2xl font-semibold leading-8 tracking-[-0.3px] text-[#14151A]">
                Family Tree & Structure
              </h1>
            </div>
            
            <div className="flex flex-row items-start p-0 gap-2">
              <button className="flex flex-row justify-center items-center py-2.5 px-3 gap-1 bg-[rgba(10,15,41,0.04)] rounded-xl">
                <span className="text-sm font-medium text-[#14151A]">Export</span>
              </button>
              <button className="flex flex-row justify-center items-center py-2.5 px-3 gap-1 bg-[#4778F5] shadow-[0px_1px_2px_rgba(20,21,26,0.05)] rounded-xl">
                <span className="text-sm font-medium text-white">Add</span>
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center p-0 gap-4 w-full overflow-x-auto">
            <div className="flex flex-row items-start p-0 gap-6 w-[211px] h-8 shadow-[0px_1px_2px_rgba(20,21,26,0.05)] flex-none order-1 flex-grow-0">
              <div className="flex flex-col justify-center items-center p-0 w-[99px] h-8 flex-none order-1 flex-grow-0">
                <div className="flex flex-row justify-center items-center py-[5px] px-0 pb-[7px] gap-2 w-[99px] h-8 border-b-2 border-[#924FE8] flex-none order-0 flex-grow-0">
                  <div className="flex flex-row items-start p-[1px] w-[18px] h-[18px] flex-none order-0 flex-grow-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12V10.6667H7.33333V12H2ZM2 8.66667V7.33333H10.6667V8.66667H2ZM2 5.33333V4H14V5.33333H2Z" fill="rgba(15,19,36,0.6)"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#14151A] text-center tracking-[-0.1px]">Structure</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center p-0 w-[88px] h-8 flex-none order-5 flex-grow-0">
                <div className="flex flex-row justify-center items-center py-[5px] px-0 pb-[7px] gap-2 w-[88px] h-8 flex-none order-0 flex-grow-0">
                  <div className="flex flex-row items-start p-[1px] w-[18px] h-[18px] flex-none order-0 flex-grow-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.33334 14V2L14.6667 8L1.33334 14Z" fill="rgba(15,19,36,0.6)"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[rgba(15,19,36,0.6)] text-center tracking-[-0.1px]">Preview</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center p-0 gap-2 w-[781px] h-8 flex-none order-1 flex-grow-0">
              {['Location', 'Currency', 'Label', 'Notes', 'Liability', 'Generation'].map((filter) => (
                <button 
                  key={filter}
                  className="flex flex-row justify-center items-center py-1.5 px-2.5 gap-1 h-8 bg-white border border-[#DEE0E3] shadow-[0px_1px_2px_rgba(20,21,26,0.05)] rounded-[10px] text-sm font-medium text-[#14151A]"
                >
                  {filter}
                </button>
              ))}
              <button className="flex items-center justify-center px-2.5 py-1.5 gap-1 h-8 bg-white border border-[#DEE0E3] shadow-[0px_1px_2px_rgba(20,21,26,0.05)] rounded-[10px]">
                <span className="text-sm font-medium text-[#14151A]">Reset filters</span>
              </button>
              <button className="flex items-center justify-center px-2.5 py-1.5 gap-1 h-8 bg-white border border-[#DEE0E3] shadow-[0px_1px_2px_rgba(20,21,26,0.05)] rounded-[10px]">
                <span className="text-sm font-medium text-[#14151A]">Add filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-[#F7F7F8] border border-[#DEE0E3] rounded-xl overflow-auto">
        {isStructureView ? (
  <div className="flex flex-col h-full p-4 gap-1">
    <section className="flex-1 relative border border-[#DEE0E3] rounded-xl bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="absolute left-4 top-4 px-2 py-1 bg-[#E8F5FF] text-[#14151A] text-xs font-medium rounded-md">
        Family Tree
      </div>
      {children}
    </section>

    <section className="flex-1 relative border border-[#DEE0E3] rounded-xl bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="absolute left-4 top-4 px-2 py-1 bg-[#E8F5FF] text-[#14151A] text-xs font-medium rounded-md">
        Structure
      </div>
    </section>
  </div>
) : (
  <div className="h-full">
    {children}
  </div>
)}
        </div>

        <div className="fixed left-1/2 -translate-x-1/2 bottom-[52px] flex flex-row items-center px-2 py-0.5 pl-3 gap-3 w-full max-w-[379px] h-10 bg-white shadow-lg rounded-full">
          <span className="text-xs font-bold text-[rgba(15,19,36,0.6)]">Add</span>
          
          <div className="flex flex-row items-center gap-0.5">
            <button className="flex items-center justify-center gap-1 px-4 py-2 bg-[#F7F7F8] rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.33334 15V13.3333H9.16667V15H3.33334ZM3.33334 10.8333V9.16667H13.3333V10.8333H3.33334ZM3.33334 6.66667V5H17.5V6.66667H3.33334Z" fill="#14151A"/>
              </svg>
              <span className="text-xs font-semibold text-[#14151A]">Family</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.82001 4.1L6.00001 7.28L9.18001 4.1L10 4.92L6.00001 8.92L2.00001 4.92L2.82001 4.1Z" fill="#14151A"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-row items-center gap-0.5">
            <button className="flex items-center justify-center gap-1 px-4 py-2 bg-[#F7F7F8] rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 15V5L10 2L18 5V15H2Z" fill="#14151A"/>
              </svg>
              <span className="text-xs font-semibold text-[#14151A]">Company</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.82001 4.1L6.00001 7.28L9.18001 4.1L10 4.92L6.00001 8.92L2.00001 4.92L2.82001 4.1Z" fill="#14151A"/>
              </svg>
            </button>
          </div>

          <div className="w-px h-6 bg-[#E9EAEC]" />

          <button 
            onClick={() => setIsStructureView(!isStructureView)}
            className="flex items-center p-0.5 w-[74px] h-9 rounded-full"
          >
            <div className={`flex items-center p-0.5 w-[60px] h-8 ${isStructureView ? 'bg-[#26BD6C]' : 'bg-[#BABDC5]'} rounded-full transition-colors duration-200`}>
              <div className={`flex items-center justify-center p-1 w-7 h-7 bg-white rounded-full transform transition-transform duration-200 ${isStructureView ? 'translate-x-[28px]' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 15V13.3333H9.16667V15H2ZM2 10.8333V9.16667H13.3333V10.8333H2ZM2 6.66667V5H17.5V6.66667H2Z" fill="#14151A"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}; 
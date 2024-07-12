const PokemonDetailsLoader = () => {
  return (
    <div className="bg-secondary w-full h-screen m-auto">
      <main className='h-screen overflow-y-scroll hide-scrollbar p-8 max-w-2xl w-full bg-primary p-4 relative m-auto'>
        <div className="flex md:hidden flex-col justify-center relative h-64 gap-5">
          <div className=' w-full flex flex-col justify-between '>
            <div className='flex justify-between mt-10'>
              <div className=''>
                <div className='animate-pulse bg-slate-400 h-8 w-48 mb-2'></div>
                <div className='animate-pulse bg-slate-400 h-6 w-32'></div>
              </div>
              <div className='animate-pulse bg-slate-400 rounded-full h-6 w-6'></div>
            </div>
          </div>
          <div className='w-full h-full flex h-56 items-center justify-between gap-5'>
            <div className="animate-pulse bg-slate-400 h-56 w-48"></div>
            <div className="flex flex-col w-3/5 h-full">
              <div className='animate-pulse bg-slate-400 h-5 w-80 mb-3'></div>
              <div className='animate-pulse bg-slate-400 h-4 w-64'></div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center justify-between relative h-64 gap-3">
          <div className='w-1/3 flex justify-between '>
            <div className='animate-pulse bg-slate-400 h-64 w-44'></div>
          </div>
          <div className='w-2/3 flex flex-col h-full'>
            <div className='flex items-center justify-between mt-1 mb-9'>
              <div className=' w-2/3 flex items-center justify-between'>
                <div className='animate-pulse bg-slate-400 h-8 w-40 pr-5'></div>
                <div className='animate-pulse bg-slate-400 h-8 w-24  pr-5'></div>
              </div>
              <div className='flex h-full items-center justify-center gap-2'>
                <div className='animate-pulse bg-slate-400 rounded-full h-8 w-6'></div>
                <div className='animate-pulse bg-slate-400 rounded-full h-8 w-6'></div>
                <div className='animate-pulse bg-slate-400 rounded-full h-8 w-6'></div>
              </div>
            </div>
            <div className='animate-pulse bg-slate-400 h-40 w-full mb-4'></div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 md:my-5">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4 truncate">
              <div className='animate-pulse bg-slate-400 h-4 w-16 mb-2'></div>
              <div className='animate-pulse bg-slate-400 h-4 w-24'></div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap my-5">
          <div className="w-1/2 lg:w-1/4 p-4">
            <div className='animate-pulse bg-slate-400 h-4 w-24 mb-1'></div>
            <div className='animate-pulse bg-slate-400 h-4 w-32'></div>
          </div>
          <div className="w-1/2 lg:w-1/4 p-4">
            <div className='animate-pulse bg-slate-400 h-4 w-16 mb-1'></div>
            <div className='animate-pulse bg-slate-400 h-4 w-28'></div>
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <div className='animate-pulse bg-slate-400 h-4 w-36 mb-1'></div>
            <div className='animate-pulse bg-slate-400 h-4 w-40'></div>
          </div>
        </div>

        <div className='bg-slate-400 md:w-full flex flex-col justify-center p-5 rounded-lg my-5'>
          <div className='animate-pulse bg-slate-400 h-8 w-20 mb-3'></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2 mt-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="w-full flex items-center justify-between">
                <div className='animate-pulse bg-slate-400 h-4 w-24'></div>
                <div className="w-3/4 h-3 ">
                  <div className="animate-pulse  h-3 text-white flex items-center text-[11px] pb-0.5 font-normal pl-1 w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col relative my-5">
          <div className='animate-pulse bg-slate-400 h-8 w-32 mb-3'></div>
          <div className='w-full max-w-md mx-auto md:hidden  gap-2 flex h-full items-center justify-between'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-slate-400 h-36 w-28"></div>
            ))}
          </div>
          <div className='w-full hidden md:flex h-full items-center justify-between'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-slate-400 h-48 w-36"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};


export default PokemonDetailsLoader

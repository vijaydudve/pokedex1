const PokemonListLoader = () => {
    return (
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 py-10">
            {
                [...Array(20)].map((_, index) => (
                    <article key={`pokemon-loader-${index}`} className="relative h-60 w-40 animate-pulse rounded-lg 
                    overflow-hidden flex flex-col p-3 gap-3 items-center">
                        <div className="aspect-square h-5/6 bg-slate-400 w-full overflow-hidden rounded-lg"></div>
                        <p className="h-5 w-full bg-slate-400 rounded-lg"></p>
                        <p className="h-5 w-full bg-slate-400 rounded-lg"></p>
                    </article>
                ))
            }
        </div>
    )
}

export default PokemonListLoader;
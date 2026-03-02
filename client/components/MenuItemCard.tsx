import React from 'react';

export interface MenuItemCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    name: string;
    image: string;
    price: number | string;
    description?: string;
}

export function MenuItemCard({
    name,
    image,
    price,
    description,
    className = '',
    ...props
}: MenuItemCardProps) {
    // Use a reliable currency formatter if price is a number
    const formattedPrice =
        typeof price === 'number'
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
            : price;

    return (
        <button
            type="button"
            className={`
        group relative w-full max-w-sm overflow-hidden text-left
        rounded-[2rem] bg-neutral-900 text-neutral-50
        transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]
        focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
        touch-manipulation tap-highlight-transparent
        ${className}
      `}
            aria-label={`${name}, ${formattedPrice}`}
            {...props}
        >
            {/* Visual background noise texture for tactile aesthetic */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
            />

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-800">
                {/* 
          Using standard img tag to prevent Next.js domain config requirements 
          for unknown image sources, allowing seamless portability. 
        */}
                <img
                    src={image}
                    alt="" // Decorative, true accessible label is on the button itself
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110"
                />
                {/* Soft shadow overlay connecting the image seamlessly into the card body */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Main Content Area overlapping the image */}
            <div className="relative z-10 -mt-16 flex flex-col gap-2 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                    <h3 className="font-serif text-2xl font-medium leading-[1.15] tracking-tight text-white sm:text-3xl">
                        {name}
                    </h3>
                    <div className="shrink-0 rounded-full bg-white px-4 py-2 transition-transform duration-500 group-hover:scale-105 group-hover:bg-emerald-400 group-hover:text-emerald-950">
                        <span className="font-mono text-base font-bold tracking-tight text-neutral-900 inherit text-inherit">
                            {formattedPrice}
                        </span>
                    </div>
                </div>

                {description ? (
                    <p className="mt-3 max-w-[90%] font-sans text-sm leading-relaxed text-neutral-400">
                        {description}
                    </p>
                ) : null}
            </div>

            {/* Subtle interaction indicator */}
            <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-emerald-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </button>
    );
}

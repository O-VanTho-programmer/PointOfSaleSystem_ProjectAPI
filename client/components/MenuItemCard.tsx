import React from 'react';
import { MenuItemDTO } from '../types/MenuItemDTO';

interface Props {
    item: MenuItemDTO;
    onClick: (item: MenuItemDTO) => void;
}

export const MenuItemCard = React.memo(function MenuItemCard({ item, onClick }: Props) {
    // Memoized inside component via fast string format (React.memo avoids re-renders on parent state change anyway)
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price);

    return (
        <button
            type="button"
            onClick={() => onClick(item)}
            aria-label={`${item.name}, Price ${formattedPrice}`}
            className="
        cursor-pointer group flex w-full flex-col overflow-hidden text-left 
        rounded-xl border-2 border-slate-200 bg-white 
        shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors duration-75 ease-linear
        hover:border-slate-300
        active:border-slate-800 active:bg-slate-50
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
        touch-manipulation tap-highlight-transparent
        select-none
      "
        >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100">
                <img
                    src={item.imageUrl}
                    alt="" // purely decorative, true info is on the button ARIA label
                    loading="lazy"
                    className="h-full w-full object-cover transition-opacity duration-150 group-active:opacity-80"
                />
                {item.stock <= 5 && item.stock > 0 && (
                    <span className="absolute bottom-2 left-2 rounded bg-amber-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-amber-900 shadow-sm">
                        Only {item.stock} left
                    </span>
                )}
                {item.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                        <span className="rounded bg-red-600 px-3 py-1 font-sans text-sm font-bold uppercase tracking-widest text-white shadow-sm">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            <div className="flex h-full min-h-[5.5rem] flex-col justify-between p-3 sm:p-4">
                <div>
                    <h3 className="font-sans text-base font-bold leading-tight tracking-tight text-slate-900 line-clamp-2">
                        {item.name}
                    </h3>
                    {item.description ? (
                        <p className="mt-1 font-sans text-xs leading-snug text-slate-500 line-clamp-2">
                            {item.description}
                        </p>
                    ) : null}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-slate-900">
                        {formattedPrice}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-active:bg-slate-800 group-active:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                    </div>
                </div>
            </div>
        </button>
    );
});

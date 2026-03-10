import React from 'react';
import { Item } from '../types/Item';

interface Props {
    item: Item;
    onClick: (item: Item) => void;
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

            </div>

            <div className="flex h-full min-h-[5.5rem] flex-col justify-between p-3 sm:p-4">
                <h3 className="font-sans text-base font-bold leading-tight tracking-tight text-slate-900 line-clamp-2">
                    {item.name}
                </h3>
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

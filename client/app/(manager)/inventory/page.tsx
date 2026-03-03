export default function InventoryPage() {
    return (
        <div className="flex h-full flex-col p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
                <p className="mt-2 text-slate-500">Track stock levels, ingredients, and suppliers.</p>
            </header>
            <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                <span className="text-slate-400 font-medium">Inventory module placeholder</span>
            </div>
        </div>
    );
}

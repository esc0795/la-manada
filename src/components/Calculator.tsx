import React, { useState, useMemo } from 'react';

const WhatsAppNumber = "50600000000"; // Reemplazar con el número real

const TARIFA_BASE = {
    pequeno: {
        nombre: "Pequeño (hasta 10kg)",
        precio: 8000,
    },
    mediano: {
        nombre: "Mediano (10-25kg)",
        precio: 10000,
    },
    grande: {
        nombre: "Grande (+25kg)",
        precio: 12000,
    },
};

export const Calculator: React.FC = () => {
    const [noches, setNoches] = useState<number>(1);
    const [perros, setPerros] = useState<number>(1);
    const [tamano, setTamano] = useState<keyof typeof TARIFA_BASE>('pequeno');

    const { subtotal, descuento, total } = useMemo(() => {
        const tarifaPorNoche = TARIFA_BASE[tamano].precio;
        const subtotalCalc = tarifaPorNoche * noches * perros;

        // Descuento del 10% si hay 2 o más perros
        const porcentajeDescuento = perros >= 2 ? 0.10 : 0;
        const descuentoCalc = subtotalCalc * porcentajeDescuento;
        const totalCalc = subtotalCalc - descuentoCalc;

        return {
            subtotal: subtotalCalc,
            descuento: descuentoCalc,
            total: totalCalc
        };
    }, [noches, perros, tamano]);

    const whatsappMessage = useMemo(() => {
        const p = perros === 1 ? '1 perro' : `${perros} perros`;
        const msg = `¡Hola! Me gustaría reservar en el Hotel Canino. \n\n*Detalles de la cotización:*\n- Noches: ${noches}\n- Tamaño: ${TARIFA_BASE[tamano].nombre}\n- Cantidad: ${p}\n\n*Total Estimado: ₡${total.toLocaleString('es-CR')}*\n\nMe gustaría continuar con la reserva.`;
        return encodeURIComponent(msg);
    }, [noches, perros, tamano, total]);

    const whatsappLink = `https://wa.me/${WhatsAppNumber}?text=${whatsappMessage}`;

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Calculadora de Tarifas</h2>

            <div className="space-y-5">
                {/* Cantidad de Noches */}
                <div>
                    <label htmlFor="noches" className="block text-sm font-semibold text-gray-700 mb-2">
                        Cantidad de noches
                    </label>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors"
                            onClick={() => setNoches(prev => Math.max(1, prev - 1))}
                        >
                            -
                        </button>
                        <input
                            id="noches"
                            type="number"
                            min="1"
                            value={noches}
                            onChange={(e) => setNoches(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 text-center border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors"
                            onClick={() => setNoches(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Tamaño del perro */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tamaño del perro
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {(Object.keys(TARIFA_BASE) as Array<keyof typeof TARIFA_BASE>).map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setTamano(key)}
                                className={`py-2 px-4 rounded-lg border text-sm text-left transition-all ${tamano === key
                                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                                    : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <div className="font-medium">{TARIFA_BASE[key].nombre}</div>
                                <div className="text-xs opacity-80">₡{TARIFA_BASE[key].precio.toLocaleString('es-CR')} / noche</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cantidad de Perros */}
                <div>
                    <label htmlFor="perros" className="block text-sm font-semibold text-gray-700 mb-2">
                        Cantidad de perros
                    </label>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors"
                            onClick={() => setPerros(prev => Math.max(1, prev - 1))}
                        >
                            -
                        </button>
                        <input
                            id="perros"
                            type="number"
                            min="1"
                            value={perros}
                            onChange={(e) => setPerros(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 text-center border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors"
                            onClick={() => setPerros(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                    {perros >= 2 && (
                        <p className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">
                            ¡Aplica 10% de descuento por múltiples mascotas!
                        </p>
                    )}
                </div>

                {/* Desglose */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Resumen Estimado</h3>

                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal ({noches} {noches === 1 ? 'noche' : 'noches'} x {perros} {perros === 1 ? 'perro' : 'perros'})</span>
                            <span>₡{subtotal.toLocaleString('es-CR')}</span>
                        </div>
                        {descuento > 0 && (
                            <div className="flex justify-between text-emerald-600 font-medium">
                                <span>Descuento (10%)</span>
                                <span>- ₡{descuento.toLocaleString('es-CR')}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                            <span className="text-base font-bold text-gray-800">Total a Pagar</span>
                            <span className="text-xl font-bold text-amber-600">₡{total.toLocaleString('es-CR')}</span>
                        </div>
                    </div>
                </div>

                {/* Call To Action */}
                <div className="pt-4">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592x" />
                            <path d="M11.846 9.382c-.214-.107-1.265-.624-1.46-.695-.194-.07-.335-.107-.478.107-.142.214-.55.695-.674.838-.124.143-.248.16-.462.054-.214-.107-.905-.333-1.724-1.063-.638-.567-1.069-1.272-1.192-1.485-.124-.214-.014-.33.093-.437.096-.096.214-.249.32-.375.107-.124.143-.214.214-.356.07-.143.035-.27-.018-.376-.053-.107-.477-1.15-.653-1.575-.173-.415-.348-.359-.478-.366-.123-.006-.264-.006-.407-.006a.82.82 0 0 0-.594.275c-.205.214-.783.766-.783 1.87 0 1.103.8 2.169.914 2.319.113.151 1.583 2.416 3.834 3.386.536.231.954.368 1.28.472.538.171 1.026.147 1.41.089.428-.065 1.317-.538 1.503-1.057.185-.519.185-.965.13-1.057-.054-.093-.195-.143-.409-.25Z" />
                        </svg>
                        Reservar por WhatsApp
                    </a>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Al confirmar, te redirigiremos a WhatsApp con los detalles de tu reserva.
                    </p>
                </div>
            </div>
        </div>
    );
};

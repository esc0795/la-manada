import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Navbar.css';

interface NavbarProps {
  /** Número de WhatsApp en formato internacional sin signos (ej: 50688888888) */
  phone?: string;
  /** Mensaje predeterminado para el enlace de WhatsApp */
  whatsappMessage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  phone = "50600000000",
  whatsappMessage = "¡Hola! Me gustaría consultar sobre los servicios de guardería y hotel canino en La Manada. 🐾",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Referencias a los elementos de video
  const navbarVideoRef = useRef<HTMLVideoElement>(null);
  const drawerVideoRef = useRef<HTMLVideoElement>(null);

  // Normalizar base URL asegurando barra final
  const rawBase = import.meta.env.BASE_URL || '/';
  const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  // Rutas a los assets en public/icons/
  const pawImageSrc = `${baseUrl}icons/menu-paw.png`;
  const logoVideoSrc = encodeURI(`${baseUrl}icons/La manada logo.mp4`);
  const logoPosterSrc = `${baseUrl}icons/logo-poster.png`;

  // Enlace dinámico a WhatsApp
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;

  // Cerrar drawer
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Alternar drawer
  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  // Reproducción automática de video con reanudación por interacción si hay modo ahorro activo
  useEffect(() => {
    const playVideos = () => {
      [navbarVideoRef.current, drawerVideoRef.current].forEach((v) => {
        if (v) {
          v.defaultMuted = true;
          v.muted = true;
          const p = v.play();
          if (p !== undefined) {
            p.catch(() => {});
          }
        }
      });
    };

    // Intento de autoplay silencioso inicial
    playVideos();

    // En caso de que el dispositivo esté en Modo Ahorro de Batería,
    // el primer toque o scroll del usuario activa la reproducción de inmediato
    const handleFirstInteraction = () => {
      playVideos();
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // Al abrir el drawer, asegurar que el video interno arranque sin retraso
  useEffect(() => {
    if (isOpen && drawerVideoRef.current) {
      const v = drawerVideoRef.current;
      v.defaultMuted = true;
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [isOpen]);

  // Manejar tecla Escape y bloqueo de scroll al abrir el menú lateral
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDrawer]);

  const navLinks = [
    { label: 'Inicio', href: `${baseUrl}` },
    { label: 'Servicios', href: `${baseUrl}#servicios` },
    { label: 'Calculadora de Tarifas', href: `${baseUrl}#calculadora` },
  ];

  return (
    <>
      <header
        className="manada-navbar sticky top-0 z-50 bg-[#2b694b] border-b border-black/60 shadow-md transition-colors"
        style={{ backgroundColor: '#2b694b' }}
      >
        <div className="manada-navbar-container max-w-7xl mx-auto px-4 py-2 flex items-center justify-between min-h-[4.25rem]">
          {/* Columna Izquierda: Botón Menú con imagen de la huella canina */}
          <div className="navbar-col-left">
            <button
              type="button"
              className="btn-paw-image-menu group transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
              onClick={toggleDrawer}
              aria-label="Abrir menú de navegación"
              aria-expanded={isOpen}
              aria-controls="drawer-menu"
            >
              <img
                src={pawImageSrc}
                alt="Abrir menú"
                className="paw-img object-contain"
                draggable={false}
                loading="eager"
              />
            </button>
          </div>

          {/* Columna Centro: Logo animado MP4 de alta fidelidad, centrado y aumentado */}
          <div className="navbar-col-center">
            <a
              href={baseUrl}
              className="navbar-logo-container flex items-center justify-center"
              aria-label="La Manada - Inicio"
            >
              {!videoError ? (
                <video
                  ref={navbarVideoRef}
                  src={logoVideoSrc}
                  poster={logoPosterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  // @ts-ignore Atributo para Safari WebKit
                  webkit-playsinline="true"
                  preload="auto"
                  controls={false}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    v.defaultMuted = true;
                    v.muted = true;
                    v.play().catch(() => {});
                  }}
                  onCanPlay={(e) => {
                    const v = e.currentTarget;
                    v.defaultMuted = true;
                    v.muted = true;
                    v.play().catch(() => {});
                  }}
                  className="navbar-logo-video object-contain w-auto transition-all pointer-events-none"
                  onError={() => setVideoError(true)}
                  title="La Manada - Logo Animado"
                />
              ) : (
                /* Fallback elegante con imagen en caso de error */
                <span className="navbar-logo-fallback flex items-center gap-2 text-white font-black text-xl sm:text-2xl tracking-tight">
                  <img src={logoPosterSrc} alt="Logo" className="w-12 h-12 object-contain" />
                  <span>La Manada</span>
                </span>
              )}
            </a>
          </div>

          {/* Columna Derecha: Botón dinámico de WhatsApp */}
          <div className="navbar-col-right">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-nav inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#25D366' }}
              aria-label="Contactar por WhatsApp"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592x" />
                <path d="M11.846 9.382c-.214-.107-1.265-.624-1.46-.695-.194-.07-.335-.107-.478.107-.142.214-.55.695-.674.838-.124.143-.248.16-.462.054-.214-.107-.905-.333-1.724-1.063-.638-.567-1.069-1.272-1.192-1.485-.124-.214-.014-.33.093-.437.096-.096.214-.249.32-.375.107-.124.143-.214.214-.356.07-.143.035-.27-.018-.376-.053-.107-.477-1.15-.653-1.575-.173-.415-.348-.359-.478-.366-.123-.006-.264-.006-.407-.006a.82.82 0 0 0-.594.275c-.205.214-.783.766-.783 1.87 0 1.103.8 2.169.914 2.319.113.151 1.583 2.416 3.834 3.386.536.231.954.368 1.28.472.538.171 1.026.147 1.41.089.428-.065 1.317-.538 1.503-1.057.185-.519.185-.965.13-1.057-.054-.093-.195-.143-.409-.25Z" />
              </svg>
              <span className="hidden sm:inline-block">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Drawer: Fondo difuminado (Backdrop) */}
      <div
        className={`drawer-backdrop fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? 'active opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer: Panel lateral deslizante */}
      <aside
        id="drawer-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal de navegación"
        className={`drawer-panel fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-[#1a4530] text-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'active translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del Drawer con Logo Animado tipo Escudo centrado en la línea divisoria */}
        <div className="drawer-header relative flex items-center justify-center border-b border-white/10 bg-[#2b694b]">
          <button
            type="button"
            className="drawer-close-btn text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-transform active:scale-90"
            onClick={closeDrawer}
            aria-label="Cerrar menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Emblema tipo escudo centrado que sobresale sobre la línea divisoria */}
          <div className="drawer-shield-container">
            <video
              ref={drawerVideoRef}
              src={logoVideoSrc}
              poster={logoPosterSrc}
              autoPlay
              loop
              muted
              playsInline
              // @ts-ignore Atributo para Safari WebKit
              webkit-playsinline="true"
              preload="auto"
              controls={false}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                v.defaultMuted = true;
                v.muted = true;
                v.play().catch(() => {});
              }}
              onCanPlay={(e) => {
                const v = e.currentTarget;
                v.defaultMuted = true;
                v.muted = true;
                v.play().catch(() => {});
              }}
              className="drawer-shield-video pointer-events-none"
              title="La Manada - Logo Animado"
            />
          </div>
        </div>

        {/* Lista de Enlaces */}
        <nav className="drawer-nav-list p-4 flex flex-col gap-2 flex-grow">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeDrawer}
              className="drawer-link flex items-center gap-3 p-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 font-semibold text-base transition-all hover:translate-x-1"
            >
              <span className="w-2 h-2 rounded-full bg-amber-300 opacity-70" />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Pie del Drawer */}
        <div className="drawer-footer p-4 border-t border-white/10 bg-black/15">
          <div className="drawer-footer-card bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/90 space-y-2">
            <p className="font-bold text-base text-amber-200">
              🐾 Guardería & Hotel Canino
            </p>
            <p className="text-sm text-white/90 leading-relaxed">
              Cuidamos a tu mejor amigo con amor, seguridad y dedicación las 24 horas.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

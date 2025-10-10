
export default {
    'page-title': 'Editor de Landing Page',
    'title': 'Editar Contenido de la Página',
    'description': 'Modifica el contenido que se muestra en tu página de inicio. Arrastra y suelta para reordenar las secciones.',
    'button-save': 'Guardar Todo el Contenido',
    'button-saving': 'Guardando Contenido...',
    
    'section-navbar': 'Barra de Navegación',
    'section-hero': 'Sección Principal',
    'section-features': 'Sección de Características',
    'section-services': 'Sección de Servicios',
    'section-testimonials': 'Sección de Testimonios',
    'section-appointments': 'Sección de Citas',
    'section-faq': 'Sección de Preguntas Frecuentes',
    'section-contact': 'Sección de Contacto',
    'section-footer': 'Sección de Pie de Página',

    'common': {
        'editLayout': 'Editar Diseño',
        'badge': 'Etiqueta (Badge)',
        'title': 'Título',
        'titleColor': 'Color del Título',
        'titleColorDesc': 'Opcional: Elige un color para el título de la sección de {section}.',
        'subtitle': 'Subtítulo',
        'subtitleColor': 'Color del Subtítulo',
        'subtitleColorDesc': 'Opcional: Elige un color para el subtítulo de la sección de {section}.',
        'description': 'Descripción',
        'imageUrl': 'URL de la Imagen',
    },

    'navbar': {
        'title': 'Barra de Navegación',
        'links': 'Enlaces de Navegación',
        'linksDesc': 'Añade, edita y activa/desactiva la visibilidad de los enlaces en la cabecera principal.',
        'linkText': 'Texto del Enlace',
        'linkUrl': 'URL del Enlace',
        'newLink': 'Nuevo Enlace',
        'addLink': 'Añadir Enlace',
    },

    'hero': {
        'title': 'Sección Principal (Hero)',
        'content': 'Contenido',
        'subtitleDesc': 'Puedes usar {appName} como marcador de posición para el nombre de la aplicación.',
        'cta1': 'Texto del Botón CTA 1',
        'cta2': 'Texto del Botón CTA 2',
    },

    'features': {
        'title': 'Sección de Características',
        'imageUrlDesc': 'Opcional: Una imagen para mostrar. Solo se usa en diseños con imagen.',
        'items': 'Elementos de Características',
        'itemsDesc': 'Añade y edita las características a mostrar.',
        'itemTitle': 'Característica',
        'icon': 'Ícono',
        'iconDesc': 'Nombre de un ícono de lucide-react.',
        'addItem': 'Añadir Característica',
    },

    'services': {
        'title': 'Sección de Servicios',
        'formDesc': 'Los servicios que se muestran aquí se gestionan desde el <a href="/dashboard/services" className="underline">panel de Servicios</a>. Puedes activar/desactivar la visibilidad de toda esta sección en los <a href="/dashboard/settings" className="underline">Ajustes de la Aplicación</a>.',
    },

    'testimonials': {
        'title': 'Sección de Testimonios',
        'items': 'Testimonios',
        'itemsDesc': 'Añade y edita los testimonios a mostrar.',
        'itemTitle': 'Testimonio',
        'quote': 'Cita',
        'name': 'Nombre',
        'avatarUrl': 'URL del Avatar',
        'addItem': 'Añadir Testimonio',
    },
    
    'appointments': {
        'title': 'Sección de Citas',
        'formDesc': 'El formulario de reserva de citas para el usuario se gestiona por separado. Puedes activar/desactivar la visibilidad de toda esta sección en los <a href="/dashboard/settings" class="underline">Ajustes de la Aplicación</a>.',
    },
    
    'faq': {
        'title': 'Sección de Preguntas Frecuentes',
        'items': 'Preguntas y Respuestas',
        'itemsDesc': 'Añade y edita las preguntas y respuestas a mostrar.',
        'question': 'Pregunta',
        'answer': 'Respuesta',
        'addItem': 'Añadir Pregunta',
    },

    'contact': {
        'title': 'Sección de Contacto',
        'formDesc': 'El formulario de contacto para el usuario se gestiona por separado. La dirección de correo de contacto se puede actualizar en los <a href="/dashboard/settings" class="underline">Ajustes de la Aplicación</a>.',
    },
    
    'footer': {
        'title': 'Sección de Pie de Página',
        'description': 'Descripción del Pie de Página',
        'linkColumns': 'Columnas de Enlaces',
        'linkColumnsDesc': 'Gestiona las columnas de enlaces que se muestran en el pie de página.',
        'column': 'Columna',
        'columnTitle': 'Título de la Columna',
        'newColumn': 'Nueva Columna',
        'addColumn': 'Añadir Columna',
        'links': 'Enlaces',
        'linkTextPlaceholder': 'Texto del enlace',
        'newLink': 'Nuevo Enlace',
        'addLink': 'Añadir Enlace',
    }

} as const;

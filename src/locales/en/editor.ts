
export default {
    'page-title': 'Landing Page Editor',
    'title': 'Edit Page Content',
    'description': 'Modify the content displayed on your landing page. Drag and drop to reorder sections.',
    'button-save': 'Save All Content',
    'button-saving': 'Saving Content...',

    'section-navbar': 'Navigation Bar',
    'section-hero': 'Hero Section',
    'section-features': 'Features Section',
    'section-services': 'Services Section',
    'section-testimonials': 'Testimonials Section',
    'section-appointments': 'Appointments Section',
    'section-faq': 'FAQ Section',
    'section-contact': 'Contact Section',
    'section-footer': 'Footer Section',

    'common': {
        'editLayout': 'Edit Layout',
        'badge': 'Badge',
        'title': 'Title',
        'titleColor': 'Title Color',
        'titleColorDesc': 'Optional: Pick a color for the {section} title.',
        'subtitle': 'Subtitle',
        'subtitleColor': 'Subtitle Color',
        'subtitleColorDesc': 'Optional: Pick a color for the {section} subtitle.',
        'description': 'Description',
        'imageUrl': 'Image URL',
    },

    'navbar': {
        'title': 'Navigation Bar',
        'links': 'Navigation Links',
        'linksDesc': 'Add, edit, and toggle visibility of the links in the main header.',
        'linkText': 'Link Text',
        'linkUrl': 'Link URL',
        'newLink': 'New Link',
        'addLink': 'Add Link',
    },

    'hero': {
        'title': 'Hero Section',
        'content': 'Content',
        'subtitleDesc': 'You can use {appName} as a placeholder for the app name.',
        'cta1': 'CTA Button 1 Text',
        'cta2': 'CTA Button 2 Text',
    },

    'features': {
        'title': 'Features Section',
        'imageUrlDesc': 'Optional: An image to display. Only used in layouts with an image.',
        'items': 'Feature Items',
        'itemsDesc': 'Add and edit the features to display.',
        'itemTitle': 'Feature',
        'icon': 'Icon',
        'iconDesc': 'Name of a lucide-react icon.',
        'addItem': 'Add Feature',
    },

    'services': {
        'title': 'Services Section',
        'formDesc': 'The services displayed here are managed from the <a href="/dashboard/services" className="underline">Services dashboard</a>. You can toggle the visibility of this entire section in the main <a href="/dashboard/settings" className="underline">Application Settings</a>.',
    },
    
    'testimonials': {
        'title': 'Testimonials Section',
        'items': 'Testimonial Items',
        'itemsDesc': 'Add and edit the testimonials to display.',
        'itemTitle': 'Testimonial',
        'quote': 'Quote',
        'name': 'Name',
        'avatarUrl': 'Avatar URL',
        'addItem': 'Add Testimonial',
    },

    'appointments': {
        'title': 'Appointments Section',
        'formDesc': 'The user-facing appointment booking form is managed separately. You can toggle the visibility of this entire section in the main <a href="/dashboard/settings" className="underline">Application Settings</a>.',
    },

    'faq': {
        'title': 'FAQ Section',
        'items': 'FAQ Items',
        'itemsDesc': 'Add and edit the questions and answers to display.',
        'question': 'Question',
        'answer': 'Answer',
        'addItem': 'Add FAQ Item',
    },

    'contact': {
        'title': 'Contact Section',
        'formDesc': 'The user-facing contact form is managed separately. The contact email address can be updated in the main <a href="/dashboard/settings" className="underline">Application Settings</a>.',
    },
    
    'footer': {
        'title': 'Footer Section',
        'description': 'Footer Description',
        'linkColumns': 'Link Columns',
        'linkColumnsDesc': 'Manage the columns of links displayed in the footer.',
        'column': 'Column',
        'columnTitle': 'Column Title',
        'newColumn': 'New Column',
        'addColumn': 'Add Column',
        'links': 'Links',
        'linkTextPlaceholder': 'Link Text',
        'newLink': 'New Link',
        'addLink': 'Add Link',
    }

} as const;

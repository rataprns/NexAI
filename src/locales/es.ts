
import common from './es/common';
import nav from './es/nav';
import login from './es/login';
import dashboard from './es/dashboard';
import appointments from './es/appointments';
import editor from './es/editor';
import a_settings from './es/ai-settings';
import settings from './es/settings';
import account from './es/account';
import availability from './es/availability';
import clients from './es/clients';
import emailTemplates from './es/email-templates';
import userNav from './es/user-nav';
import channels from './es/channels';
import analytics from './es/analytics';
import services from './es/services';
import locations from './es/locations';

export default {
    common,
    nav,
    login,
    dashboard,
    appointments,
    editor,
    'ai-settings': a_settings,
    settings,
    account,
    availability,
    clients,
    'email-templates': emailTemplates,
    'user-nav': userNav,
    channels,
    analytics,
    services,
    locations,
} as const;

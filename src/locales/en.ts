
import common from './en/common';
import nav from './en/nav';
import login from './en/login';
import dashboard from './en/dashboard';
import appointments from './en/appointments';
import editor from './en/editor';
import a_settings from './en/ai-settings';
import settings from './en/settings';
import account from './en/account';
import availability from './en/availability';
import clients from './en/clients';
import emailTemplates from './en/email-templates';
import userNav from './en/user-nav';
import channels from './en/channels';
import analytics from './en/analytics';
import services from './en/services';
import locations from './en/locations';

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

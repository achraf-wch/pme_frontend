export const ADMIN_ROLES = ['local_official', 'regional_official', 'central_admin', 'admin', 'super_admin'];
export const MEMBER_ROLES = ['member', ...ADMIN_ROLES];
export const ENGAGEMENT_ROLES = ['visitor', 'sympathizer', 'volunteer'];
export const ALL_ROLES = [...ENGAGEMENT_ROLES, 'member', ...ADMIN_ROLES];

export const ROLE_LABELS = {
    visitor: 'Visiteur inscrit',
    sympathizer: 'Sympathisant',
    volunteer: 'Bénévole',
    member: 'Membre',
    local_official: 'Responsable local',
    regional_official: 'Responsable régional',
    central_admin: 'Administration centrale',
    admin: 'Administrateur technique',
    super_admin: 'Super administrateur',
};

export const ROLE_DESCRIPTIONS = {
    visitor: 'تصفح عام، تسجيل، طلب الانخراط، التسجيل في الفعاليات، والتبرع.',
    sympathizer: 'استكمال الملف، تتبع الطلبات، واستقبال الإشعارات.',
    volunteer: 'تتبع ملف التطوع، الأنشطة، والإشعارات.',
    member: 'ولوج الفضاء الخاص، تحيين الملف، متابعة العضوية، والتصويت عند التأهيل.',
    local_official: 'الاطلاع على المعطيات المخول لها، إدارة بعض الأنشطة، والتقارير الجزئية.',
    regional_official: 'الاطلاع الجهوي المخول، إدارة الأنشطة الجهوية، والتقارير الجزئية.',
    central_admin: 'إدارة المحتوى، العضوية، التبرعات، التصويتات، واستخراج التقارير.',
    admin: 'حساب تقني قديم بصلاحيات إدارة موسعة.',
    super_admin: 'صلاحيات كاملة على النظام والإعدادات والأمان.',
};

export const roleNameOf = (user) => user?.role?.name ?? user?.role;
export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

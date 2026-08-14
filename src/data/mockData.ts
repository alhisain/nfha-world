import { ProjectTask, Machine, TeamMember, BrainstormIdea, ExpenseItem, OTPRecord } from '../types';

export const initialProjects: ProjectTask[] = [
  {
    id: 'proj-1',
    code: 'NF-2026-081',
    title: 'هيكل ماكينة تعبئة أوتوماتيكية ثقيلة',
    clientName: 'شركة النقاء للصناعات الغذائية',
    clientPhone: '+966 50 123 4567',
    otpCode: '8492',
    category: 'هياكل معدنية',
    material: 'فولاذ ST-52 سماكة 8mm + ستانلس ستيل SS304',
    dimensions: '2400 × 1600 × 1200 mm',
    quantity: 2,
    totalPrice: 18500,
    paidAmount: 14000,
    expenses: 7800,
    status: 'welding_assembly',
    priority: 'urgent',
    startDate: '2026-08-01',
    deadline: '2026-08-25',
    blueprintUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    notes: 'تحقيق استقامة أسطح التثبيت بتفاوت لا يتجاوز 0.2mm بعد اللحام، وتطبيق معالجة إجهاد حراري قبل الفريزة النهائية.',
    createdAt: '2026-08-01',
    stages: [
      { id: 's1', name: 'القص بالليزر Fiber Laser', weight: 20, completed: true, progressPercent: 100, technician: 'م. أحمد رضوان', machine: 'فايبر ليزر 12kW', completedAt: '2026-08-04' },
      { id: 's2', name: 'الثني والتشكيل CNC Press Brake', weight: 15, completed: true, progressPercent: 100, technician: 'فني طارق سالم', machine: 'مكبح هيدروليكي 200T', completedAt: '2026-08-07' },
      { id: 's3', name: 'الخراطة والتفريز CNC Milling', weight: 20, completed: true, progressPercent: 100, technician: 'فني ماهر الكردي', machine: 'مركز فريزة 4-Axis', completedAt: '2026-08-11' },
      { id: 's4', name: 'اللحام الهيكلي TIG/MIG والتجميع', weight: 25, completed: false, progressPercent: 70, technician: 'فني حسام الدين', machine: 'محطة لحام نبضي TIG', notes: 'جاري استكمال لحام الألواح السفلية وتقوية الزوايا' },
      { id: 's5', name: 'المعالجة السطحية والدهان الكهروستاتيكي', weight: 10, completed: false, progressPercent: 0, technician: 'فني بلال', machine: 'فرن البودرة الحراري' },
      { id: 's6', name: 'فحص الجودة النهائي واختبار التحمل والتسليم', weight: 10, completed: false, progressPercent: 0, technician: 'المهندس الحسين', machine: 'جهاز CMM للمعايرة' }
    ]
  },
  {
    id: 'proj-2',
    code: 'NF-2026-082',
    title: 'قوالب سحب ألومنيوم وقطع تروس ميكانيكية فائقة الدقة',
    clientName: 'مصنع الخليج للهندسة الدقيقة',
    clientPhone: '+966 54 987 6543',
    otpCode: '4219',
    category: 'قطع غيار CNC',
    material: 'صلب عدة Tool Steel D2 معالج حرارياً',
    dimensions: 'قطر 220mm × ارتفاع 180mm',
    quantity: 12,
    totalPrice: 14000,
    paidAmount: 9500,
    expenses: 5600,
    status: 'cutting',
    priority: 'high',
    startDate: '2026-08-05',
    deadline: '2026-08-28',
    blueprintUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    notes: 'صلادة مطلوبة 58-60 HRC بعد المعالجة، ودقة تشغيل ±0.01mm.',
    createdAt: '2026-08-05',
    stages: [
      { id: 's1', name: 'القطع بالواير كت والخراطة الأولية', weight: 25, completed: true, progressPercent: 100, technician: 'فني ماهر الكردي', machine: 'مخرطة CNC عالية السرعة', completedAt: '2026-08-09' },
      { id: 's2', name: 'تفريز مجاري التروس 4-Axis Milling', weight: 35, completed: false, progressPercent: 55, technician: 'م. أحمد رضوان', machine: 'مركز فريزة 4-Axis', notes: 'تنفيذ الشوط الثالث للتفريز الدقيق' },
      { id: 's3', name: 'المعالجة الحرارية والتصليد Vacuum Hardening', weight: 20, completed: false, progressPercent: 0, technician: 'فني طارق سالم', machine: 'فرن التصليد بالتفريغ' },
      { id: 's4', name: 'التجليخ الأسطواني والتلميع النهائي', weight: 10, completed: false, progressPercent: 0, technician: 'فني ماهر الكردي', machine: 'ماكينة تجليخ أسطواني' },
      { id: 's5', name: 'فحص الأبعاد بالميكروميتر واختبار الصلادة', weight: 10, completed: false, progressPercent: 0, technician: 'المهندس الحسين', machine: 'مختبر فحص الجودة' }
    ]
  },
  {
    id: 'proj-3',
    code: 'NF-2026-083',
    title: 'بوابات معمارية وقواطع ديكور ديكوباج ليزر للمشروع السكني',
    clientName: 'مجموعة المدى للاستثمار والتطوير',
    clientPhone: '+966 56 333 8899',
    otpCode: '6751',
    category: 'قص وتشكيل صاج',
    material: 'صاج أسود مسحوب على الساخن 4mm',
    dimensions: '3000 × 2200 mm (4 بوابات)',
    quantity: 4,
    totalPrice: 9800,
    paidAmount: 5500,
    expenses: 3900,
    status: 'design',
    priority: 'medium',
    startDate: '2026-08-08',
    deadline: '2026-09-05',
    blueprintUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    notes: 'نقش إسلامي حديث بتفريغ ليزر دقيق ودهان بودرة أسود مطفي مع طبقة حماية من الأشعة فوق البنفسجية UV.',
    createdAt: '2026-08-08',
    stages: [
      { id: 's1', name: 'إعداد ملفات CAD/CAM وتوزيع القطع Nesting', weight: 20, completed: true, progressPercent: 100, technician: 'م. أحمد رضوان', machine: 'محطة التصميم الهندسي', completedAt: '2026-08-10' },
      { id: 's2', name: 'قص الزخارف بألياف الليزر Fiber Laser', weight: 30, completed: false, progressPercent: 40, technician: 'فني حسام الدين', machine: 'فايبر ليزر 12kW' },
      { id: 's3', name: 'تجهيز الشاسيه الحامل ولحام المفصلات', weight: 25, completed: false, progressPercent: 0, technician: 'فني بلال', machine: 'محطة لحام نبضي TIG' },
      { id: 's4', name: 'الدهان الحراري الكهروستاتيكي والمعاينة', weight: 15, completed: false, progressPercent: 0, technician: 'فني طارق سالم', machine: 'فرن البودرة الحراري' },
      { id: 's5', name: 'تغليف الفقاعات للشحن والتسليم الموقعي', weight: 10, completed: false, progressPercent: 0, technician: 'المهندس الحسين', machine: 'وحدة التغليف' }
    ]
  },
  {
    id: 'proj-4',
    code: 'NF-2026-084',
    title: 'خزانات ضغط ستانلس ستيل مع وصلات فلانجات معيارية',
    clientName: 'شركة أفق للكيماويات الصناعية',
    clientPhone: '+966 55 777 1122',
    otpCode: '9134',
    category: 'تصنيع ميكانيكي',
    material: 'ستانلس ستيل SS316L مقاوم للأحماض 5mm',
    dimensions: 'سعة 1500 لتر - قطر 1100mm × طول 2000mm',
    quantity: 1,
    totalPrice: 6200,
    paidAmount: 3000,
    expenses: 2100,
    status: 'new',
    priority: 'low',
    startDate: '2026-08-12',
    deadline: '2026-09-15',
    blueprintUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    notes: 'لحام TIG أوتوماتيكي مع فحص اختراق الصبغات ولحام غاز الأرجون النقي 99.999% لتجنب أي أكسدة داخلية.',
    createdAt: '2026-08-12',
    stages: [
      { id: 's1', name: 'قص الألواح والعدسات بالليزر', weight: 20, completed: false, progressPercent: 0, technician: 'م. أحمد رضوان', machine: 'فايبر ليزر 12kW' },
      { id: 's2', name: 'درفلة الصاج الأسطواني 4-Roll Bender', weight: 25, completed: false, progressPercent: 0, technician: 'فني طارق سالم', machine: 'درافيل درفلة الصاج' },
      { id: 's3', name: 'لحام التماس الطولي والدائري TIG', weight: 30, completed: false, progressPercent: 0, technician: 'فني حسام الدين', machine: 'محطة لحام نبضي TIG' },
      { id: 's4', name: 'تثبيت الفلانجات واختبار الضغط الهيدروستاتيكي 10 Bar', weight: 15, completed: false, progressPercent: 0, technician: 'فني ماهر الكردي', machine: 'مضخة اختبار الضغط' },
      { id: 's5', name: 'التخليل والتخميل الكيميائي والتسليم', weight: 10, completed: false, progressPercent: 0, technician: 'المهندس الحسين', machine: 'حوض المعالجة الكيميائية' }
    ]
  }
];

export const initialExpenses: ExpenseItem[] = [
  { id: 'exp-1', projectId: 'proj-1', projectCode: 'NF-2026-081', title: 'توريد ألواح صاج ST-52 وستانلس ستيل SS304', category: 'خامات ومواد أولية', amount: 5200, date: '2026-08-02', recipient: 'شركة حديد الراجحي', invoiceNo: 'INV-7821', paid: true },
  { id: 'exp-2', projectId: 'proj-1', projectCode: 'NF-2026-081', title: 'ساعات تشغيل فايبر ليزر وأسطوانات نيتروجين', category: 'استهلاك غاز وكهرباء', amount: 950, date: '2026-08-05', recipient: 'الغازات الصناعية المتحدة', invoiceNo: 'GAS-449', paid: true },
  { id: 'exp-3', projectId: 'proj-1', projectCode: 'NF-2026-081', title: 'سلف وأجور فنيين لمرحلة التجميع واللحام', category: 'أجور عمالة وفنيين', amount: 1650, date: '2026-08-11', recipient: 'طاقم اللحام والميكانيك', invoiceNo: 'PAY-882', paid: true },
  { id: 'exp-4', projectId: 'proj-2', projectCode: 'NF-2026-082', title: 'شراء بلوكات صلب D2 وقواطع تفريز كربايد Sandvik', category: 'خامات ومواد أولية', amount: 3800, date: '2026-08-06', recipient: 'المؤسسة الهندسية للعدد', invoiceNo: 'TOOL-109', paid: true },
  { id: 'exp-5', projectId: 'proj-2', projectCode: 'NF-2026-082', title: 'أجور تشغيل الـ CNC والفريزة الدقيقة', category: 'أجور عمالة وفنيين', amount: 1800, date: '2026-08-10', recipient: 'فريق تشغيل الـ CNC', invoiceNo: 'PAY-891', paid: true },
  { id: 'exp-6', projectId: 'proj-3', projectCode: 'NF-2026-083', title: 'ألواح صاج 4mm ومفصلات ومواسير الشاسيه', category: 'خامات ومواد أولية', amount: 2700, date: '2026-08-09', recipient: 'مخازن الصفا للمعادن', invoiceNo: 'INV-9901', paid: true },
  { id: 'exp-7', projectId: 'proj-3', projectCode: 'NF-2026-083', title: 'بودرة دهان كهروستاتيكي تايجر أسود مطفي', category: 'خامات ومواد أولية', amount: 1200, date: '2026-08-11', recipient: 'وكالة دهانات تايجر', invoiceNo: 'POW-302', paid: true },
  { id: 'exp-8', projectId: 'proj-4', projectCode: 'NF-2026-084', title: 'ألواح ستانلس SS316L وفلانجات ASTM A182', category: 'خامات ومواد أولية', amount: 2100, date: '2026-08-13', recipient: 'شركة النجم للستانلس', invoiceNo: 'INV-4412', paid: false }
];

export const initialMachines: Machine[] = [
  {
    id: 'm1',
    code: 'FL-12K',
    name: 'ماكينة قص بالليزر فايبر (Fiber Laser 12kW)',
    type: 'fiber_laser',
    brand: 'Bodor / IPG Photonics',
    power: '12,000 Watt',
    capacity: 'صاج حديد حتى 35mm، ستانلس حتى 25mm، ألومنيوم 20mm',
    status: 'active',
    totalHours: 3420,
    lastMaintenance: '2026-07-28',
    nextMaintenance: '2026-08-28',
    operator: 'م. أحمد رضوان',
    imageIcon: 'Zap'
  },
  {
    id: 'm2',
    code: 'VMC-1000',
    name: 'مركز تشغيل فريزة عمودية 4 محاور (CNC VMC)',
    type: 'cnc_milling',
    brand: 'Haas Automation VF-4',
    power: '30 HP / 12,000 RPM',
    capacity: 'مدى الحركة 1270 × 660 × 635 mm مع طاولة دوران محور رابع',
    status: 'active',
    totalHours: 4890,
    lastMaintenance: '2026-08-02',
    nextMaintenance: '2026-09-02',
    operator: 'فني ماهر الكردي',
    imageIcon: 'Cpu'
  },
  {
    id: 'm3',
    code: 'PB-200T',
    name: 'مكبح ثني هيدروليكي CNC Press Brake 200 Ton',
    type: 'press_brake',
    brand: 'Durma AD-R 30200',
    power: '200 طن ضغط - طول 3200mm',
    capacity: 'ثني صاج بسماكة تصل إلى 10mm مع تعويض انحراف هيدروليكي',
    status: 'active',
    totalHours: 2750,
    lastMaintenance: '2026-08-01',
    nextMaintenance: '2026-09-01',
    operator: 'فني طارق سالم',
    imageIcon: 'Layers'
  },
  {
    id: 'm4',
    code: 'LATHE-PRO',
    name: 'مخرطة ميكانيكية دقيقة CNC Lathe',
    type: 'lathe',
    brand: 'Mazak Quick Turn 250',
    power: '25 HP / 4,000 RPM',
    capacity: 'قطر تشغيل أقصى 380mm وطول 600mm مع برج أدوات 12 موضع',
    status: 'active',
    totalHours: 5120,
    lastMaintenance: '2026-07-20',
    nextMaintenance: '2026-08-20',
    operator: 'فني ماهر الكردي',
    imageIcon: 'RotateCcw'
  },
  {
    id: 'm5',
    code: 'WELD-TIG',
    name: 'محطة لحام نبضي TIG/MIG روبوتية ويدوية',
    type: 'welding_station',
    brand: 'Kemppi MasterTig 335ACDC',
    power: '350 Ampere Pulse',
    capacity: 'لحام جميع أنواع المعادن والألومنيوم وسبائك النيكل بدون شوائب',
    status: 'active',
    totalHours: 1980,
    lastMaintenance: '2026-08-10',
    nextMaintenance: '2026-09-10',
    operator: 'فني حسام الدين',
    imageIcon: 'Flame'
  },
  {
    id: 'm6',
    code: 'OVEN-PC',
    name: 'فرن معالجة ودهان بودرة حراري كهروستاتيكي',
    type: 'powder_oven',
    brand: 'Gema EcoCoat 400',
    power: '250°C Max - 4.5 × 2.2 × 2.5 m',
    capacity: 'طلاء القطع الكبيرة بطبقة حماية ضد الصدأ والخدش مع نظام شفط البودرة',
    status: 'standby',
    totalHours: 1420,
    lastMaintenance: '2026-07-15',
    nextMaintenance: '2026-08-15',
    operator: 'فني بلال',
    imageIcon: 'Sun'
  }
];

export const initialTeam: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'المهندس الحسين',
    role: 'مدير النظام (Admin)',
    phone: '+966 50 000 1111',
    badgeCode: 'ADM-01',
    status: 'on_shift',
    permissions: {
      canViewFinancials: true,
      canEditStages: true,
      canGenerateReports: true,
      canManageUsers: true,
      canModifyPrices: true,
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: true
    }
  },
  {
    id: 'tm-2',
    name: 'م. أحمد رضوان',
    role: 'مهندس إنتاج',
    phone: '+966 50 222 3333',
    badgeCode: 'ENG-02',
    status: 'on_shift',
    permissions: {
      canViewFinancials: false,
      canEditStages: true,
      canGenerateReports: true,
      canManageUsers: false,
      canModifyPrices: false,
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: false
    }
  },
  {
    id: 'tm-3',
    name: 'فني ماهر الكردي',
    role: 'فني أول CNC',
    phone: '+966 50 444 5555',
    badgeCode: 'CNC-03',
    status: 'on_shift',
    permissions: {
      canViewFinancials: false,
      canEditStages: true,
      canGenerateReports: false,
      canManageUsers: false,
      canModifyPrices: false,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false
    }
  },
  {
    id: 'tm-4',
    name: 'فني حسام الدين',
    role: 'فني لحام وتجميع',
    phone: '+966 50 666 7777',
    badgeCode: 'WLD-04',
    status: 'on_shift',
    permissions: {
      canViewFinancials: false,
      canEditStages: true,
      canGenerateReports: false,
      canManageUsers: false,
      canModifyPrices: false,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false
    }
  },
  {
    id: 'tm-5',
    name: 'فني طارق سالم',
    role: 'مشرف جودة',
    phone: '+966 50 888 9999',
    badgeCode: 'QC-05',
    status: 'active',
    permissions: {
      canViewFinancials: false,
      canEditStages: true,
      canGenerateReports: true,
      canManageUsers: false,
      canModifyPrices: false,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false
    }
  }
];

export const initialIdeas: BrainstormIdea[] = [
  {
    id: 'idea-1',
    title: 'استخدام وصلات تعشيق Tab-and-Slot في شاسيهات الصاج',
    author: 'المهندس الحسين',
    tag: 'توفير تكلفة',
    description: 'تطبيق ألسنة وثقوب التعشيق في قص الليزر للألواح لتجميعها بدقة زاوية 90° بدون الحاجة لفيكستشر تثبيت معقد، مما يوفر 40% من وقت تجهيز اللحام.',
    aiSuggested: true,
    aiNotes: 'تحقق من زيادة خلوص التعشيق بمقدار 0.15mm لمراعاة تمدد اللحام وسهولة التركيب اليدوي.',
    upvotes: 9,
    status: 'implemented',
    date: '2026-08-04'
  },
  {
    id: 'idea-2',
    title: 'برنامج Nesting ذكي لدمج بقايا الصاج سكراب في قص حلقات الفلانجات',
    author: 'م. أحمد رضوان',
    tag: 'توفير تكلفة',
    description: 'استغلال المساحات الداخلية الدائرية المفرغة من قطع الفلانجات الكبيرة لقص قطع غيار ووردات صغيرة بدلاً من التخلص منها كسكراب.',
    aiSuggested: false,
    upvotes: 7,
    status: 'under_review',
    date: '2026-08-07'
  },
  {
    id: 'idea-3',
    title: 'تطوير قوالب ثني مرنة لمكبح الـ 200T لتشكيل أقواس الراديوس الكبيرة',
    author: 'فني طارق سالم',
    tag: 'قوالب وتثبيت',
    description: 'تصميم بكرات ثني بوليميرية لحماية أسطح الستانلس ستيل المصقولة من الخدوش أثناء عملية الثني المتكرر.',
    aiSuggested: true,
    aiNotes: 'ينصح باستخدام بولي يوريثان بقساوة 90 Shore A لتحمل إجهادات الضغط العالية.',
    upvotes: 5,
    status: 'new',
    date: '2026-08-11'
  }
];

export const initialOtps: OTPRecord[] = [
  { id: 'otp-1', clientName: 'شركة النقاء للصناعات الغذائية', phone: '+966 50 123 4567', projectCode: 'NF-2026-081', code: '8492', generatedAt: '2026-08-01', expiresAt: '2026-09-01', active: true, accessCount: 14 },
  { id: 'otp-2', clientName: 'مصنع الخليج للهندسة الدقيقة', phone: '+966 54 987 6543', projectCode: 'NF-2026-082', code: '4219', generatedAt: '2026-08-05', expiresAt: '2026-09-05', active: true, accessCount: 8 },
  { id: 'otp-3', clientName: 'مجموعة المدى للاستثمار والتطوير', phone: '+966 56 333 8899', projectCode: 'NF-2026-083', code: '6751', generatedAt: '2026-08-08', expiresAt: '2026-09-08', active: true, accessCount: 3 },
  { id: 'otp-4', clientName: 'شركة أفق للكيماويات الصناعية', phone: '+966 55 777 1122', projectCode: 'NF-2026-084', code: '9134', generatedAt: '2026-08-12', expiresAt: '2026-09-12', active: true, accessCount: 1 }
];

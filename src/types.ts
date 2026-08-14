export type AppMode = 'manage' | 'world';

export type ViewType = 
  | 'dashboard'
  | 'worksheet'
  | 'manufacturing'
  | 'reports'
  | 'permissions'
  | 'gallery'
  | 'brainstorm'
  | 'calculator'
  | 'install_apk';

export interface ManufacturingStage {
  id: string;
  name: string;
  weight: number; // percentage weight, e.g. 20 for 20%
  completed: boolean;
  progressPercent: number; // 0 to 100
  technician: string;
  machine?: string;
  notes?: string;
  completedAt?: string;
}

export interface ProjectTask {
  id: string;
  code: string; // e.g. NF-2026-081
  title: string;
  clientName: string;
  clientPhone: string;
  otpCode: string; // OTP for client tracking
  category: 'تصنيع ميكانيكي' | 'قص وتشكيل صاج' | 'هياكل معدنية' | 'قطع غيار CNC' | 'أفران ودهان حراري';
  material: string; // e.g. 'فولاذ ST-52 سماكة 6mm', 'ألومنيوم 6061'
  dimensions: string; // e.g. '1200 x 800 x 450 mm'
  quantity: number;
  totalPrice: number;
  paidAmount: number;
  expenses: number;
  status: 'new' | 'design' | 'cutting' | 'welding_assembly' | 'finishing' | 'quality_check' | 'delivered';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  deadline: string;
  stages: ManufacturingStage[];
  blueprintUrl?: string;
  notes: string;
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  projectId?: string;
  projectCode?: string;
  title: string;
  category: 'خامات ومواد أولية' | 'أجور عمالة وفنيين' | 'استهلاك غاز وكهرباء' | 'صيانة عدد وماكينات' | 'نقل ومصاريف إدارية';
  amount: number;
  date: string;
  recipient: string;
  invoiceNo?: string;
  paid: boolean;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  type: 'fiber_laser' | 'cnc_milling' | 'lathe' | 'press_brake' | 'welding_station' | 'powder_oven';
  brand: string;
  power: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'standby';
  totalHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  operator: string;
  imageIcon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'مدير النظام (Admin)' | 'مهندس إنتاج' | 'فني أول CNC' | 'فني لحام وتجميع' | 'محاسب مالي' | 'مشرف جودة';
  phone: string;
  badgeCode: string;
  status: 'active' | 'on_shift' | 'leave';
  permissions: {
    canViewFinancials: boolean;
    canEditStages: boolean;
    canGenerateReports: boolean;
    canManageUsers: boolean;
    canModifyPrices: boolean;
    canCreateProjects: boolean;
    canEditProjects: boolean;
    canDeleteProjects: boolean;
  };
}

export interface BrainstormIdea {
  id: string;
  title: string;
  author: string;
  tag: 'توفير تكلفة' | 'تطوير فني' | 'قوالب وتثبيت' | 'سلامة وجودة' | 'هندسة عكسية';
  description: string;
  aiSuggested?: boolean;
  aiNotes?: string;
  upvotes: number;
  status: 'new' | 'under_review' | 'implemented';
  date: string;
}

export interface OTPRecord {
  id: string;
  clientName: string;
  phone: string;
  projectCode: string;
  code: string;
  generatedAt: string;
  expiresAt: string;
  active: boolean;
  accessCount: number;
}

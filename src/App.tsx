import React, { useState, useEffect } from 'react';
import { 
  initialProjects, 
  initialExpenses, 
  initialMachines, 
  initialTeam, 
  initialOtps, 
  initialIdeas 
} from './data/mockData';
import { 
  ProjectTask, 
  ExpenseItem, 
  Machine, 
  TeamMember, 
  OTPRecord, 
  BrainstormIdea, 
  ViewType, 
  AppMode, 
  ManufacturingStage 
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { WorksheetView } from './components/WorksheetView';
import { ManufacturingView } from './components/ManufacturingView';
import { ReportsView } from './components/ReportsView';
import { PermissionsView } from './components/PermissionsView';
import { GalleryView } from './components/GalleryView';
import { BrainstormView } from './components/BrainstormView';
import { QuickQuoteCalculator } from './components/QuickQuoteCalculator';
import { PublicClientPortal } from './components/PublicClientPortal';
import { NewProjectModal } from './components/NewProjectModal';
import { EditProjectModal } from './components/EditProjectModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { InstallApkView } from './components/InstallApkView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeMode, setActiveMode] = useState<AppMode>('manage');
  const [searchQuery, setSearchQuery] = useState('');

  // Active User Profile / Manager Switcher
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('nfha_active_user') || 'tm-1';
  });

  // State Collections with LocalStorage Persistence
  const [projects, setProjects] = useState<ProjectTask[]>(() => {
    const saved = localStorage.getItem('nfha_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialProjects;
  });

  const [isRealDataMode, setIsRealDataMode] = useState<boolean>(() => {
    return localStorage.getItem('nfha_real_mode') === 'true';
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('nfha_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialExpenses;
  });

  const [machines, setMachines] = useState<Machine[]>(() => {
    const saved = localStorage.getItem('nfha_machines');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialMachines;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('nfha_team');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialTeam;
  });

  const [otps, setOtps] = useState<OTPRecord[]>(() => {
    const saved = localStorage.getItem('nfha_otps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialOtps;
  });

  const [ideas, setIdeas] = useState<BrainstormIdea[]>(() => {
    const saved = localStorage.getItem('nfha_ideas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialIdeas;
  });

  // Selected Project for Manufacturing Stages View
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectTask | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectTask | null>(null);
  const [clientActiveOtp, setClientActiveOtp] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nfha_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('nfha_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('nfha_machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('nfha_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('nfha_otps', JSON.stringify(otps));
  }, [otps]);

  useEffect(() => {
    localStorage.setItem('nfha_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('nfha_real_mode', isRealDataMode ? 'true' : 'false');
  }, [isRealDataMode]);

  useEffect(() => {
    localStorage.setItem('nfha_active_user', activeUserId);
  }, [activeUserId]);

  // Current Logged-in User and their calculated permissions
  const currentUser = team.find(t => t.id === activeUserId) || team[0];
  const canCreate = !!currentUser?.permissions?.canCreateProjects;
  const canEdit = !!currentUser?.permissions?.canEditProjects;
  const canDelete = !!currentUser?.permissions?.canDeleteProjects;
  const canModifyPrices = !!currentUser?.permissions?.canModifyPrices;

  // Project CRUD Handlers
  const handleCreateProject = (newProject: ProjectTask) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setIsRealDataMode(true);

    // Automatically generate and register OTP for the client
    const newOtpRecord: OTPRecord = {
      id: `otp-${Date.now()}`,
      code: newProject.otpCode,
      clientName: newProject.clientName,
      projectCode: newProject.code,
      phone: newProject.clientPhone,
      generatedAt: new Date().toISOString().split('T')[0],
      expiresAt: newProject.deadline || '2026-10-30',
      active: true,
      accessCount: 0
    };
    setOtps(prev => [newOtpRecord, ...prev]);
  };

  const handleOpenEditProject = (project: ProjectTask) => {
    if (!canEdit) {
      alert('عذراً، هذا الحساب ليس لديه صلاحية تعديل المشاريع. يرجى مراجعة المدير.');
      return;
    }
    setEditingProject(project);
  };

  const handleSaveEditedProject = (updatedProject: ProjectTask) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    // Also update OTP client name and phone if changed
    setOtps(prev => prev.map(o => o.projectCode === updatedProject.code ? {
      ...o,
      clientName: updatedProject.clientName,
      phone: updatedProject.clientPhone,
      code: updatedProject.otpCode
    } : o));
    setEditingProject(null);
  };

  const handleOpenDeleteProject = (project: ProjectTask) => {
    if (!canDelete) {
      alert('عذراً، هذا الحساب ليس لديه صلاحية حذف المشاريع.');
      return;
    }
    setDeletingProject(project);
  };

  const handleConfirmDeleteProject = (projectId: string) => {
    const targetProject = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (targetProject) {
      setOtps(prev => prev.filter(o => o.projectCode !== targetProject.code));
    }
    if (selectedProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setSelectedProjectId(remaining[0]?.id || '');
    }
    setDeletingProject(null);
  };

  const handleClearMockProjects = () => {
    if (window.confirm('هل أنت متأكد من تفريغ المشاريع الافتراضية للبدء بسجل الورشة الفعلي؟')) {
      setProjects([]);
      setIsRealDataMode(true);
    }
  };

  const handleRestoreMockProjects = () => {
    setProjects(initialProjects);
    setIsRealDataMode(false);
    setSelectedProjectId(initialProjects[0].id);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectTask['status']) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
  };

  const handleUpdateStageProgress = (projectId: string, stageId: string, progress: number, completed: boolean) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const nextStages = p.stages.map(s => s.id === stageId ? { ...s, progressPercent: progress, completed } : s);
      const allCompleted = nextStages.every(s => s.completed || s.progressPercent === 100);
      return {
        ...p,
        stages: nextStages,
        status: allCompleted ? 'delivered' : p.status === 'new' ? 'in_progress' : p.status
      };
    }));
  };

  const handleAddCustomStage = (projectId: string, newStage: Omit<ManufacturingStage, 'id'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const stageWithId: ManufacturingStage = {
        ...newStage,
        id: `st-${Date.now()}`
      };
      return {
        ...p,
        stages: [...p.stages, stageWithId]
      };
    }));
  };

  const handleRecordPayment = (projectId: string, amount: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        paidAmount: Math.min(p.totalPrice, p.paidAmount + amount)
      };
    }));
  };

  const handleAddExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleToggleMachineStatus = (machineId: string) => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;
      const nextStatus: Machine['status'] = m.status === 'active' ? 'standby' : 'active';
      return { ...m, status: nextStatus };
    }));
  };

  const handleGenerateOtp = (clientName: string, phone: string, projectCode: string) => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newOtp: OTPRecord = {
      id: `otp-${Date.now()}`,
      code: newCode,
      clientName,
      phone,
      projectCode,
      generatedAt: new Date().toISOString().split('T')[0],
      expiresAt: '2026-10-30',
      active: true,
      accessCount: 0
    };
    setOtps(prev => [newOtp, ...prev]);
    setProjects(prev => prev.map(p => p.code === projectCode ? { ...p, otpCode: newCode } : p));
  };

  const handleTogglePermission = (memberId: string, key: keyof TeamMember['permissions']) => {
    setTeam(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        permissions: {
          ...m.permissions,
          [key]: !m.permissions[key]
        }
      };
    }));
  };

  const handleAddIdea = (idea: Omit<BrainstormIdea, 'id' | 'upvotes' | 'date'>) => {
    const newIdea: BrainstormIdea = {
      ...idea,
      id: `idea-${Date.now()}`,
      upvotes: 1,
      date: new Date().toISOString().split('T')[0]
    };
    setIdeas(prev => [newIdea, ...prev]);
  };

  const handleUpvoteIdea = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i));
  };

  const handleSimulateClientLogin = (otpCode: string) => {
    setClientActiveOtp(otpCode);
    setActiveMode('world');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950" dir="rtl">
      {/* Public Client Portal Mode (NFHA World) */}
      {activeMode === 'world' ? (
        <div className="flex-1 p-4 md:p-8 bg-slate-950 overflow-y-auto">
          <PublicClientPortal
            projects={projects}
            otps={otps}
            activeOtpCode={clientActiveOtp}
            onSwitchToManage={() => setActiveMode('manage')}
          />
        </div>
      ) : (
        /* Workshop Management Mode (NFHA Manage) */
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentView={currentView}
            onSelectView={setCurrentView}
            mode={activeMode}
            onToggleMode={() => setActiveMode(activeMode === 'manage' ? 'world' : 'manage')}
            pendingTasksCount={projects.filter(p => p.status !== 'delivered').length}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
            {/* Top Navbar */}
            <TopNavbar
              currentView={currentView}
              mode={activeMode}
              onToggleMode={() => setActiveMode(activeMode === 'manage' ? 'world' : 'manage')}
              onOpenNewProject={() => {
                if (!canCreate) {
                  alert('ليس لديك صلاحية إنشاء مشاريع جديدة. الرجاء تسجيل الدخول كمدير.');
                  return;
                }
                setIsNewProjectModalOpen(true);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenInstallApk={() => setCurrentView('install_apk')}
              team={team}
              activeUserId={activeUserId}
              onSelectActiveUser={setActiveUserId}
              canCreateProjects={canCreate}
            />

            {/* Scrollable View Container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
              {currentView === 'dashboard' && (
                <DashboardView
                  projects={projects}
                  expenses={expenses}
                  onSelectView={setCurrentView}
                  onRecordPayment={handleRecordPayment}
                  onAddExpense={handleAddExpense}
                />
              )}

              {currentView === 'worksheet' && (
                <WorksheetView
                  projects={projects}
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setCurrentView('manufacturing');
                  }}
                  onSelectView={setCurrentView}
                  onOpenNewProject={() => {
                    if (!canCreate) {
                      alert('ليس لديك صلاحية إنشاء مشاريع جديدة.');
                      return;
                    }
                    setIsNewProjectModalOpen(true);
                  }}
                  onUpdateProjectStatus={handleStatusChange}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={handleOpenDeleteProject}
                  canCreate={canCreate}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  isRealDataMode={isRealDataMode}
                  onToggleRealDataMode={() => setIsRealDataMode(prev => !prev)}
                  onClearMockProjects={handleClearMockProjects}
                  onRestoreMockProjects={handleRestoreMockProjects}
                />
              )}

              {currentView === 'manufacturing' && (
                <ManufacturingView
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                  onUpdateStageProgress={handleUpdateStageProgress}
                  onAddCustomStage={handleAddCustomStage}
                  onSelectView={setCurrentView}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={handleOpenDeleteProject}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              )}

              {currentView === 'reports' && (
                <ReportsView
                  projects={projects}
                  expenses={expenses}
                  machines={machines}
                  team={team}
                />
              )}

              {currentView === 'permissions' && (
                <PermissionsView
                  team={team}
                  otps={otps}
                  projects={projects}
                  onGenerateOtp={handleGenerateOtp}
                  onTogglePermission={handleTogglePermission}
                  onSimulateClientLogin={handleSimulateClientLogin}
                />
              )}

              {currentView === 'gallery' && (
                <GalleryView
                  machines={machines}
                  onToggleMachineStatus={handleToggleMachineStatus}
                />
              )}

              {currentView === 'brainstorm' && (
                <BrainstormView
                  ideas={ideas}
                  onAddIdea={handleAddIdea}
                  onUpvoteIdea={handleUpvoteIdea}
                />
              )}

              {currentView === 'calculator' && (
                <QuickQuoteCalculator />
              )}

              {currentView === 'install_apk' && (
                <InstallApkView
                  onBackToDashboard={() => setCurrentView('dashboard')}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
        nextProjectNumber={80 + projects.length + 1}
        team={team}
        machines={machines}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSaveProject={handleSaveEditedProject}
        canModifyPrices={canModifyPrices}
        team={team}
        machines={machines}
      />

      {/* Delete Project Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProject}
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirmDelete={handleConfirmDeleteProject}
      />
    </div>
  );
}

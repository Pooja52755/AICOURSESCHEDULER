export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'academic' | 'extracurricular' | 'work' | 'personal';
  completed: boolean;
}

export interface ScheduleInsight {
  title: string;
  description: string;
  icon: string;
}

export type ActiveTab = 'schedule' | 'academics' | 'work' | 'activities' | 'analytics' | 'settings';
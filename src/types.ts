export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'study' | 'work' | 'personal' | 'other';
  completed: boolean;
}

export interface ScheduleInsight {
  title: string;
  description: string;
  icon: string;
}

export type ActivePage = 'schedule' | 'analytics' | 'academic' | 'settings';
import { toast } from 'react-hot-toast';
import type { Task } from '../types/task';

class NotificationService {
  private static instance: NotificationService;
  private notificationPermission: NotificationPermission = 'default';

  private constructor() {
    this.initialize();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initialize() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
  }

  public async requestPermission() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
  }

  public showTaskNotification(task: Task) {
    // Show browser notification if permitted
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('New Task Assigned', {
        body: `You have been assigned to: ${task.title}`,
        icon: '/logo.png',
      });
    }

    // Show toast notification
    toast.success(`New task assigned: ${task.title}`);
  }

  public showTaskDueNotification(task: Task) {
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('Task Due Soon', {
        body: `Task "${task.title}" is due soon`,
        icon: '/logo.png',
      });
    }

    toast(`Task due soon: ${task.title}`, {
      icon: '⚠️',
    });
  }

  public showTaskCompletedNotification(task: Task) {
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('Task Completed', {
        body: `Task "${task.title}" has been completed`,
        icon: '/logo.png',
      });
    }

    toast.success(`Task completed: ${task.title}`);
  }

  public showTaskBlockedNotification(task: Task) {
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('Task Blocked', {
        body: `Task "${task.title}" is blocked by dependencies`,
        icon: '/logo.png',
      });
    }

    toast.error(`Task blocked: ${task.title}`);
  }

  public showTaskCommentNotification(task: Task, commentAuthor: string) {
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('New Task Comment', {
        body: `${commentAuthor} commented on task "${task.title}"`,
        icon: '/logo.png',
      });
    }

    toast(`New comment on task: ${task.title}`, {
      icon: '💬',
    });
  }

  public showFileUploadNotification(fileName: string, fileSize: string) {
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('File Uploaded', {
        body: `File "${fileName}" (${fileSize}) has been uploaded successfully`,
        icon: '/logo.png',
      });
    }

    toast.success(`File "${fileName}" uploaded successfully`);
  }
}

export const notificationService = NotificationService.getInstance(); 
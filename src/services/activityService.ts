import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ActivityType = 
  | 'client_added'
  | 'client_updated'
  | 'client_deleted'
  | 'dispute_filed'
  | 'dispute_updated'
  | 'dispute_resolved'
  | 'payment_received'
  | 'letter_sent'
  | 'task_created'
  | 'task_completed'
  | 'task_deleted'
  | 'appointment_scheduled'
  | 'document_uploaded';

interface ActivityLog {
  type: ActivityType;
  description: string;
  user: string;
  timestamp: any;
  metadata?: Record<string, any>;
}

class ActivityService {
  private collection = collection(db, 'activity');

  async logActivity(activity: Omit<ActivityLog, 'timestamp'>) {
    try {
      await addDoc(this.collection, {
        ...activity,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Helper methods for common activities
  async logClientAdded(clientName: string, userId: string) {
    await this.logActivity({
      type: 'client_added',
      description: `Added new client: ${clientName}`,
      user: userId
    });
  }

  async logClientUpdated(clientName: string, userId: string) {
    await this.logActivity({
      type: 'client_updated',
      description: `Updated client: ${clientName}`,
      user: userId
    });
  }

  async logDisputeFiled(clientName: string, bureau: string, userId: string) {
    await this.logActivity({
      type: 'dispute_filed',
      description: `Filed dispute for ${clientName} with ${bureau}`,
      user: userId
    });
  }

  async logPaymentReceived(clientName: string, amount: number, userId: string) {
    await this.logActivity({
      type: 'payment_received',
      description: `Received payment of $${amount} from ${clientName}`,
      user: userId,
      metadata: { amount }
    });
  }

  async logTaskCreated(taskTitle: string, userId: string) {
    await this.logActivity({
      type: 'task_created',
      description: `Created new task: ${taskTitle}`,
      user: userId
    });
  }

  async logTaskCompleted(taskTitle: string, userId: string) {
    await this.logActivity({
      type: 'task_completed',
      description: `Completed task: ${taskTitle}`,
      user: userId
    });
  }

  async logAppointmentScheduled(clientName: string, date: Date, userId: string) {
    await this.logActivity({
      type: 'appointment_scheduled',
      description: `Scheduled appointment with ${clientName}`,
      user: userId,
      metadata: { date }
    });
  }

  async logDocumentUploaded(clientName: string, documentType: string, userId: string) {
    await this.logActivity({
      type: 'document_uploaded',
      description: `Uploaded ${documentType} for ${clientName}`,
      user: userId
    });
  }
}

export const activityService = new ActivityService(); 
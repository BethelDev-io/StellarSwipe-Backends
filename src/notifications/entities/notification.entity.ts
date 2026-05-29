import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
  TRADE_EXECUTED = 'TRADE_EXECUTED',
  TRADE_CLOSED = 'TRADE_CLOSED',
  SIGNAL_TARGET_HIT = 'SIGNAL_TARGET_HIT',
  SIGNAL_STOP_LOSS = 'SIGNAL_STOP_LOSS',
  MARKETING = 'MARKETING',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  BOTH = 'BOTH',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'email_message_id', nullable: true })
  emailMessageId: string | null;

  @Column({ name: 'push_message_id', nullable: true })
  pushMessageId: string | null;

  @Column({ name: 'sent_at', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'delivered_at', nullable: true })
  deliveredAt: Date | null;

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

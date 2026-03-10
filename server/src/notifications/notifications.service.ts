import { Injectable, Logger } from '@nestjs/common';
import Expo, { type ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  private expo = new Expo();
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    if (!Expo.isExpoPushToken(pushToken)) {
      this.logger.error(`유효하지 않은 토큰: ${String(pushToken)}`);
      return;
    }

    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    try {
      const chunks = this.expo.chunkPushNotifications([message]);
      for (const chunk of chunks) {
        await this.expo.sendPushNotificationsAsync(chunk);
      }
    } catch (error) {
      this.logger.error('푸시 알림 전송 실패:', error);
    }
  }
}
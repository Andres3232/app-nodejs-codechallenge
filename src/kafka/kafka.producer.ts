import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import { ConfigService } from '@nestjs/config';

export const sendKafkaMessage = async (
  topic: string,
  message: string,
): Promise<{ success: boolean; error?: any }> => {
  try {
    const configService = new ConfigService();
    const kafkaHost = configService.get<string>('KAFKA_HOST');
    console.log({ kafkaHost });
    const client = new KafkaClient({ kafkaHost });
    const producer = new Producer(client);

    const payloads: ProduceRequest[] = [{ topic, messages: message }];
    console.log(payloads);

    return new Promise((resolve, reject) => {
      producer.send(payloads, (err, data) => {
        console.log({ data });
        console.log({ err });

        if (err) {
          reject({ success: false, error: err });
        } else {
          resolve({ success: true });
        }
      });
    });
  } catch (error) {
    return { success: false, error };
  }
};
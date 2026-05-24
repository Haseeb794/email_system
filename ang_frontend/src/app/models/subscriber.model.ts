export interface Subscriber {
  id: number;
  name: string;
  email: string;
  confirmed: boolean;
}

export interface CreateSubscriberDto {
  name: string;
  email: string;
}

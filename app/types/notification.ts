export type Notification = {
    notificationKey: number;
    title: string;
    type: "info" | "success" | "error";
    message: string;
};

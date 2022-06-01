export interface TaskResponse {
    data: {
        _id?: string
        title?: string
        total_time?: string
        is_status?: string
    },
    status: Number,
    message: string
}
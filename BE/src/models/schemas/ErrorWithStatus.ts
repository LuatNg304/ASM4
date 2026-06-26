export class ErrorWithStatus extends Error {
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    super(message)
    this.status = status
  }
}

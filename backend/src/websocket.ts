import { Server as SocketIOServer } from 'socket.io'

export function setupWebSocket(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join-job', (jobId: string) => {
      socket.join(jobId)
      console.log(`Socket ${socket.id} joined job ${jobId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}

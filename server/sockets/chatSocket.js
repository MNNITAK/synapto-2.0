import Message from '../models/Message.js';

const onlineUsers = new Map();         // Map stores userId as the key and socket.id as the value

export const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      socket.on('join', (userId) => {
        socket.userId = userId;
        onlineUsers.set(userId, socket.id);            // Adds the user to the onlineUsers map with their userId as key and socket.id as value
        socket.join(userId);
        io.emit('update-user-status', Array.from(onlineUsers.keys()));    // Broadcast online users
        console.log(`User ${userId} joined their room`);
      });
  
      socket.on('send-message', ({ receiverId, message, isCommunity }) => {
        if (isCommunity) {
          socket.broadcast.emit("receive-message", message); // to all
        } else {
          socket.to(receiverId).emit("receive-message", message); // to specific user
        }
      });

      socket.on("typing", ({ receiverId }) => {
        socket.to(receiverId).emit("typing", { senderId: socket.userId });
      });

      socket.on('stop-typing', ({ receiverId }) => {
        socket.to(receiverId).emit('stop-typing', { senderId: socket.userId });
      });

      socket.on("message-delivered", async ({ messageId, senderId }) => {
        try {
          await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
          io.to(senderId).emit('message-status-updated', {
            messageId,
            status: 'delivered'
          });
        } catch (err) {
          console.error('Error updating to delivered:', err);
        }
      });
      
      socket.on("message-read", async ({ messageIds, senderId }) => {
        try {
          await Message.updateMany(
            { _id: { $in: messageIds } },
            { $set: { status: 'read' } }
          );
          io.to(senderId).emit('message-status-updated', {
            messageIds,
            status: 'read'
          });
        } catch (err) {
          console.error('Error updating to read:', err);
        }
      });
  
      socket.on('disconnect', () => {
        if (socket.userId) {
          onlineUsers.delete(socket.userId);          // Removes the disconnected user from the onlineUsers map using their userId
          io.emit('update-user-status', Array.from(onlineUsers.keys()));   // Broadcast update when a user leaves
        }
        console.log('User disconnected:', socket.id);
      });
    });
  };  
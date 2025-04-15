import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    channelName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    logoUrl: { 
      type: String, 
      required: true 
    },
    logoId: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: String, 
      default: "" 
    },
    cover: { 
      type: String, 
      default: "" 
    },
    subscribers: { 
      type: Number, 
      default: 0 
    },
    subscribedChannels: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    followers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    subscriptions: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    watchHistory: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Video" 
    }],
    refreshToken: { 
      type: String, 
      default: "" 
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
      required: true
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;

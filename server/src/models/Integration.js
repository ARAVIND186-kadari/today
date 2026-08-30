const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: String,
      enum: ['gmail', 'slack', 'google-sheets', 'discord', 'openrouter', 'gemini'],
      required: true,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    scopes: {
      type: [String],
      default: [],
    },
    encryptedAccessToken: {
      type: String,
      default: null,
    },
    encryptedRefreshToken: {
      type: String,
      default: null,
    },
    tokenIv: {
      type: String,
      default: null,
    },
    authTag: {
      type: String,
      default: null,
    },
    refreshTokenIv: {
      type: String,
      default: null,
    },
    refreshAuthTag: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    accountEmail: {
      type: String,
      default: '',
    },
    accountName: {
      type: String,
      default: '',
    },
    extraConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound index so a user has at most one integration document per provider
integrationSchema.index({ owner: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('Integration', integrationSchema);

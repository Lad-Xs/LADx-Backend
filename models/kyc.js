const mongoose = require('mongoose');
const { Schema } = mongoose;

// The kycSchema outlines the structure of the documents to be stored
// in the Kyc collection.
const kycSchema = new Schema(
  {
    residential_address: {
      type: String,
      required: true
    },

    work_address: {
      type: String,
      required: true
    },

    identityUrl: {
      type: String,
      required: trure
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, // Foreign key to User model

    role: {
      type: String,
      enum: ['sender', 'traveller']
    },

    created_at: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

const Kyc = mongoose.model('Kyc', KycSchema);

module.exports = Kyc;

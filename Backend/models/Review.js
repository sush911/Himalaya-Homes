const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per agent
reviewSchema.index({ agent: 1, user: 1 }, { unique: true });

// Static method to get average rating
reviewSchema.statics.getAverageRating = async function(agentId) {
  const obj = await this.aggregate([
    {
      $match: { agent: agentId }
    },
    {
      $group: {
        _id: '$agent',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Agent').findByIdAndUpdate(agentId, {
      rating: obj[0] ? obj[0].averageRating.toFixed(1) : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.agent);
});

module.exports = mongoose.model('Review', reviewSchema);
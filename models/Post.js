const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
    index: true
  },
  body: {
    type: String
  },
  category: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }, //1
}, {
    toObject: {
      virtuals: true
    }
  });
postSchema.virtual("createdDate").get(function () {
  return getDate(this.createdAt);
});

postSchema.virtual('createdTime').get(function () {
  return getTime(this.createdAt);
});

postSchema.virtual('updateDate').get(function () {
  return getDate(this.updatedAt);
});

postSchema.virtual('updateTime').get(function () {
  return getTime(this.updatedAt);
});

const Post = mongoose.model('post', postSchema);

function getDate(dateObj) {
  if (dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth() + 1) + "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj) {
  if (dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes()) + ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num) {
  return ("0" + num).slice(-2);
}



module.exports = Post;

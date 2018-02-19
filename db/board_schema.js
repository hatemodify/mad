let Schema ={};

Schema.createSchema = (mongoose)=>{
  const boardSchema = mongoose.Schema({
    write: {
      type: String, require: true
    },
    password: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true
    },
    created_at: {
      type: Date,
      index: {
        unique: false
      },
      'default': Date.now
    }
  });


  console.log('wirte Schema defined');


	boardSchema.static('findAll', function(callback) {
		return this.find({}, callback);
  });
  
  
  return boardSchema;
}

module.exports = Schema;
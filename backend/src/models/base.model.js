const mongoose = require("mongoose");

// Base schema options that might be common to multiple models
const baseOptions = {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
            ret.id = ret._id.toString();
            // delete ret._id;
            // delete ret.__v;
        },
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
            ret.id = ret._id.toString();
            // delete ret._id;
            // delete ret.__v;
        },
    },
};

// Example of how to create a schema:
/*
const ExampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // Add other fields as needed
}, baseOptions);

const Example = mongoose.model('Example', ExampleSchema);
module.exports = Example;
*/

module.exports = {
    baseOptions,
};

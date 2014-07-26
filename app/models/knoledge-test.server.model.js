'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Knoledge test Schema
 */
var KnoledgeTestSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Knoledge test name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('KnoledgeTest', KnoledgeTestSchema);
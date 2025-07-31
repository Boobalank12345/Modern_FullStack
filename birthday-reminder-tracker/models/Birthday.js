import mongoose from 'mongoose'

const BirthdaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide a date of birth'],
  },
  relationship: {
    type: String,
    enum: ['family', 'friend', 'colleague', 'acquaintance', 'other'],
    default: 'friend',
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  giftIdeas: [{
    type: String,
    maxlength: [100, 'Gift idea cannot be more than 100 characters'],
  }],
  reminderSettings: {
    enabled: {
      type: Boolean,
      default: true,
    },
    daysBefore: {
      type: Number,
      default: 7,
      min: [1, 'Reminder must be at least 1 day before'],
      max: [365, 'Reminder cannot be more than 365 days before'],
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create compound index for user and active birthdays
BirthdaySchema.index({ userId: 1, isActive: 1 })

// Create index for birthday date for efficient querying
BirthdaySchema.index({ dateOfBirth: 1 })

// Update the updatedAt field before saving
BirthdaySchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Virtual for age calculation
BirthdaySchema.virtual('age').get(function() {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

// Virtual for next birthday
BirthdaySchema.virtual('nextBirthday').get(function() {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }
  
  return nextBirthday
})

// Virtual for days until birthday
BirthdaySchema.virtual('daysUntilBirthday').get(function() {
  const today = new Date()
  const nextBirthday = this.nextBirthday
  const diffTime = nextBirthday - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
})

export default mongoose.models.Birthday || mongoose.model('Birthday', BirthdaySchema)
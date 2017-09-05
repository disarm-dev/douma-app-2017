import {UserSchema} from 'lib/models/user/schemas/schema'

export class User {
  constructor(user_json) {
    this.model = user_json
    this.decorate()
  }

  decorate() {
    this.model.app_commit_hash = VERSION_COMMIT_HASH_SHORT
  }

  is_valid() {
    window.u = this.model
    window.s = UserSchema

    if (UserSchema(this.model)) {
      return true
    } else {
      console.warn('UserSchema validation errors:', UserSchema.errors(this.model))
      return false
    }
  }
}

module.exports = class Player {
  constructor(user, avatar) {
    this.user = user;
    this.avatar = avatar;
  }

  mention() {
    return this.avatar.toString() + ' <@' + this.user.id + '>';
  }
}

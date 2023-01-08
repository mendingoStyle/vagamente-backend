module.exports = {
  async up(db, client) {
    return db.createCollection("posts")
  },

  async down(db, client) {
    return db.posts.drop()
  }
};

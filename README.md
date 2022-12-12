# GamBooru

GamBooru is a [booru](https://en.wiktionary.org/wiki/booru) site.

In short: It is a site for uploading images and categorizing them into tags. All members of the site can contribute to the fullness of the categorization by editing each other's posts.  
This documentation will not cover the backend as it is not a subject of the exam.

---

## Startup

1. Install all dependencies `npm install`
2. Start the project `npm start`

---

## Main usage

The average user is expected to:

- Make an account
- Use the search bar to find content of interest.
- Use collections and likes to save their favorite content.
- Edit posts to correct or add tags and sources.
- Interact with the community trough comments.
- Flag any inappropriate content.

---

## Interactions

> The main focus of the site is to upload images and tag them.

### Accounts

> Accounts have full CRUD and there are many ways to update them.

Users are authenticated using JWT tokens stored in the local storage and allow for access to more features of the site.

The site can be accessed by users without accounts but they cannot create, edit or delete content.

### Posts

> Posts have full CRUD.

Users can edit other people's posts (to better the quality of the post) but can not delete other people's posts directly.

If some user wishes to delete a post they have to "vote" for the deletion of the post. When enough people vote for that the post, along with all it's comments and flags, will be gone.

There is a flag system in place applicable for posts.

### Comments

> Comments have full CRUD.

You can interact with other people's comments by liking them, voting for their deletion or flagging them.

### Tags

> Tags have full CRUD. This can change depending on user input though.

Users can vote for a tag to be locked which will prevent other users from editing or deleting it.

Voting for lock happens when you consider the tag to be perfect in it's current form. When enough people vote for that, it will automatically be locked.

### Collections

> Collections have full CRUD.

Collections are galleries users can save posts in. They are visible to everyone but only editable by the author.

### Flags

> Flags can not be deleted trough conventional means, to delete a flag you must delete whatever it is attached to.

Flags appear in their own separate dashboard and are used to bring attention to a post or comment. This is a tool for self moderation on the site.

When a flag is created the author's name is displayed for everyone to encourage people to flag responsibly as it is tied to their name. The person that resolves the flag is also displayed for everyone as to encourage people to resolve flags responsibly.

All posts have a flag history tab that can display all active and resolved flags. This is in place to detect spam flagging.

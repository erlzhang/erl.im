import Cookies from 'js-cookie'

export default class {
  constructor (name, email, comments_count=0) {
    this.name = name
    this.email = email
    this.comments = Number(comments)

    this.EXPIRE_DAYS = 365
  }

  save () {
    Cookies.set('name', this.name, { expires: this.EXPIRE_DAYS })  
    Cookies.set('email', this.email, { expires: this.EXPIRE_DAYS })
    Cookies.set('comments', 0, { expires: this.EXPIRE_DAYS })
  }

  set_name (name) {
    this.name = name
    Cookies.set('name', this.name, { expires: this.EXPIRE_DAYS })  
  }

  set_email () {
    this.email = email
    Cookies.set('email', this.email, { expires: this.EXPIRE_DAYS })  
  }

  add_comment () {
    Cookies.set('comments', ++this.comments, { expires: this.EXPIRE_DAYS })  
  }

}

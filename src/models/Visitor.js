import Cookies from 'js-cookie'

export default class {
  constructor (name, email, website) {
    this.name = name
    this.email = email
    this.website = website

    this.EXPIRE_DAYS = 365
  }

  save () {
    Cookies.set('name', this.name, { expires: this.EXPIRE_DAYS })  
    Cookies.set('email', this.email, { expires: this.EXPIRE_DAYS })
  }

  set_name (name) {
    this.name = name
    Cookies.set('name', this.name, { expires: this.EXPIRE_DAYS })  
  }

  set_email () {
    this.email = email
    Cookies.set('email', this.email, { expires: this.EXPIRE_DAYS })  
  }

}

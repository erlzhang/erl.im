const $ = require("jquery");
window.jQuery = $;
import Cookies from 'js-cookie'

import Visitor from '../models/Visitor'

import TimeHelper from '../helpers/TimeHelper'


export default class {
  constructor () {
    this.list = document.getElementById("comments")

    this.form = document.getElementById("newComment")

    this.postURL = this.form.action 
    this.nameInput = document.getElementsByName("fields[name]")[0]
    this.emailInput = document.getElementsByName("fields[email]")[0]
    this.messageArea = document.getElementsByName("fields[message]")[0]
    this.avatarImg = document.getElementById("visitorAvatar")

    this.submitBtn = document.getElementById("submitBtn")

    this.visitor = this.getVisitor()
    if ( this.visitor ) {
      this.initVisitorInfo()
    }

    this.disableBtn()

    this.messageArea.addEventListener("input", (e) => {
      if ( this.messageArea.value.length > 0 && this.submitBtn.disabled ) {
        this.enableBtn()
      } else if ( this.messageArea.value.length == 0 && !this.submitBtn.disabled ) {
        this.disableBtn()
      }
    })

    this.form.addEventListener("submit", (event) => {
      event.preventDefault()

      if ( this.visitor ) {
        this.checkVisitorInfo() 
      } else {
        this.newVisitor()
      }

      this.disableBtn(true)
      const data = $(this.form).serialize()
      this.sendRequest(data)
    })
  }

  newVisitor () {
    this.visitor = new Visitor(this.nameInput.value, this.emailInput.value)
    this.visitor.save()
  }

  getVisitor () {
    let name = Cookies.get("name"),
        email = Cookies.get("email")

    console.log(name)

    if ( name ) {
      return new Visitor(name, email)
    }
  }

  checkVisitorInfo () {
    if ( this.visitor.name != this.nameInput.value ) {
      this.visitor.set_name(this.nameInput.value)
    }
    if ( this.visitor.email != this.emailInput.value ) {
      this.visitor.set_email(this.emailInput.value)
    }
  }

  initVisitorInfo () {
    this.nameInput.value = this.visitor.name
    this.emailInput.value = this.visitor.email || ""
    this.avatarImg.src = this.visitor.avatar
  }

  sendRequest (data) {
    $.ajax({
      url: this.postURL,
      type: "post",
      data: data,
      complete: () => {
        this.enableBtn()
      },
      success: (res) => {
        this.clearMessage()
        this.addComment(res.fields)
      },
      error: () => {
        this.showError();
      }
    })
  }

  showError (message) {
  }

  addComment (comment) {
    let content = this.parseComment(comment) 
    this.list.insertBefore(content, this.list.childNodes[0])
    this.visitor.add_comment()
  }

  parseComment (comment) {
    let content = document.createElement("div")
    content.classList.add("comment", "comment_new")
    content.innerHTML = '<div class="comment__meta"><div class="comment__avatar"><img src="https://www.gravatar.com/avatar/' + comment.email + '?d=mm&s=50" alt=""></div><span class="comment__author">' + comment.name + '</span><span class="comment__date">' + TimeHelper.timestampToTime(comment.date) + '</span></div><div class="comment__content">' + comment.message + '</div>'
    return content
  }

  clearMessage () {
    this.messageArea.innerText = ""
    this.messageArea.value = ""
  }

  disableBtn (isInSubmit=false) {
    this.submitBtn.disabled = true
    if ( isInSubmit ) {
      this.submitBtn.innerHTML = "发送中，稍等..."
    }
  }

  enableBtn () {
    this.submitBtn.disabled = false
    this.submitBtn.innerHTML = "Go!"
  }

}

import html from "html-literal"
export default () =>



  html`<form>
<body>
      <div>
        <label for="fname"> first name:</label>
        <input type="text" id="fname" name="fname" placeholder="FnameCustomer" required>
      </div>

      <div>
        <label for="lname"> last name:</label>
        <input type="text" id="lname" name="lname" placeholder="LnameCustomer" required/>
      </div>
      <br>

        <div>
          <input type= "submit"/>
        </div>

        <label for="phone"> phone #:</label>
        <input type="tel" id="phone" name="phone" placeholder="(123-123-1234)" required>
          <div>

            <label for="email"> email:</label>
            <input type="email" id="email" name="email" placeholder="customeremail@gmail.com" required/>
          </div>

/</body>
        </form>`

